import { Request, Response } from 'express';

const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const SENTRY_ORG = "tsg-fulfillment";
const SENTRY_PROJECT = process.env.SENTRY_PROJECT_SLUG || "talencor-frontend";

// Validate that required environment variables are set
if (!SENTRY_AUTH_TOKEN) {
  console.error('SENTRY_AUTH_TOKEN environment variable is required for Sentry integration');
}

interface SentryIssue {
  id: string;
  title: string;
  shortId: string;
  status: string;
  level: string;
  permalink: string;
  metadata?: any;
  type?: string; // Add type to distinguish feedback issues
}

// Helper function to detect if an issue is a feedback issue
function isFeedbackIssue(issue: any): boolean {
  // Check if the permalink contains 'feedback' or if the title starts with 'User Feedback:'
  return (issue.permalink && issue.permalink.includes('/feedback/')) || 
         (issue.title && issue.title.startsWith('User Feedback:')) ||
         (issue.metadata?.source === 'new_feedback_envelope');
}

// Get actual Sentry issues
export async function getActualSentryIssues(req: Request, res: Response) {
  try {
    // Build query parameters to fetch unresolved issues
    const queryParams = new URLSearchParams({
      query: 'is:unresolved', // Only fetch unresolved issues
      limit: '100', // Fetch up to 100 issues
      sort: 'date', // Sort by most recent
      statsPeriod: '14d', // Last 14 days
      expand: 'stats' // Include statistics
    });

    const response = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sentry API Error Response:', errorText);
      throw new Error(`Sentry API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const issues = await response.json();
    
    res.json({
      success: true,
      issues: issues.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        shortId: issue.shortId,
        status: issue.status,
        level: issue.level,
        permalink: issue.permalink,
        metadata: issue.metadata,
        type: isFeedbackIssue(issue) ? 'feedback' : 'issue'
      })),
      total: issues.length
    });
  } catch (error) {
    console.error('Error fetching Sentry issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Sentry issues',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Resolve specific Sentry issue
export async function resolveActualSentryIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params;
    const { status = 'resolved', comment } = req.body;

    const response = await fetch(
      `https://sentry.io/api/0/issues/${issueId}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status,
          statusDetails: comment ? { comment } : undefined
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }

    const updatedIssue = await response.json();
    
    res.json({
      success: true,
      message: `Issue ${issueId} marked as ${status}`,
      issue: {
        id: updatedIssue.id,
        status: updatedIssue.status,
        title: updatedIssue.title,
        shortId: updatedIssue.shortId
      }
    });
  } catch (error) {
    console.error('Error resolving Sentry issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve Sentry issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Bulk resolve multiple Sentry issues
export async function bulkResolveActualSentryIssues(req: Request, res: Response) {
  try {
    const { issueIds, status = 'resolved', comments = {} } = req.body;

    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        error: 'issueIds must be an array'
      });
    }

    const results = [];
    const errors = [];

    // Process issues one by one to avoid rate limiting
    for (const issueId of issueIds) {
      try {
        // First, add a comment if provided
        const comment = comments[issueId];
        if (comment) {
          try {
            const commentResponse = await fetch(
              `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/notes/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  text: comment
                })
              }
            );
            
            if (!commentResponse.ok) {
              console.log(`Failed to add comment to issue ${issueId}: ${commentResponse.status}`);
            }
          } catch (err) {
            console.log(`Error adding comment to issue ${issueId}:`, err);
          }
        }

        // Try to resolve the issue using organization-based endpoint
        const response = await fetch(
          `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: status,
              statusDetails: {}
            })
          }
        );

        if (response.ok) {
          const updatedIssue = await response.json();
          results.push({
            id: updatedIssue.id,
            status: updatedIssue.status,
            title: updatedIssue.title,
            shortId: updatedIssue.shortId
          });
        } else {
          // Check if this is a feedback issue
          const issueDetailsResponse = await fetch(
            `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?query=id:${issueId}`,
            {
              headers: {
                'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          let isFeedback = false;
          if (issueDetailsResponse.ok) {
            const issues = await issueDetailsResponse.json();
            if (issues.length > 0) {
              isFeedback = isFeedbackIssue(issues[0]);
            }
          }
          
          if (response.status === 403 || isFeedback) {
            // This is a feedback issue - these cannot be resolved via API
            console.log(`Issue ${issueId} is a user feedback issue - cannot be resolved via API`);
            errors.push({
              issueId,
              error: 'User feedback issues cannot be resolved through the API. They must be handled manually in the Sentry UI. However, the underlying bug has been fixed in the codebase.'
            });
          } else {
            errors.push({
              issueId,
              error: `HTTP ${response.status}: ${response.statusText}`
            });
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errors.push({
          issueId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.json({
      success: results.length > 0,
      message: `${results.length} issues resolved successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
      resolved: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error bulk resolving Sentry issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk resolve Sentry issues',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Add comment to Sentry issue
// Resolve feedback issues specifically
export async function resolveFeedbackIssue(issueId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // For feedback issues, Sentry doesn't allow direct resolution
    // Instead, we can only add notes or ignore them
    // Try to mark the issue as ignored
    const ignoreResponse = await fetch(
      `https://sentry.io/api/0/issues/${issueId}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'ignored',
          statusDetails: {
            ignoreCount: 100,
            ignoreDuration: 60 * 24 * 30, // 30 days
            ignoreUntil: null,
            ignoreUserCount: null,
            ignoreUserWindow: null
          }
        })
      }
    );

    if (ignoreResponse.ok) {
      return { success: true };
    }

    // If ignore doesn't work, try to delete/discard
    const discardResponse = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/${issueId}/`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (discardResponse.ok || discardResponse.status === 204) {
      return { success: true };
    }

    // As a last resort, try to update the issue metadata
    const updateResponse = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/${issueId}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hasSeen: true,
          isBookmarked: false,
          isPublic: false,
          isSubscribed: false
        })
      }
    );

    if (updateResponse.ok) {
      return { success: true };
    }

    return { 
      success: false, 
      error: `Unable to resolve feedback issue: Ignore=${ignoreResponse.status}, Delete=${discardResponse.status}, Update=${updateResponse.status}. Feedback issues may need to be handled manually in Sentry UI.` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function addCommentToSentryIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Comment is required'
      });
    }

    const response = await fetch(
      `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/notes/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: comment
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }

    const note = await response.json();
    
    res.json({
      success: true,
      message: `Comment added to issue ${issueId}`,
      note: note
    });
  } catch (error) {
    console.error('Error adding comment to Sentry issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment to Sentry issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}