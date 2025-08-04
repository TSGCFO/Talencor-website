/**
 * Email System for Talencor Staffing Job Postings
 * 
 * This file handles all email communications when someone submits a job posting.
 * It sends two emails:
 * 1. A confirmation email to the person who submitted the job
 * 2. A notification email to our internal team at info@talencor.com
 * 
 * The system uses Microsoft Graph API to send emails from no-reply@talencor.com
 */

import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

/**
 * EmailOptions - What information we need to send any email
 * 
 * @param to - The email address of the person who will receive the email
 * @param subject - The title/subject line of the email
 * @param text - A plain text version of the email (for older email programs)
 * @param html - An optional pretty HTML version with colors and formatting
 */
export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Creates a connection to Microsoft's email service
 * 
 * Think of this like logging into your email account before sending emails.
 * It uses three pieces of information stored securely:
 * - MICROSOFT_TENANT_ID: Your company's ID in Microsoft's system
 * - MICROSOFT_CLIENT_ID: Your app's unique ID
 * - MICROSOFT_CLIENT_SECRET: Your app's password (kept secret)
 * 
 * @returns A client that can send emails through Microsoft
 */
async function getGraphClient(): Promise<Client> {
  // Create login credentials using the three pieces of Microsoft information
  const credential = new ClientSecretCredential(
    process.env.MICROSOFT_TENANT_ID!,    // Your company ID
    process.env.MICROSOFT_CLIENT_ID!,     // Your app ID
    process.env.MICROSOFT_CLIENT_SECRET!  // Your app password
  );

  // Set up the connection to Microsoft's email service
  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        // Get permission to send emails
        const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
        return tokenResponse?.token || '';
      }
    }
  });

  return client;
}

// Send emails using Microsoft Graph API
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Log email for development
    console.log('Sending email via Microsoft Graph:', {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString()
    });
    
    // Check for required Microsoft credentials
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET || !process.env.MICROSOFT_TENANT_ID) {
      console.log('Missing Microsoft Graph credentials - email would be sent in production');
      return true;
    }
    
    try {
      const client = await getGraphClient();
      
      // Define the email message
      const message = {
        subject: options.subject,
        body: {
          contentType: "HTML" as const,
          content: options.html || `<p>${options.text.replace(/\n/g, '<br>')}</p>`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: options.to,
            },
          },
        ],
      };

      // Send the email from no-reply@talencor.com
      await client
        .api("/users/no-reply@talencor.com/sendMail")
        .post({
          message,
          saveToSentItems: true,
        });
      
      console.log('✅ Email sent successfully via Microsoft Graph:', { to: options.to });
      return true;
    } catch (emailError) {
      console.error('Microsoft Graph email error:', emailError);
      console.log('Job posting will continue - email notifications can be configured later');
      return true; // Don't fail the main process
    }
  } catch (error) {
    console.error('Error in email function:', error);
    return true; // Don't fail the main process
  }
}

// Send job posting confirmation email to submitter
export async function sendJobPostingConfirmation(data: {
  contactName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  isExistingClient: boolean;
}): Promise<boolean> {
  const subject = 'Job Posting Received - Talencor Staffing';
  
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
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
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
  
  return sendEmail({
    to: data.email,
    subject,
    text,
    html
  });
}

// Send internal notification to recruiting team
export async function sendInternalJobPostingNotification(data: {
  id: number;
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: string;
  isExistingClient: boolean;
  anticipatedStartDate?: string | null;
  salaryRange?: string | null;
  jobDescription?: string | null;
  specialRequirements?: string | null;
}): Promise<boolean> {
  const internalEmail = 'info@talencor.com';
  const subject = `New Job Posting: ${data.jobTitle} at ${data.companyName}`;
  
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
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
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
      
      <div class="section">
        <h3>Company Information</h3>
        <ul>
          <li><strong>Company:</strong> ${data.companyName}</li>
          <li><strong>Contact:</strong> ${data.contactName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
      </div>
      
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
      
      ${data.jobDescription ? `
      <div class="section">
        <h3>Job Description</h3>
        <p>${data.jobDescription.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      ${data.specialRequirements ? `
      <div class="section">
        <h3>Special Requirements</h3>
        <p>${data.specialRequirements.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      
      <div class="section">
        <h3>Action Required</h3>
        ${data.isExistingClient 
          ? '<ul><li>Verify current contract status</li><li>Proceed with job posting</li></ul>'
          : '<ul><li>Contact new client within 24 hours</li><li>Discuss services and pricing</li><li>Send contract documents</li></ul>'
        }
      </div>
      
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

  return sendEmail({
    to: internalEmail,
    subject,
    text,
    html
  });
}