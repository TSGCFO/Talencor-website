async function checkNonFeedbackIssues() {
  try {
    const response = await fetch('http://localhost:5000/api/sentry/actual/issues');
    const data = await response.json();
    
    if (!data.success) {
      console.log('Failed to fetch issues');
      return;
    }
    
    const issues = data.issues || [];
    const feedbackIssues = issues.filter(issue => issue.type === 'feedback');
    const nonFeedbackIssues = issues.filter(issue => issue.type !== 'feedback');
    
    console.log(`\nSentry Issues Summary:`);
    console.log(`Total issues: ${issues.length}`);
    console.log(`Feedback issues: ${feedbackIssues.length}`);
    console.log(`Non-feedback issues (errors/exceptions): ${nonFeedbackIssues.length}`);
    console.log();
    
    if (nonFeedbackIssues.length > 0) {
      console.log('Non-feedback issues found:');
      nonFeedbackIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.title}`);
        console.log(`   ID: ${issue.id}`);
        console.log(`   Level: ${issue.level}`);
        console.log(`   Status: ${issue.status}`);
        console.log(`   Type: ${issue.type || 'issue'}`);
        if (issue.metadata?.value) {
          console.log(`   Error: ${issue.metadata.value.substring(0, 100)}...`);
        }
      });
    } else {
      console.log('✓ No non-feedback issues found in Sentry.');
      console.log('✓ All errors, exceptions, and technical issues have been resolved.');
      console.log('\nOnly user feedback remains:');
      feedbackIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.title.replace('User Feedback: ', '').substring(0, 60)}...`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkNonFeedbackIssues();