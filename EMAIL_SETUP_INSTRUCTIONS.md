# Email System Setup Instructions

## Overview

The Talencor Staffing application uses Microsoft Graph API to send emails from
`no-reply@talencor.com`. This system sends two types of emails when a job
posting is submitted:

1. **Confirmation email** to the job posting submitter
2. **Internal notification email** to `info@talencor.com`

## Microsoft Graph Integration

### Authentication

The system uses app-only authentication with the following Azure AD credentials:

- `MICROSOFT_CLIENT_ID` - Application (client) ID
- `MICROSOFT_CLIENT_SECRET` - Client secret
- `MICROSOFT_TENANT_ID` - Directory (tenant) ID

### Email Sender

All emails are sent from: `no-reply@talencor.com`

### Dependencies

- `@microsoft/microsoft-graph-client` - Microsoft Graph SDK
- `@azure/identity` - Azure authentication library
- `isomorphic-fetch` - HTTP client for Graph API

## Email Templates

### 1. Job Posting Confirmation Email

**Sent to:** Job posting submitter **Subject:** "Job Posting Received - Talencor
Staffing"

**Features:**

- Professional HTML template with Talencor branding
- Personalized content based on job details
- Different messaging for existing vs. new clients
- Contact information included

### 2. Internal Notification Email

**Sent to:** `info@talencor.com` **Subject:** "New Job Posting: [Job Title] at
[Company Name]"

**Features:**

- Comprehensive job posting details
- Client status indicator (existing/new client)
- Action items based on client status
- Direct link to admin panel
- Professional HTML formatting

## Implementation Details

### Error Handling

- Graceful fallback: Email failures don't block job posting submission
- Comprehensive logging for debugging
- User-friendly error messages

### Security

- Uses secure app-only authentication
- No user credentials stored
- Minimal permissions required (Mail.Send)

### Performance

- Asynchronous email sending
- Connection pooling for Graph API calls
- Efficient HTML template generation

## Testing

The system has been tested with:

- ✅ New client job postings
- ✅ Existing client job postings (with access codes)
- ✅ Both HTML and plain text email formats
- ✅ Error handling and fallback scenarios

## Configuration

### Required Environment Variables

```
MICROSOFT_CLIENT_ID=your_application_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_TENANT_ID=your_directory_tenant_id
```

### Azure AD App Registration Requirements

1. Application must have `Mail.Send` permission
2. Admin consent required for app-only access
3. <no-reply@talencor.com> mailbox must be configured

## Monitoring

All email operations are logged with:

- Timestamp
- Recipient email
- Subject line
- Success/failure status
- Error details (if applicable)

## Migration from Resend

The system has been completely migrated from Resend to Microsoft Graph:

- ✅ All Resend dependencies removed
- ✅ Authentication updated to use Azure AD
- ✅ Email templates enhanced with HTML formatting
- ✅ Internal notification recipient changed to <info@talencor.com>
- ✅ Full compatibility with existing job posting workflow
