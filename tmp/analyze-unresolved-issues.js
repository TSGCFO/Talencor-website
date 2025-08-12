import fs from 'fs';

// Read the JSON file
const data = JSON.parse(fs.readFileSync('/tmp/sentry-issues.json', 'utf8'));

console.log('='.repeat(80));
console.log('SENTRY UNRESOLVED ISSUES REPORT');
console.log('='.repeat(80));
console.log(`Generated: ${new Date().toISOString()}`);
console.log(`Total Unresolved Issues: ${data.issues.length}`);
console.log('='.repeat(80));

// Separate feedback from technical issues
const feedbackIssues = data.issues.filter(issue => issue.type === 'feedback');
const technicalIssues = data.issues.filter(issue => issue.type !== 'feedback');

console.log('\n📊 SUMMARY');
console.log('-'.repeat(40));
console.log(`Technical Issues: ${technicalIssues.length}`);
console.log(`User Feedback Issues: ${feedbackIssues.length}`);

// Display Technical Issues
if (technicalIssues.length > 0) {
  console.log('\n\n🐛 TECHNICAL ISSUES (Errors/Exceptions)');
  console.log('='.repeat(80));
  
  technicalIssues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${issue.title}`);
    console.log('-'.repeat(60));
    console.log(`   ID: ${issue.id}`);
    console.log(`   Short ID: ${issue.shortId}`);
    console.log(`   Status: ${issue.status}`);
    console.log(`   Level: ${issue.level}`);
    console.log(`   Error Type: ${issue.metadata?.type || 'Unknown'}`);
    console.log(`   File: ${issue.metadata?.filename || 'Unknown'}`);
    console.log(`   Function: ${issue.metadata?.function || 'Unknown'}`);
    console.log(`   Error Message: ${issue.metadata?.value || 'Unknown'}`);
    console.log(`   Permalink: ${issue.permalink}`);
  });
}

// Display User Feedback Issues
if (feedbackIssues.length > 0) {
  console.log('\n\n💬 USER FEEDBACK ISSUES');
  console.log('='.repeat(80));
  
  feedbackIssues.forEach((issue, index) => {
    const metadata = issue.metadata || {};
    const title = metadata.title || issue.title || 'No title';
    const message = metadata.message || metadata.value || 'No message';
    const email = metadata.contact_email || 'Not provided';
    const name = metadata.name || 'Anonymous';
    
    console.log(`\n${index + 1}. ${title.substring(0, 80)}`);
    console.log('-'.repeat(60));
    console.log(`   ID: ${issue.id}`);
    console.log(`   Short ID: ${issue.shortId}`);
    console.log(`   Status: ${issue.status}`);
    console.log(`   Submitted by: ${name} (${email})`);
    console.log(`   \n   Feedback Message:`);
    console.log(`   ${'-'.repeat(56)}`);
    
    // Wrap long message text
    const lines = message.match(/.{1,70}(\s|$)/g) || [message];
    lines.forEach(line => {
      console.log(`   ${line.trim()}`);
    });
    
    console.log(`   ${'-'.repeat(56)}`);
    console.log(`   Permalink: ${issue.permalink}`);
  });
}

// List of all issues with direct links
console.log('\n\n📋 QUICK REFERENCE - ALL UNRESOLVED ISSUES');
console.log('='.repeat(80));
console.log('\nTechnical Issues:');
technicalIssues.forEach((issue, index) => {
  console.log(`  ${index + 1}. [${issue.shortId}] ${issue.title.substring(0, 60)}...`);
});

console.log('\nUser Feedback Issues:');
feedbackIssues.forEach((issue, index) => {
  const title = (issue.metadata?.title || issue.title || 'No title')
    .replace('User Feedback: ', '')
    .substring(0, 60);
  console.log(`  ${index + 1}. [${issue.shortId}] ${title}...`);
});

console.log('\n' + '='.repeat(80));
console.log('END OF REPORT');
console.log('='.repeat(80));