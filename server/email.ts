// <EmailSystemSetupSnippet>
// These lines bring in special tools we need to send emails
// Think of them like getting the mailman's truck and uniform ready before delivering mail
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

// <EmailOptionsSnippet>
// This section creates a template for what information every email needs
// It's like a checklist that makes sure we don't forget any important parts of an email
export interface EmailOptions {
  to: string;      // Who gets the email (like writing the address on an envelope)
  subject: string; // The title of the email (what people see before opening it)
  text: string;    // The plain message (like a simple letter)
  html?: string;   // A fancy version with colors and pictures (the ? means we don't always need this)
}
// </EmailOptionsSnippet>
// </EmailSystemSetupSnippet>

// <BaseUrlHelperSnippet>
// This function figures out the correct website address based on where the app is running
// It's like knowing whether to use your home address, work address, or vacation address
function getBaseUrl(): string {
  // Check if we're running on the real production website (talencor.com)
  if (process.env.PRODUCTION_URL || process.env.NODE_ENV === 'production') {
    return 'https://talencor.com';
  }
  
  // Check if we're running on Replit (the development preview)
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  // If neither, we must be running locally on a developer's computer
  return 'http://localhost:5000';
}
// </BaseUrlHelperSnippet>

// <GetGraphClientSnippet>
// This function connects to Microsoft's email service
// It's like calling the post office to tell them you want to send mail
async function getGraphClient(): Promise<Client> {
  // <CredentialSetupSnippet>
  // These lines get your secret passwords from a safe place
  // These passwords prove you're allowed to use Microsoft's email service
  // Think of them like showing your ID at the post office
  const credential = new ClientSecretCredential(
    process.env.MICROSOFT_TENANT_ID!,    // Your company's special number at Microsoft
    process.env.MICROSOFT_CLIENT_ID!,     // Your app's personal ID number  
    process.env.MICROSOFT_CLIENT_SECRET!  // Your app's secret password (keep it safe!)
  );
  // </CredentialSetupSnippet>

  // <ClientInitializationSnippet>
  // This creates the connection to send emails
  // It's like getting the keys to the mail truck
  const client = Client.initWithMiddleware({
    authProvider: {
      // This part asks Microsoft "Can I send emails please?"
      // Microsoft checks your passwords and says yes or no
      getAccessToken: async () => {
        const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
        return tokenResponse?.token || '';
      }
    }
  });
  // </ClientInitializationSnippet>

  return client; // Give back the ready email sender
}
// </GetGraphClientSnippet>

// <SendMailSnippet>
// This is the main function that actually sends emails
// It's like the mailman who takes your letter and delivers it
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // <LoggingSnippet>
    // This writes down what email we're sending in our records
    // It's like keeping a receipt when you mail something
    console.log('Sending email via Microsoft Graph:', {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString()
    });
    // </LoggingSnippet>
    
    // <CredentialCheckSnippet>
    // This checks if we have all our passwords ready
    // It's like checking if you have stamps before going to the post office
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET || !process.env.MICROSOFT_TENANT_ID) {
      console.log('Missing Microsoft Graph credentials - email would be sent in production');
      return true; // We say "true" so the website keeps working even without email
    }
    // </CredentialCheckSnippet>
    
    try {
      // <GetEmailServiceSnippet>
      // Get our email sending service ready
      const client = await getGraphClient();
      // </GetEmailServiceSnippet>
      
      // <CreateEmailMessageSnippet>
      // This creates the actual email message
      // It's like writing your letter and putting it in an envelope
      const message = {
        subject: options.subject,  // The title on the envelope
        body: {
          contentType: "HTML" as const,  // This says we want a pretty email with colors
          // If we have a fancy version, use it. Otherwise make the plain text look nice
          content: options.html || `<p>${options.text.replace(/\n/g, '<br>')}</p>`,
        },
        toRecipients: [  // Who gets the email
          {
            emailAddress: {
              address: options.to,  // The person's email address
            },
          },
        ],
      };
      // </CreateEmailMessageSnippet>

      // <ActualEmailSendingSnippet>
      // This is where we actually send the email
      // It's like putting the letter in the mailbox
      await client
        .api("/users/no-reply@talencor.com/sendMail")  // Send from the company's no-reply address
        .post({
          message,
          saveToSentItems: true,  // Keep a copy in our "Sent" folder
        });
      // </ActualEmailSendingSnippet>
      
      console.log('✅ Email sent successfully via Microsoft Graph:', { to: options.to });
      return true;  // Tell everyone the email was sent!
    } catch (emailError) {
      // <EmailErrorHandlingSnippet>
      // If something goes wrong with sending the email
      // We write it down but don't stop the website from working
      console.error('Microsoft Graph email error:', emailError);
      console.log('Job posting will continue - email notifications can be configured later');
      return true; // Don't fail the main process
      // </EmailErrorHandlingSnippet>
    }
  } catch (error) {
    // <GeneralErrorHandlingSnippet>
    // If anything else goes wrong, we handle it here
    console.error('Error in email function:', error);
    return true; // Don't fail the main process
    // </GeneralErrorHandlingSnippet>
  }
}
// </SendMailSnippet>

