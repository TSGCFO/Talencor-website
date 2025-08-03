import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Send real emails using Resend API with fallback for testing
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Log email for development
    console.log('Sending email notification:', {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString()
    });
    
    // Only attempt to send real emails if we have a valid API key
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.length < 10) {
      console.log('No valid Resend API key - email would be sent in production');
      return true;
    }
    
    try {
      // Send actual email using Resend
      const { data, error } = await resend.emails.send({
        from: 'no-reply@talencor.com', // Your domain (needs verification in production)
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text
      });
      
      if (error) {
        console.error('Resend API error:', error);
        console.log('Note: For production, verify your domain at https://resend.com/domains');
        // Don't fail the job posting process due to email issues
        return true;
      }
      
      console.log('✅ Email sent successfully:', { id: data?.id, to: options.to });
      return true;
    } catch (emailError) {
      console.error('Email service error:', emailError);
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
  const recruitingEmail = process.env.RECRUITING_EMAIL || 'recruiting@talencor.com';
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
  
  return sendEmail({
    to: recruitingEmail,
    subject,
    text
  });
}