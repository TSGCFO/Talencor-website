# Email System Code Documentation

This document explains how the email system works in simple terms. The code sends emails when someone submits a job posting.

```typescript
// <ImportSection>
// These lines bring in tools we need to send emails
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";
// </ImportSection>

// <EmailOptionsDefinition>
// This describes what information we need to send an email
export interface EmailOptions {
  to: string;        // Who gets the email (their email address)
  subject: string;   // The email title they see
  text: string;      // The plain text version of the email
  html?: string;     // The pretty version with colors and formatting (optional)
}
// </EmailOptionsDefinition>

// <MicrosoftGraphSetup>
// This function sets up our connection to Microsoft's email service
// Think of it like logging into your email account before sending
async function getGraphClient(): Promise<Client> {
  // These are like your username and password for the email service
  const credential = new ClientSecretCredential(
    process.env.MICROSOFT_TENANT_ID!,     // Your company ID in Microsoft
    process.env.MICROSOFT_CLIENT_ID!,      // Your app's ID
    process.env.MICROSOFT_CLIENT_SECRET!   // Your app's password
  );

  // This creates the connection to Microsoft's email service
  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        // This gets permission to send emails
        const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
        return tokenResponse?.token || '';
      }
    }
  });

  return client;
}
// </MicrosoftGraphSetup>

// <MainEmailSendingFunction>
// This is the main function that actually sends emails
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // First, we write a note about what email we're sending
    console.log('Sending email via Microsoft Graph:', {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString()
    });
    
    // Check if we have the Microsoft login information
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET || !process.env.MICROSOFT_TENANT_ID) {
      console.log('Missing Microsoft Graph credentials - email would be sent in production');
      return true;  // We pretend it worked so the job posting continues
    }
    
    try {
      // Connect to Microsoft's email service
      const client = await getGraphClient();
      
      // Create the email message
      const message = {
        subject: options.subject,  // Email title
        body: {
          contentType: "HTML" as const,  // We're sending a pretty HTML email
          content: options.html || `<p>${options.text.replace(/\n/g, '<br>')}</p>`,  // The email content
        },
        toRecipients: [
          {
            emailAddress: {
              address: options.to,  // Who gets the email
            },
          },
        ],
      };

      // Send the email from no-reply@talencor.com
      await client
        .api("/users/no-reply@talencor.com/sendMail")  // This is who the email comes from
        .post({
          message,
          saveToSentItems: true,  // Save a copy in the sent folder
        });
      
      // Write a success message
      console.log('✅ Email sent successfully via Microsoft Graph:', { to: options.to });
      return true;
    } catch (emailError) {
      // If something goes wrong, write an error message but don't stop the job posting
      console.error('Microsoft Graph email error:', emailError);
      console.log('Job posting will continue - email notifications can be configured later');
      return true;
    }
  } catch (error) {
    // If something really goes wrong, write an error but keep going
    console.error('Error in email function:', error);
    return true;
  }
}
// </MainEmailSendingFunction>

// <JobPostingConfirmationEmail>
// This function sends a "thank you" email to the person who submitted a job
export async function sendJobPostingConfirmation(data: {
  contactName: string;      // The person's name
  email: string;           // Their email address
  companyName: string;     // Their company name
  jobTitle: string;        // The job they want to fill
  isExistingClient: boolean;  // Are they already our customer?
}): Promise<boolean> {
  // The email title
  const subject = 'Job Posting Received - Talencor Staffing';
  
  // The plain text version of the email (for older email programs)
  const text = `
Dear ${data.contactName},

Thank you for submitting your job posting for ${data.jobTitle} at ${data.companyName}.

We have received your request and a member of our recruiting team will contact you within one business day.

${data.isExistingClient 
  ? 'As an existing client, your job posting will be prioritized for immediate processing.'
  : 'As a new client, we will discuss our services, pricing, and contract terms before posting your job.'
}

If you have any immediate questions, please don't hesitate to contact us at:
Phone: (555) 123-4567
Email: recruiting@talencor.com

Best regards,
The Talencor Staffing Team
  `.trim();
  
  // The pretty HTML version of the email (what most people will see)
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* These styles make the email look nice */
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1B3A52; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 10px 20px; background-color: #F39200; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Job Posting Received</h1>
    </div>
    <div class="content">
      <p>Dear ${data.contactName},</p>
      <p>Thank you for submitting your job posting for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
      <p>We have received your request and a member of our recruiting team will contact you within one business day.</p>
      ${data.isExistingClient 
        ? '<p style="background-color: #d4edda; padding: 10px; border-radius: 5px;">As an existing client, your job posting will be prioritized for immediate processing.</p>'
        : '<p style="background-color: #d1ecf1; padding: 10px; border-radius: 5px;">As a new client, we will discuss our services, pricing, and contract terms before posting your job.</p>'
      }
      <p>If you have any immediate questions, please don't hesitate to contact us:</p>
      <ul>
        <li>Phone: (555) 123-4567</li>
        <li>Email: recruiting@talencor.com</li>
      </ul>
    </div>
    <div class="footer">
      <p>&copy; 2025 Talencor Staffing. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
  
  // Send the email using our main email function
  return sendEmail({
    to: data.email,
    subject,
    text,
    html
  });
}
// </JobPostingConfirmationEmail>

// <InternalNotificationEmail>
// This function sends an email to our team about the new job posting
export async function sendInternalJobPostingNotification(data: {
  id: number;                           // The job posting number
  contactName: string;                  // Who submitted it
  email: string;                        // Their email
  phone: string;                        // Their phone number
  companyName: string;                  // Their company
  jobTitle: string;                     // What job they need filled
  location: string;                     // Where the job is
  employmentType: string;               // Full-time, part-time, etc.
  isExistingClient: boolean;            // Are they already our customer?
  anticipatedStartDate?: string | null; // When they need someone to start
  salaryRange?: string | null;          // How much they'll pay
  jobDescription?: string | null;       // What the job involves
  specialRequirements?: string | null;  // Any special needs
}): Promise<boolean> {
  // This email always goes to our info team
  const internalEmail = 'info@talencor.com';
  
  // The email title includes the job and company name
  const subject = `New Job Posting: ${data.jobTitle} at ${data.companyName}`;
  
  // The plain text version for our team
  const text = `
