import { Request, Response } from 'express';

export async function getSentryFeedbackSummary(req: Request, res: Response) {
  try {
    const authToken = process.env.SENTRY_AUTH_TOKEN || "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";
    const org = process.env.SENTRY_ORG || "tsg-fulfillment";
    const project = process.env.SENTRY_PROJECT || "talencor-frontend";
    const projectId = "4509575724613632";

    console.log(`\n=== Sentry Feedback Check ===`);
    console.log(`Organization: ${org}`);
    console.log(`Project: ${project}`);
    console.log(`Project ID: ${projectId}`);

    // Check user reports endpoint
    const userReportsUrl = `https://sentry.io/api/0/projects/${org}/${project}/user-reports/`;
    const response = await fetch(userReportsUrl, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    let userReports = [];
    if (response.ok) {
      userReports = await response.json();
    }

    const summary = {
      organization: org,
      project: project,
      projectId: projectId,
      userFeedback: {
        total: userReports.length,
        open: 0,
        resolved: 0,
        reports: userReports
      },
      status: userReports.length === 0 ? "No user feedback found" : "User feedback found"
    };

    console.log(`\n=== Summary ===`);
    console.log(`Total User Feedback: ${summary.userFeedback.total}`);
    console.log(`Status: ${summary.status}`);

    res.json(summary);
  } catch (error) {
    console.error("Error checking Sentry feedback:", error);
    res.status(500).json({ 
      error: "Failed to check Sentry feedback",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}