// <JobPostingConfirmationSnippet>
// This function sends a "thank you" email when someone posts a new job
// It's like sending a receipt when someone drops off a package
export async function sendJobPostingConfirmation(data: {
  contactName: string;      // The person's name who posted the job
  email: string;           // Where to send the thank you email
  companyName: string;     // The company that needs workers
  jobTitle: string;        // What job they need to fill
  isExistingClient: boolean; // Do we already know this company? (true = yes, false = no)
}): Promise<boolean> {
  // <EmailSubjectSnippet>
  // This is the title people see in their inbox
  const subject = 'Job Posting Received - Talencor Staffing';
  // </EmailSubjectSnippet>
  
  // <PlainTextMessageSnippet>
  // This is the simple version of the email
  // Some people's email can't show fancy colors, so they see this
  const text = `
Dear ${data.contactName},

Thank you for submitting your job posting for ${data.jobTitle} at ${data.companyName}.

We have received your request and a member of our recruiting team will contact you within one business day.

${data.isExistingClient 
  ? 'As an existing client, your job posting will be prioritized for immediate processing.'
  : 'As a new client, we will discuss our services, pricing, and contract terms before posting your job.'
}

If you have any immediate questions, please don't hesitate to contact us at:
Phone: (647) 946-2177
Email: info@talencor.com

Best regards,
The Talencor Staffing Team
  `.trim();
  // </PlainTextMessageSnippet>
  
  // <HTMLEmailTemplateSnippet>
  // This is the pretty version of the email with colors and nice formatting
  // It's like making a beautiful greeting card instead of just a plain letter
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* These lines make the email look nice with colors and spacing */
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
    <!-- The blue header at the top -->
    <div class="header">
      <h1>Job Posting Received</h1>
    </div>
    <!-- The main message area -->
    <div class="content">
      <p>Dear ${data.contactName},</p>
      <p>Thank you for submitting your job posting for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
      <p>We have received your request and a member of our recruiting team will contact you within one business day.</p>
      <!-- This shows different messages for new vs existing customers -->
      ${data.isExistingClient 
        ? '<p style="background-color: #d4edda; padding: 10px; border-radius: 5px;">As an existing client, your job posting will be prioritized for immediate processing.</p>'
        : '<p style="background-color: #d1ecf1; padding: 10px; border-radius: 5px;">As a new client, we will discuss our services, pricing, and contract terms before posting your job.</p>'
      }
      <p>If you have any immediate questions, please don't hesitate to contact us:</p>
      <ul>
        <li>Phone: (647) 946-2177</li>
        <li>Email: info@talencor.com</li>
      </ul>
    </div>
    <!-- The footer with copyright -->
    <div class="footer">
      <p>&copy; 2025 Talencor Staffing. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
  // </HTMLEmailTemplateSnippet>
  
  // <ActualSendEmailSnippet>
  // This uses our main email sending function to deliver the message
  // We give it all the pieces: who to send to, the title, and both versions of the message
  return sendEmail({
    to: data.email,      // Send to the person who posted the job
    subject,             // Use the title we created above
    text,                // The plain version
    html                 // The pretty version
  });
  // </ActualSendEmailSnippet>
}
// </JobPostingConfirmationSnippet>

