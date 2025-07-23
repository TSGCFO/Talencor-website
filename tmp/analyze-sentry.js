// ES module compatible
const res = await fetch('http://localhost:5000/api/sentry-feedback');
const data = await res.json();
const issues = data.unresolvedIssues || [];

console.log(`Total issues: ${issues.length}\n`);

// Group issues by type
const grouped = {};
issues.forEach(issue => {
  const key = issue.title.includes('User Feedback') ? 'User Feedback' : issue.title;
  if (!grouped[key]) {
    grouped[key] = [];
  }
  grouped[key].push(issue);
});

// Show unique issues
Object.entries(grouped).forEach(([title, items]) => {
  console.log(`\n${title} (${items.length} occurrences)`);
  const issue = items[0];
  console.log(`   File: ${issue.metadata?.filename || 'Unknown'}`);
  console.log(`   Function: ${issue.metadata?.function || 'Unknown'}`);
  console.log(`   Error: ${issue.metadata?.value || 'Unknown'}`);
  console.log(`   Type: ${issue.metadata?.type || 'Unknown'}`);
  console.log(`   Culprit: ${issue.culprit || 'Unknown'}`);
});