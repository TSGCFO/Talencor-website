import fetch from 'node-fetch';

const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const SENTRY_ORG = process.env.SENTRY_ORG || 'talencor';
const BACKEND_PROJECT_ID = '4509576795521024';

async function fetchBackendIssues() {
  try {
    console.log('Fetching open and unresolved issues from talencor-backend project...\n');
    
    const response = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/talencor-backend/issues/?query=is%3Aunresolved`,
      {
        headers: {
          'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }

    const issues = await response.json();
    
    console.log(`Found ${issues.length} unresolved issues in talencor-backend:\n`);
    
    if (issues.length === 0) {
      console.log('✓ No unresolved issues found in the backend project!');
      return;
    }
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.title || issue.culprit}`);
      console.log(`   ID: ${issue.id}`);
      console.log(`   Status: ${issue.status}`);
      console.log(`   Level: ${issue.level}`);
      console.log(`   Count: ${issue.count}`);
      console.log(`   First seen: ${new Date(issue.firstSeen).toLocaleString()}`);
      console.log(`   Last seen: ${new Date(issue.lastSeen).toLocaleString()}`);
      
      if (issue.metadata) {
        console.log(`   Type: ${issue.metadata.type || 'Unknown'}`);
        if (issue.metadata.value) {
          console.log(`   Value: ${issue.metadata.value}`);
        }
      }
      
      console.log(`   Link: https://sentry.io/organizations/${SENTRY_ORG}/issues/${issue.id}/`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error fetching backend issues:', error.message);
  }
}

fetchBackendIssues();