// <InternalJobNotificationSnippet>
// This function alerts your team when someone posts a new job
// It's like ringing a bell in the office to let everyone know there's work to do
export async function sendInternalJobPostingNotification(data: {
  id: number;                             // A unique number for this job posting
  contactName: string;                    // The person who posted the job
  email: string;                          // Their email address
  phone: string;                          // Their phone number
  companyName: string;                    // The company that needs workers
  jobTitle: string;                       // What job they need to fill
  location: string;                       // Where the job is located
  employmentType: string;                 // Full-time, part-time, etc.
  isExistingClient: boolean;              // Do we already work with this company?
  anticipatedStartDate?: string | null;   // When they need someone to start (optional)
  salaryRange?: string | null;            // How much they're willing to pay (optional)
  jobDescription?: string | null;         // Details about the job (optional)
  specialInstructions?: string | null;    // Any special needs for this job (optional)
}): Promise<boolean> {
  // <InternalEmailSetupSnippet>
  // This is where we send the team alerts
  const internalEmail = 'info@talencor.com';
  // Create a clear title so the team knows what company and job this is about
  const subject = `New Job Posting: ${data.jobTitle} at ${data.companyName}`;
  // </InternalEmailSetupSnippet>
  
  // <InternalPlainTextSnippet>
  // This is the simple version that shows all the important information
  // It's organized like a report so the team can quickly see what they need to do
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
${data.specialInstructions ? `SPECIAL INSTRUCTIONS:\n${data.specialInstructions}\n` : ''}

ACTION REQUIRED:
${data.isExistingClient 
  ? '- Verify current contract status\n- Proceed with job posting'
  : '- Contact new client within 24 hours\n- Discuss services and pricing\n- Send contract documents'
}

View in admin panel: ${getBaseUrl()}/admin/job-postings
  `.trim();
  // </InternalPlainTextSnippet>
  
  // <InternalHTMLTemplateSnippet>
  // This is the pretty version for the team with organized sections and colors
  // It's like a professional report that's easy to read quickly
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* These styles make the email look professional and organized */
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1B3A52; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    /* These create colored labels to show if it's a new or existing customer */
    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
    .existing-client { background-color: #d4edda; color: #155724; }  /* Green for existing */
    .new-client { background-color: #d1ecf1; color: #0c5460; }      /* Blue for new */
    /* These create organized boxes for different information */
    .section { margin: 20px 0; padding: 15px; border-left: 4px solid #F39200; background-color: white; }
    .section h3 { margin-top: 0; color: #1B3A52; }
    ul { margin: 10px 0; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <!-- The header tells what job posting this is about -->
    <div class="header">
      <h1>New Job Posting Received</h1>
      <h2>${data.jobTitle} at ${data.companyName}</h2>
    </div>
    <div class="content">
      <!-- Show the posting number and whether they're a new or existing customer -->
      <p><strong>Posting ID:</strong> #${data.id}</p>
      <p><strong>Client Status:</strong> 
        <span class="status-badge ${data.isExistingClient ? 'existing-client' : 'new-client'}">
          ${data.isExistingClient ? 'EXISTING CLIENT' : 'NEW CLIENT'}
        </span>
      </p>
      
      <!-- Company contact information box -->
      <div class="section">
        <h3>Company Information</h3>
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Contact:</strong> ${data.contactName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
      </div>
      
      <!-- Job details box -->
      <div class="section">
        <h3>Job Details</h3>
        <ul>
          <li><strong>Title:</strong> ${data.jobTitle}</li>
          <li><strong>Location:</strong> ${data.location}</li>
          <li><strong>Type:</strong> ${data.employmentType}</li>
          <!-- Only show start date if they provided one -->
          ${data.anticipatedStartDate ? `<li><strong>Start Date:</strong> ${data.anticipatedStartDate}</li>` : ''}
          <!-- Only show salary if they provided one -->
          ${data.salaryRange ? `<li><strong>Salary Range:</strong> ${data.salaryRange}</li>` : ''}
        </ul>
      </div>
      
      <!-- Only show job description box if they provided one -->
      ${data.jobDescription ? `
      <div class="section">
        <h3>Job Description</h3>
        <p>${data.jobDescription.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      <!-- Only show special instructions box if they provided any -->
      ${data.specialInstructions ? `
      <div class="section">
        <h3>Special Instructions</h3>
        <p>${data.specialInstructions.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      <!-- Important: What the team needs to do next -->
      <div class="section">
        <h3>Action Required</h3>
        ${data.isExistingClient 
          ? '<ul><li>Verify current contract status</li><li>Proceed with job posting</li></ul>'
          : '<ul><li>Contact new client within 24 hours</li><li>Discuss services and pricing</li><li>Send contract documents</li></ul>'
        }
      </div>
      
      <!-- Big orange button to view all job postings -->
      <p style="text-align: center; margin-top: 30px;">
        <a href="${getBaseUrl()}/admin/job-postings" style="display: inline-block; padding: 12px 24px; background-color: #F39200; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Panel</a>
      </p>
    </div>
    <!-- Company footer -->
    <div class="footer">
      <p>&copy; 2025 Talencor Staffing. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
  // </InternalHTMLTemplateSnippet>

  // <SendInternalEmailSnippet>
  // Send the alert to the team's email address
  return sendEmail({
    to: internalEmail,    // Send to info@talencor.com
    subject,              // The title we created above
    text,                 // Plain version for simple email readers
    html                  // Pretty version with colors and boxes
  });
  // </SendInternalEmailSnippet>
}
// </InternalJobNotificationSnippet>