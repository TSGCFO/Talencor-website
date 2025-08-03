# Email Setup Instructions for Production

## Overview

The job posting system includes email notifications that send confirmation emails to job submitters and alerts to the recruiting team. This document explains how to set up real email delivery for production.

## Current Status

✅ **Email System Implemented**: Job posting notifications are fully coded and tested
✅ **Resend Integration**: Uses Resend API for email delivery
✅ **Fallback System**: Gracefully handles email failures without breaking job submissions
✅ **Professional Templates**: HTML and text email templates with Talencor branding

## Production Setup Required

### 1. Domain Verification (Required for Production)

For production email delivery, you need to:

1. **Go to Resend Dashboard**: https://resend.com/domains
2. **Add Your Domain**: Add `talencor.com` (or your production domain)
3. **Verify DNS Records**: Follow Resend's instructions to add DNS records
4. **Update Email Sender**: Change the `from` address in `server/email.ts`

```typescript
// Already configured in server/email.ts:
from: 'noreply@talencor.com', // Already set - just needs domain verification
```

### 2. Environment Configuration

Ensure these environment variables are set in production:

```bash
RESEND_API_KEY=re_your_production_api_key_here
```

### 3. Email Addresses

The system currently sends emails to:

- **Job Submitters**: Confirmation email to their provided email address
- **Internal Team**: Alert emails to `recruiting@talencor.com`

Update the internal email address in `server/email.ts` if needed:

```typescript
// Search for "recruiting@talencor.com" and update if different
```

## Email Templates

### Confirmation Email (to job submitters)
- Professional HTML template with Talencor branding
- Personalized with job title and company name
- Different messages for existing vs new clients
- Contact information included

### Internal Alert Email (to recruiting team)
- Complete job posting details
- Formatted for easy review
- Priority indication for existing clients

## Testing

### Development Testing
```bash
# Test job posting with email notifications
curl -X POST http://localhost:5000/api/job-postings \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Test User",
    "companyName": "Test Company",
    "email": "test@example.com",
    "phone": "1234567890",
    "jobTitle": "Test Position",
    "location": "Toronto, ON",
    "employmentType": "permanent",
    "isExistingClient": false
  }'
```

### Production Testing
1. Submit a test job posting through the website
2. Check that confirmation email is received
3. Verify internal team receives alert email
4. Test with both existing and new client scenarios

## Troubleshooting

### Common Issues

1. **Domain Not Verified Error**
   - Solution: Complete domain verification in Resend dashboard
   - Temporary: System will continue working, emails just won't send

2. **Invalid API Key**
   - Solution: Check RESEND_API_KEY environment variable
   - Verify key is active in Resend dashboard

3. **Emails Not Received**
   - Check spam folders
   - Verify email addresses are correct
   - Review server logs for delivery status

### Monitoring

Monitor email delivery through:
- Server console logs (shows delivery attempts)
- Resend dashboard (shows delivery status)
- Admin dashboard (job posting submissions continue regardless)

## Production Checklist

- [ ] Domain verified in Resend
- [ ] DNS records configured
- [ ] Production API key set
- [ ] Email templates reviewed
- [ ] Internal email address confirmed
- [ ] Test emails sent and received
- [ ] Monitoring set up

## Alternative Email Providers

If you prefer a different email service, the system can be adapted for:
- SendGrid
- AWS SES
- Mailgun
- Postmark

Contact your developer to implement alternative providers.