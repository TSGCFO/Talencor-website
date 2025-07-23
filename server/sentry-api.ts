import { Request, Response } from 'express';

interface SentryIssue {
  id: string;
  title: string;
  status: 'resolved' | 'unresolved' | 'ignored';
  culprit?: string;
  permalink?: string;
}

// Mock Sentry API endpoints for demonstration
// In production, these would connect to actual Sentry API
export async function getSentryIssues(req: Request, res: Response) {
  try {
    // Simulate the 12 issues that were reported and fixed
    const mockIssues: SentryIssue[] = [
      {
        id: "1",
        title: "Grammar: Team Leader Program - missing 's'",
        status: "resolved",
        culprit: "home.tsx:247",
        permalink: "https://sentry.io/issues/1"
      },
      {
        id: "2", 
        title: "Footer: Policy links inconsistency",
        status: "resolved",
        culprit: "footer.tsx:45",
        permalink: "https://sentry.io/issues/2"
      },
      {
        id: "3",
        title: "Address: Postal code format inconsistency", 
        status: "resolved",
        culprit: "constants.ts:12",
        permalink: "https://sentry.io/issues/3"
      },
      {
        id: "4",
        title: "Hyphenation: Cost-Effective should not be hyphenated",
        status: "resolved", 
        culprit: "home.tsx:156",
        permalink: "https://sentry.io/issues/4"
      },
      {
        id: "5",
        title: "Hyphenation: 24/7 employer should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:158", 
        permalink: "https://sentry.io/issues/5"
      },
      {
        id: "6",
        title: "Hyphenation: WSIB claims should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:160",
        permalink: "https://sentry.io/issues/6"
      },
      {
        id: "7",
        title: "Punctuation: State-of-the-art needs em dash",
        status: "resolved",
        culprit: "home.tsx:162",
        permalink: "https://sentry.io/issues/7"
      },
      {
        id: "8", 
        title: "Contact: Phone number format correction",
        status: "resolved",
        culprit: "constants.ts:15",
        permalink: "https://sentry.io/issues/8"
      },
      {
        id: "9",
        title: "Grammar: 10+ employees apostrophe error",
        status: "resolved", 
        culprit: "home.tsx:220",
        permalink: "https://sentry.io/issues/9"
      },
      {
        id: "10",
        title: "Grammar: Our clients' success starts",
        status: "resolved",
        culprit: "home.tsx:225",
        permalink: "https://sentry.io/issues/10"
      },
      {
        id: "11",
        title: "Spacing: rest assured - remove hyphen",
        status: "resolved",
        culprit: "benefits-section.tsx:62",
        permalink: "https://sentry.io/issues/11"
      },
      {
        id: "12",
        title: "Hyphenation: work ethic should not be hyphenated", 
        status: "resolved",
        culprit: "home.tsx:277",
        permalink: "https://sentry.io/issues/12"
      }
    ];

    res.json({
      success: true,
      issues: mockIssues,
      total: mockIssues.length,
      resolved: mockIssues.filter(issue => issue.status === 'resolved').length
    });
  } catch (error) {
    console.error('Error fetching Sentry issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Sentry issues'
    });
  }
}

export async function resolveSentryIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params;
    const { resolution_type = 'resolved', comment } = req.body;

    // In production, this would make actual API call to Sentry
    // For now, simulate successful resolution
    console.log(`Marking Sentry issue ${issueId} as ${resolution_type}`);
    if (comment) {
      console.log(`Resolution comment: ${comment}`);
    }

    res.json({
      success: true,
      message: `Issue ${issueId} marked as ${resolution_type}`,
      issue: {
        id: issueId,
        status: resolution_type,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'automated-fix',
        comment
      }
    });
  } catch (error) {
    console.error('Error resolving Sentry issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve Sentry issue'
    });
  }
}

export async function bulkResolveSentryIssues(req: Request, res: Response) {
  try {
    const { issueIds, resolution_type = 'resolved', comment } = req.body;

    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        error: 'issueIds must be an array'
      });
    }

    // In production, this would make bulk API call to Sentry
    console.log(`Bulk resolving ${issueIds.length} Sentry issues as ${resolution_type}`);
    if (comment) {
      console.log(`Bulk resolution comment: ${comment}`);
    }

    const resolvedIssues = issueIds.map(id => ({
      id,
      status: resolution_type,
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'automated-fix',
      comment
    }));

    res.json({
      success: true,
      message: `${issueIds.length} issues marked as ${resolution_type}`,
      resolved: resolvedIssues
    });
  } catch (error) {
    console.error('Error bulk resolving Sentry issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk resolve Sentry issues'
    });
  }
}