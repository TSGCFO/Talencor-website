async function checkSentryIssues() {
  try {
    // Get all issues
    const response = await fetch('http://localhost:5000/api/sentry/actual/issues');
    const data = await response.json();
    
    if (data.success && data.issues) {
      console.log(`\nFound ${data.issues.length} issues in Sentry:\n`);
      
      data.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.title}`);
        console.log(`   ID: ${issue.id}`);
        console.log(`   Level: ${issue.level}`);
        console.log(`   Status: ${issue.status}`);
        if (issue.metadata) {
          console.log(`   Type: ${issue.metadata.type || 'N/A'}`);
          console.log(`   Value: ${issue.metadata.value || 'N/A'}`);
        }
        console.log(`   Link: ${issue.permalink}`);
        console.log('---');
      });
    } else {
      console.log('No issues found or error fetching issues');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSentryIssues();