import { Request, Response } from 'express';

const SENTRY_AUTH_TOKEN = "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";
const SENTRY_ORG = "tsg-fulfillment";
const SENTRY_PROJECT = process.env.SENTRY_PROJECT_SLUG || "talencor-frontend";

interface SentryIssue {
  id: string;
  title: string;
  shortId: string;
  status: string;
  level: string;
  permalink: string;
  metadata?: any;
}

// Get actual Sentry issues
export async function getActualSentryIssues(req: Request, res: Response) {
  try {
    // Build query parameters to fetch unresolved issues
    const queryParams = new URLSearchParams({
      query: 'is:unresolved', // Only fetch unresolved issues
      limit: '100', // Fetch up to 100 issues
      sort: 'date', // Sort by most recent
      statsPeriod: '14d' // Last 14 days
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
        metadata: issue.metadata
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
    const { issueIds, status = 'resolved', comment } = req.body;

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

        if (response.ok) {
          const updatedIssue = await response.json();
          results.push({
            id: updatedIssue.id,
            status: updatedIssue.status,
            title: updatedIssue.title,
            shortId: updatedIssue.shortId
          });
        } else {
          errors.push({
            issueId,
            error: `HTTP ${response.status}: ${response.statusText}`
          });
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
      `https://sentry.io/api/0/issues/${issueId}/notes/`,
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