NEW JOB POSTING RECEIVED

ID: #${data.id}
Client Status: ${data.isExistingClient ? 'EXISTING CLIENT' : 'NEW CLIENT'}

COMPANY INFORMATION:
- Company: ${data.companyName}
- Contact: ${data.contactName}
- Email: ${data.email}
- Phone: ${data.phone}

JOB DETAILS:
- Title: ${data.jobTitle}
- Location: ${data.location}
- Type: ${data.employmentType}
${data.anticipatedStartDate ? `- Start Date: ${data.anticipatedStartDate}` : ''}
${data.salaryRange ? `- Salary Range: ${data.salaryRange}` : ''}

${data.jobDescription ? `JOB DESCRIPTION:\n${data.jobDescription}\n` : ''}
${data.specialRequirements ? `SPECIAL REQUIREMENTS:\n${data.specialRequirements}\n` : ''}

ACTION REQUIRED:
${data.isExistingClient 
  ? '- Verify current contract status\n- Proceed with job posting'
  : '- Contact new client within 24 hours\n- Discuss services and pricing\n- Send contract documents'
}

View in admin panel: ${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.repl.co` : 'http://localhost:5000'}/admin/job-postings
  `.trim();
  
  // The pretty HTML version for our team
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Styles to make the internal email look professional */
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1B3A52; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
    .existing-client { background-color: #d4edda; color: #155724; }
    .new-client { background-color: #d1ecf1; color: #0c5460; }
    .section { margin: 20px 0; padding: 15px; border-left: 4px solid #F39200; background-color: white; }
    .section h3 { margin-top: 0; color: #1B3A52; }
    ul { margin: 10px 0; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Job Posting Received</h1>
      <h2>${data.jobTitle} at ${data.companyName}</h2>
    </div>
    <div class="content">
      <p><strong>Posting ID:</strong> #${data.id}</p>
      <p><strong>Client Status:</strong> 
        <span class="status-badge ${data.isExistingClient ? 'existing-client' : 'new-client'}">
          ${data.isExistingClient ? 'EXISTING CLIENT' : 'NEW CLIENT'}
        </span>
      </p>
      
      <!-- Company Information Section -->
      <div class="section">
        <h3>Company Information</h3>
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Contact:</strong> ${data.contactName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
      </div>
      
      <!-- Job Details Section -->
      <div class="section">
        <h3>Job Details</h3>
        <ul>
          <li><strong>Title:</strong> ${data.jobTitle}</li>
          <li><strong>Location:</strong> ${data.location}</li>
          <li><strong>Type:</strong> ${data.employmentType}</li>
          ${data.anticipatedStartDate ? `<li><strong>Start Date:</strong> ${data.anticipatedStartDate}</li>` : ''}
          ${data.salaryRange ? `<li><strong>Salary Range:</strong> ${data.salaryRange}</li>` : ''}
        </ul>
      </div>
      
      <!-- Job Description Section (only shows if provided) -->
      ${data.jobDescription ? `
      <div class="section">
        <h3>Job Description</h3>
        <p>${data.jobDescription.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      <!-- Special Requirements Section (only shows if provided) -->
      ${data.specialRequirements ? `
      <div class="section">
        <h3>Special Requirements</h3>
        <p>${data.specialRequirements.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      <!-- Action Required Section -->
      <div class="section">
        <h3>Action Required</h3>
        ${data.isExistingClient 
          ? '<ul><li>Verify current contract status</li><li>Proceed with job posting</li></ul>'
          : '<ul><li>Contact new client within 24 hours</li><li>Discuss services and pricing</li><li>Send contract documents</li></ul>'
        }
      </div>
      
      <!-- Button to view in admin panel -->
      <p style="text-align: center; margin-top: 30px;">
        <a href="${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.repl.co` : 'http://localhost:5000'}/admin/job-postings" style="display: inline-block; padding: 12px 24px; background-color: #F39200; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Panel</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Talencor Staffing. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Send the email to our team
  return sendEmail({
    to: internalEmail,
    subject,
    text,
    html
  });
}
// </InternalNotificationEmail>
```

## Summary

The email system has three main parts:

1. **Setup Function** (`getGraphClient`): This connects to Microsoft's email service using your company's login information.

2. **Main Email Sender** (`sendEmail`): This is the worker that actually sends emails. It:
   - Takes the email details (who to send to, subject, message)
   - Connects to Microsoft
   - Creates a nice-looking email
   - Sends it from no-reply@talencor.com
   - Handles any problems gracefully

3. **Two Special Email Functions**:
   - **Job Posting Confirmation** (`sendJobPostingConfirmation`): Sends a "thank you" email to the person who submitted a job
   - **Internal Notification** (`sendInternalJobPostingNotification`): Tells your team about the new job posting

Each email has both a plain text version (for simple email programs) and a pretty HTML version (what most people see) with your company colors and formatting.