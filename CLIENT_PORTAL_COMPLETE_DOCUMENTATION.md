# Clein Portal (Client Portal) - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Features and Capabilities](#features-and-capabilities)
4. [Database Structure](#database-structure)
5. [User Flows](#user-flows)
6. [Admin Management](#admin-management)
7. [Security Features](#security-features)
8. [API Documentation](#api-documentation)
9. [Frontend Components](#frontend-components)
10. [Step-by-Step Usage Guide](#step-by-step-usage-guide)
11. [Troubleshooting](#troubleshooting)
12. [Technical Implementation Details](#technical-implementation-details)

---

## Overview

The Klein Portal (Client Portal) is a secure, self-service system that allows
Talencor's business clients to request access codes for submitting job postings.
It provides a streamlined workflow for client authentication, job posting
submission, and administrative management.

### Purpose

The portal serves three main user groups:

1. **New Clients** - Can request access codes to become authorized
2. **Existing Clients** - Can submit job postings using their access codes
3. **Administrators** - Can manage clients, review requests, and oversee job
   postings

### Key Benefits

- **Self-Service Access** - Clients can request codes without manual
  intervention
- **Security** - Time-limited codes with expiration tracking
- **Activity Monitoring** - Complete audit trail of all client activities
- **Efficient Management** - Centralized admin dashboard for oversight
- **Spam Prevention** - Honeypot fields and validation to prevent abuse

---

## System Architecture

### Technology Stack

- **Frontend**: React with TypeScript, TanStack Query, React Hook Form
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Validation**: Zod schemas for type-safe validation
- **Authentication**: Session-based with bcrypt password hashing

### Component Structure

```
Client Portal System
├── Database Layer
│   ├── clientAccessCodes table
│   ├── clientCodeRequests table
│   ├── clientActivities table
│   └── jobPostings table
├── API Layer
│   ├── Access code endpoints
│   ├── Job posting endpoints
│   ├── Admin endpoints
│   └── Authentication endpoints
├── Frontend Pages
│   ├── Request Access Page
│   ├── Job Posting Page
│   ├── Admin Dashboard
│   └── Client Management
└── Security Layer
    ├── Code generation & validation
    ├── Session management
    └── Activity logging
```

---

## Features and Capabilities

### 1. Access Code System

**What it does:**

- Generates unique 8-character alphanumeric codes
- Tracks code usage and expiration (30-day validity)
- Associates codes with specific clients
- Maintains usage history

**How it works:**

1. Client submits request with company details
2. System generates unique code
3. Code is stored with 30-day expiration
4. Email notification sent to client
5. Activity logged in database

### 2. Job Posting Submission

**What it does:**

- Validates client access codes
- Accepts comprehensive job details
- Stores submissions securely
- Sends confirmation emails

**Fields collected:**

- Contact information (name, company, email, phone)
- Job details (title, department, location)
- Employment type (permanent, temporary, contract-to-hire)
- Number of positions and urgency level
- Start date and salary range
- Job description and qualifications
- Special instructions

### 3. Admin Management Dashboard

**What it does:**

- View all access code requests
- Manage client statuses
- Track client activities
- Monitor job postings
- Generate and regenerate codes

**Admin capabilities:**

- Approve/reject code requests
- View detailed client histories
- Export data for reporting
- Manage multiple clients simultaneously

### 4. Activity Tracking

**What it does:**

- Logs all client interactions
- Records timestamps and actions
- Tracks code usage patterns
- Provides audit trail

**Tracked activities:**

- Code requests
- Job posting submissions
- Code validations
- Status changes
- Admin actions

---

## Database Structure

### Tables and Relationships

#### 1. clientAccessCodes

```sql
CREATE TABLE clientAccessCodes (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  used_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  metadata JSONB
);
```

**Purpose:** Stores access codes for authorized clients

**Key fields:**

- `code`: The unique access code
- `expires_at`: When the code becomes invalid (30 days)
- `is_active`: Whether code can still be used
- `used_count`: How many times code has been used
- `metadata`: Additional client information

#### 2. clientCodeRequests

```sql
CREATE TABLE clientCodeRequests (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  business_type VARCHAR(100),
  employee_count VARCHAR(50),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255)
);
```

**Purpose:** Tracks all access code requests from potential clients

**Key fields:**

- `status`: pending, approved, rejected
- `admin_notes`: Internal notes from administrators
- `reviewed_at/by`: Audit trail for decisions

#### 3. clientActivities

```sql
CREATE TABLE clientActivities (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clientAccessCodes(id),
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Comprehensive activity log for all client actions

**Activity types:**

- `code_requested`: New access code request
- `code_validated`: Code checked for validity
- `job_posted`: Job posting submitted
- `code_regenerated`: Admin regenerated code
- `status_changed`: Request status updated

#### 4. jobPostings

```sql
CREATE TABLE jobPostings (
  id SERIAL PRIMARY KEY,
  -- Contact Information (Required)
  contact_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,

  -- Job Details (Required)
  job_title VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  employment_type VARCHAR(50) NOT NULL, -- 'permanent', 'temporary', 'contract-to-hire'
  number_of_positions INTEGER DEFAULT 1,
  urgency VARCHAR(50) DEFAULT 'medium',
  is_existing_client BOOLEAN DEFAULT false NOT NULL,

  -- Job Details (Optional)
  anticipated_start_date DATE,
  salary_range VARCHAR(100),
  job_description TEXT,
  required_qualifications TEXT,
  preferred_qualifications TEXT,
  special_instructions TEXT,

  -- Status & References
  status VARCHAR(50) DEFAULT 'new' NOT NULL, -- 'new', 'contacted', 'contract_pending', 'posted', 'closed'
  client_id INTEGER REFERENCES clients(id),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Stores all job postings submitted through the portal

**Key fields:**

- `contact_name/company_name`: Who's submitting the job
- `employment_type`: Type of employment (permanent, temporary, contract-to-hire)
- `is_existing_client`: Whether submitted by authenticated client
- `client_id`: Links to clients table if authenticated
- `status`: Tracks job posting lifecycle

---

## User Flows

### Flow 1: New Client Requesting Access

```
Client Journey:
1. Navigate to /request-access
2. Fill out company information form
3. Submit request
4. Receive confirmation message
5. Wait for email with access code
6. Use code to submit job postings
```

**Backend process:**

1. Validate form data
2. Check for existing requests
3. Store request in database
4. Send notification email
5. Log activity
6. Return confirmation

### Flow 2: Existing Client Posting a Job

```
Client Journey:
1. Navigate to /job-posting
2. Enter access code
3. System validates code
4. Fill out job posting form
5. Submit posting
6. Receive confirmation
```

**Backend process:**

1. Validate access code
2. Check expiration date
3. Increment usage counter
4. Store job posting
5. Send confirmation email
6. Log activity

### Flow 3: Admin Managing Requests

```
Admin Journey:
1. Login to admin panel
2. Navigate to Client Management
3. View pending requests
4. Review client details
5. Approve/reject request
6. System generates code if approved
7. Email sent to client
```

**Backend process:**

1. Authenticate admin
2. Fetch pending requests
3. Update request status
4. Generate access code
5. Send notification
6. Log admin action

---

## Admin Management

### Accessing the Admin Panel

**URL:** `/admin/client-management`

**Authentication Required:** Yes - Admin must be logged in

### Admin Dashboard Features

#### 1. Request Queue

- View all pending access requests
- Sort by date, company name, or status
- Quick approve/reject buttons
- Detailed view of each request

#### 2. Client List

- All clients with active codes
- Code expiration dates
- Usage statistics
- Activity history per client

#### 3. Actions Available

- **Approve Request**: Generates code and sends to client
- **Reject Request**: Denies access with optional reason
- **Regenerate Code**: Creates new code for existing client
- **Deactivate Code**: Immediately invalidates a code
- **View Activity**: See detailed client history
- **Add Notes**: Internal documentation for decisions

### Admin Workflow

1. **Daily Review Process**
   - Check pending requests tab
   - Review company information
   - Verify business legitimacy
   - Make approval decision
   - Add notes for future reference

2. **Client Management**
   - Monitor code usage patterns
   - Regenerate codes before expiration
   - Deactivate suspicious accounts
   - Export client data for reports

3. **Job Posting Oversight**
   - Review submitted postings
   - Track posting frequency
   - Identify high-volume clients
   - Monitor for policy compliance

---

## Security Features

### 1. Code Generation

- **Algorithm**: Cryptographically secure random generation
- **Format**: 8 characters, alphanumeric (uppercase)
- **Uniqueness**: Enforced at database level
- **Example**: `AB3CD5EF`

### 2. Expiration Management

- **Default Duration**: 30 days from generation
- **Automatic Invalidation**: Codes expire without manual intervention
- **Grace Period**: None - expired codes immediately rejected
- **Renewal Process**: Admin must regenerate manually

### 3. Honeypot Protection

- **Implementation**: Hidden field in forms
- **Detection**: Submissions with honeypot data are rejected
- **Purpose**: Prevents automated bot submissions
- **User Impact**: Invisible to legitimate users

### 4. Rate Limiting

- **Request Limits**: Maximum requests per IP tracked
- **Time Windows**: Hourly and daily limits
- **Response**: Graceful degradation with error messages
- **Reset**: Automatic after time period

### 5. Activity Logging

- **Comprehensive Tracking**: All actions logged
- **IP Recording**: Source IP for each action
- **User Agent**: Browser/client information stored
- **Timestamp**: Precise timing of all events
- **Audit Trail**: Complete history for investigation

### 6. Data Validation

- **Frontend**: Zod schemas validate before submission
- **Backend**: Re-validation on server side
- **SQL Injection**: Parameterized queries prevent attacks
- **XSS Protection**: Input sanitization and output encoding

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login

**Purpose:** Admin authentication

```json
Request:
{
  "username": "admin",
  "password": "secure_password"
}

Response:
{
  "success": true,
  "user": { "id": 1, "username": "admin" }
}
```

### Access Code Endpoints

#### POST /api/client-access/request-code

**Purpose:** Request new access code

```json
Request:
{
  "companyName": "ABC Corporation",
  "contactName": "John Smith",
  "email": "john@abc.com",
  "phone": "555-0100",
  "businessType": "Technology",
  "employeeCount": "50-100",
  "reason": "Need to post software developer positions"
}

Response:
{
  "success": true,
  "message": "Request submitted successfully"
}
```

#### POST /api/client-access/validate-code

**Purpose:** Check if code is valid

```json
Request:
{
  "code": "AB3CD5EF"
}

Response:
{
  "valid": true,
  "clientName": "ABC Corporation",
  "expiresAt": "2025-02-06T10:00:00Z"
}
```

### Job Posting Endpoints

#### POST /api/job-postings

**Purpose:** Submit new job posting

```json
Request:
{
  "contactName": "Jane Doe",
  "companyName": "ABC Corporation",
  "email": "jane@abc.com",
  "phone": "555-0101",
  "jobTitle": "Software Developer",
  "department": "Engineering",
  "location": "New York, NY",
  "employmentType": "permanent",
  "numberOfPositions": 2,
  "urgency": "high",
  "isExistingClient": true,
  "anticipatedStartDate": "2025-02-01",
  "salaryRange": "$80,000 - $120,000",
  "jobDescription": "Full job description...",
  "requiredQualifications": "5+ years experience...",
  "preferredQualifications": "Experience with React...",
  "specialInstructions": "Please contact HR first..."
}

Response:
{
  "success": true,
  "message": "Job posting submitted successfully",
  "postingId": 123
}
```

### Admin Endpoints

#### GET /api/admin/client-requests

**Purpose:** Get all access code requests

```json
Response:
{
  "requests": [
    {
      "id": 1,
      "companyName": "ABC Corporation",
      "contactName": "John Smith",
      "email": "john@abc.com",
      "status": "pending",
      "createdAt": "2025-01-06T10:00:00Z"
    }
  ]
}
```

#### POST /api/admin/approve-request

**Purpose:** Approve access request and generate code

```json
Request:
{
  "requestId": 1,
  "adminNotes": "Verified legitimate business"
}

Response:
{
  "success": true,
  "code": "AB3CD5EF",
  "expiresAt": "2025-02-06T10:00:00Z"
}
```

#### POST /api/admin/regenerate-code

**Purpose:** Generate new code for existing client

```json
Request:
{
  "clientId": 5
}

Response:
{
  "success": true,
  "newCode": "XY7ZW9UV",
  "expiresAt": "2025-02-06T10:00:00Z"
}
```

#### GET /api/admin/client-activities/:clientId

**Purpose:** Get activity history for specific client

```json
Response:
{
  "activities": [
    {
      "id": 1,
      "activityType": "job_posted",
      "activityData": { "jobTitle": "Software Developer" },
      "createdAt": "2025-01-06T10:00:00Z"
    }
  ]
}
```

---

## Frontend Components

### 1. Request Access Page (`/request-access`)

**Component:** `client/src/pages/request-access.tsx`

**Features:**

- Multi-field form with validation
- Real-time error messages
- Loading states during submission
- Success/error notifications
- Honeypot field for security

**Form Fields:**

- Company Name (required)
- Contact Name (required)
- Email (required, validated)
- Phone (optional)
- Business Type (dropdown)
- Employee Count (dropdown)
- Reason for Access (textarea)

### 2. Job Posting Page (`/job-posting`)

**Component:** `client/src/pages/job-posting.tsx`

**Features:**

- Access code validation step
- Comprehensive job form
- Rich text description support
- Draft saving capability
- Submission confirmation

**Process:**

1. Enter access code
2. Code validated in real-time
3. Job form appears if valid
4. Fill out all fields
5. Submit posting
6. Receive confirmation

### 3. Admin Client Management (`/admin/client-management`)

**Component:** `client/src/pages/admin/client-management.tsx`

**Features:**

- Tabbed interface (Requests/Clients)
- Sortable tables
- Quick actions
- Detail modals
- Activity viewer

**Tabs:**

- **Access Requests**: Pending, approved, and rejected requests
- **Active Clients**: All clients with codes
- **Activity Log**: System-wide activity feed

### 4. Shared Components

**AccessCodeValidator**

- Reusable code validation component
- Shows expiration status
- Displays client name
- Error handling

**ClientActivityLog**

- Formatted activity display
- Timestamp formatting
- Activity type icons
- Expandable details

**StatusBadge**

- Color-coded status indicators
- Pending (yellow)
- Approved (green)
- Rejected (red)
- Expired (gray)

---

## Step-by-Step Usage Guide

### For New Clients

#### Step 1: Request Access Code

1. **Navigate to the website**
   - Go to talencor.com
   - Look for "Client Portal" or "Post a Job" link
   - Click "Request Access Code"

2. **Fill out the request form**
   - Enter your company name exactly as registered
   - Provide your full name as the contact person
   - Use your business email address
   - Add phone number for faster processing
   - Select your business type from the dropdown
   - Choose employee count range
   - Explain why you need access (brief description)

3. **Submit the request**
   - Review all information for accuracy
   - Click "Submit Request"
   - You'll see a confirmation message
   - Check your email for updates

4. **Wait for approval**
   - Requests are reviewed within 24-48 hours
   - You'll receive an email when approved
   - The email contains your access code
   - Save this code securely

#### Step 2: Post Your First Job

1. **Go to job posting page**
   - Navigate to talencor.com/job-posting
   - Have your access code ready

2. **Enter your access code**
   - Type or paste your 8-character code
   - Click "Validate Code"
   - System confirms code is valid

3. **Fill out job details**
   - **Contact Name**: Your full name
   - **Company Name**: Your organization name
   - **Email**: Your business email
   - **Phone**: Contact phone number
   - **Job Title**: Clear, specific position title
   - **Department**: Which department (optional)
   - **Location**: City, State or "Remote"
   - **Employment Type**: Permanent, Temporary, or Contract-to-hire
   - **Number of Positions**: How many people to hire
   - **Urgency**: Low, Medium, or High
   - **Anticipated Start Date**: When you need them to start (optional)
   - **Salary Range**: Be as specific as possible (optional)
   - **Job Description**: Complete job description (optional)
   - **Required Qualifications**: Must-have skills and experience (optional)
   - **Preferred Qualifications**: Nice-to-have skills (optional)
   - **Special Instructions**: Any additional notes (optional)

4. **Submit the posting**
   - Review all information
   - Click "Submit Job Posting"
   - You'll see confirmation
   - Email confirmation sent

### For Administrators

#### Daily Tasks

1. **Morning Review (Recommended daily)**

   ```
   1. Login to admin panel
   2. Go to Client Management
   3. Check "Pending Requests" tab
   4. Review each new request
   5. Approve legitimate businesses
   6. Reject suspicious requests with notes
   ```

2. **Code Maintenance (Weekly)**

   ```
   1. Check "Active Clients" tab
   2. Sort by "Expires At" column
   3. Identify codes expiring soon
   4. Contact clients if renewal needed
   5. Regenerate codes as necessary
   ```

3. **Activity Monitoring (As needed)**

   ```
   1. Review activity logs
   2. Check for unusual patterns
   3. Investigate high usage
   4. Document any concerns
   ```

#### Managing Specific Situations

**Approving a Request:**

1. Click on the request to view details
2. Verify business information
3. Check for previous requests
4. Click "Approve" button
5. Add admin notes if needed
6. System generates code automatically
7. Email sent to client

**Rejecting a Request:**

1. Click on the request
2. Review why it should be rejected
3. Click "Reject" button
4. Add explanation in admin notes
5. Consider sending manual email if needed

**Regenerating an Expired Code:**

1. Find client in "Active Clients" tab
2. Click "Regenerate Code" button
3. Confirm the action
4. New code generated with 30-day expiration
5. Email sent to client automatically

**Investigating Suspicious Activity:**

1. Go to client's activity log
2. Look for patterns:
   - Multiple failed validations
   - Rapid submission attempts
   - Unusual posting content
3. Document findings in admin notes
4. Deactivate code if necessary
5. Contact client if legitimate issue

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Access Code Invalid or Expired"

**Possible Causes:**

- Code has expired (over 30 days old)
- Code was deactivated by admin
- Typo in entering code
- Code doesn't exist

**Solutions:**

- Double-check code spelling
- Ensure no spaces before/after code
- Contact admin for new code if expired
- Request new code if never received

#### 2. "Failed to Submit Job Posting"

**Possible Causes:**

- Network connection issue
- Validation errors in form
- Access code expired during submission
- Server temporarily unavailable

**Solutions:**

- Check all required fields are filled
- Ensure email format is correct
- Try refreshing page and re-entering
- Contact support if persists

#### 3. "Cannot Request Access Code"

**Possible Causes:**

- Previous request still pending
- Email already has active code
- Form validation failing
- Rate limit exceeded

**Solutions:**

- Check email for existing code
- Wait for pending request approval
- Verify all fields are complete
- Try again in a few hours

#### 4. Admin: "Cannot Approve Request"

**Possible Causes:**

- Session expired
- Request already processed
- Database connection issue
- Insufficient permissions

**Solutions:**

- Log out and back in
- Refresh the page
- Check request status
- Verify admin permissions

### Database Queries for Troubleshooting

**Check code status:**

```sql
SELECT * FROM "clientAccessCodes"
WHERE code = 'AB3CD5EF';
```

**View recent activities:**

```sql
SELECT * FROM "clientActivities"
WHERE client_id = 123
ORDER BY created_at DESC
LIMIT 10;
```

**Find pending requests:**

```sql
SELECT * FROM "clientCodeRequests"
WHERE status = 'pending'
ORDER BY created_at DESC;
```

**Check job postings by client:**

```sql
SELECT * FROM "jobPostings"
WHERE client_email = 'client@example.com'
ORDER BY created_at DESC;
```

---

## Technical Implementation Details

### Code Generation Algorithm

```typescript
// <GenerateAccessCodeSnippet>
// This function creates a unique access code for clients
// It makes sure the code is random and hasn't been used before
function generateAccessCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  // Create an 8-character code
  for (let i = 0; i < 8; i++) {
    // Pick a random character from our list
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}
// </GenerateAccessCodeSnippet>
```

### Code Validation Process

```typescript
// <ValidateAccessCodeSnippet>
// This function checks if an access code is valid and can be used
async function validateAccessCode(code: string) {
  // Look up the code in the database
  const accessCode = await findCodeInDatabase(code);

  // Check if code exists
  if (!accessCode) {
    return { valid: false, reason: "Code not found" };
  }

  // Check if code is still active
  if (!accessCode.is_active) {
    return { valid: false, reason: "Code has been deactivated" };
  }

  // Check if code has expired
  const now = new Date();
  if (now > accessCode.expires_at) {
    return { valid: false, reason: "Code has expired" };
  }

  // Code is valid!
  return {
    valid: true,
    clientName: accessCode.client_name,
    expiresAt: accessCode.expires_at,
  };
}
// </ValidateAccessCodeSnippet>
```

### Activity Logging System

```typescript
// <LogActivitySnippet>
// This function records every action a client takes
async function logActivity(clientId: number, activityType: string, data: any) {
  // Prepare the activity record
  const activity = {
    client_id: clientId,
    activity_type: activityType,
    activity_data: JSON.stringify(data),
    ip_address: getUserIP(),
    user_agent: getUserAgent(),
    created_at: new Date(),
  };

  // Save to database
  await saveActivityToDatabase(activity);

  // Log for monitoring
  console.log(`Activity logged: ${activityType} for client ${clientId}`);
}
// </LogActivitySnippet>
```

### Email Notification System

```typescript
// <SendAccessCodeEmailSnippet>
// This function sends the access code to approved clients
async function sendAccessCodeEmail(
  clientEmail: string,
  clientName: string,
  accessCode: string,
  expiresAt: Date
) {
  // Format the expiration date nicely
  const expirationDate = formatDate(expiresAt);

  // Create the email content
  const emailContent = {
    to: clientEmail,
    subject: "Your Talencor Access Code",
    html: `
      <h2>Welcome to Talencor Client Portal</h2>
      <p>Dear ${clientName},</p>
      <p>Your access code has been approved!</p>
      <div style="background: #f0f0f0; padding: 15px; margin: 20px 0;">
        <strong>Access Code:</strong> ${accessCode}
      </div>
      <p>This code will expire on ${expirationDate}.</p>
      <p>Use this code to submit job postings at talencor.com/job-posting</p>
      <p>Best regards,<br>Talencor Team</p>
    `,
  };

  // Send the email
  await sendEmail(emailContent);
}
// </SendAccessCodeEmailSnippet>
```

### Security Measures Implementation

```typescript
// <SecurityCheckSnippet>
// This function performs security checks before processing requests
async function performSecurityChecks(request: any) {
  // Check 1: Honeypot field (should be empty)
  if (request.honey_pot && request.honey_pot.length > 0) {
    // This is likely a bot, reject silently
    logSuspiciousActivity("Honeypot triggered", request);
    return { passed: false, reason: "Security check failed" };
  }

  // Check 2: Rate limiting
  const requestCount = await getRequestCount(request.ip, "1hour");
  if (requestCount > 10) {
    // Too many requests from this IP
    return { passed: false, reason: "Rate limit exceeded" };
  }

  // Check 3: Email validation
  if (!isValidEmail(request.email)) {
    return { passed: false, reason: "Invalid email format" };
  }

  // Check 4: Duplicate detection
  const existingRequest = await checkForDuplicate(request.email);
  if (existingRequest && existingRequest.status === "pending") {
    return { passed: false, reason: "Request already pending" };
  }

  // All checks passed
  return { passed: true };
}
// </SecurityCheckSnippet>
```

---

## Best Practices

### For Clients

1. **Keep your access code secure**
   - Don't share with unauthorized persons
   - Store in a password manager
   - Don't post in public forums

2. **Provide accurate information**
   - Use real company details
   - Provide working contact information
   - Be specific in job descriptions

3. **Monitor code expiration**
   - Mark expiration date in calendar
   - Request renewal before expiration
   - Don't wait until last minute

### For Administrators

1. **Regular maintenance**
   - Review requests daily
   - Clean up expired codes monthly
   - Archive old activities quarterly

2. **Documentation**
   - Always add admin notes
   - Document rejection reasons
   - Track unusual patterns

3. **Security vigilance**
   - Monitor for abuse patterns
   - Investigate suspicious activity
   - Update security measures regularly

4. **Client communication**
   - Respond to requests promptly
   - Provide clear rejection reasons
   - Offer support for legitimate issues

---

## System Maintenance

### Daily Tasks

- Review pending access requests
- Check for system errors in logs
- Monitor active user sessions

### Weekly Tasks

- Review expiring codes
- Check activity patterns
- Update admin documentation

### Monthly Tasks

- Archive old activities
- Review security logs
- Generate usage reports
- Clean up expired codes

### Quarterly Tasks

- Security audit
- Performance review
- Database optimization
- Update documentation

---

## Contact and Support

### For Clients

- **Email**: <support@talencor.com>
- **Phone**: 555-0100
- **Hours**: Monday-Friday, 9 AM - 5 PM EST

### For Administrators

- **Internal Support**: <admin@talencor.com>
- **Emergency**: Contact system administrator
- **Documentation**: This guide and inline help

### For Developers

- **Repository**: Internal GitLab
- **Documentation**: Technical wiki
- **Issues**: Create ticket in issue tracker

---

## Appendix

### A. Status Codes

| Status   | Description                 | User Action Required      |
| -------- | --------------------------- | ------------------------- |
| pending  | Request awaiting review     | Wait for admin approval   |
| approved | Request approved, code sent | Use code to post jobs     |
| rejected | Request denied              | Contact support if needed |
| expired  | Code past 30-day limit      | Request new code          |
| active   | Code currently valid        | Can submit job postings   |
| inactive | Code manually disabled      | Contact administrator     |

### B. Activity Types

| Type             | Description                  | Triggered By             |
| ---------------- | ---------------------------- | ------------------------ |
| code_requested   | New access request submitted | Client form submission   |
| code_validated   | Code checked for validity    | Job posting page         |
| job_posted       | Job successfully submitted   | Job form submission      |
| code_regenerated | New code created for client  | Admin action             |
| status_changed   | Request status updated       | Admin approval/rejection |
| code_expired     | Code reached expiration      | Automatic system check   |

### C. Error Messages

| Error            | Meaning                    | Solution                    |
| ---------------- | -------------------------- | --------------------------- |
| INVALID_CODE     | Code doesn't exist or typo | Check spelling, request new |
| EXPIRED_CODE     | Code over 30 days old      | Request new code            |
| INACTIVE_CODE    | Code manually disabled     | Contact administrator       |
| RATE_LIMITED     | Too many requests          | Wait before trying again    |
| VALIDATION_ERROR | Form fields invalid        | Check all required fields   |
| SERVER_ERROR     | System temporarily down    | Try again later             |

### D. Database Indexes

For optimal performance, ensure these indexes exist:

```sql
-- Speed up code lookups
CREATE INDEX idx_access_codes_code ON "clientAccessCodes"(code);

-- Speed up email searches
CREATE INDEX idx_access_codes_email ON "clientAccessCodes"(client_email);

-- Speed up request queries
CREATE INDEX idx_requests_status ON "clientCodeRequests"(status);
CREATE INDEX idx_requests_email ON "clientCodeRequests"(email);

-- Speed up activity queries
CREATE INDEX idx_activities_client ON "clientActivities"(client_id);
CREATE INDEX idx_activities_type ON "clientActivities"(activity_type);
CREATE INDEX idx_activities_created ON "clientActivities"(created_at);

-- Speed up job posting queries
CREATE INDEX idx_jobs_company ON "jobPostings"(company_name);
CREATE INDEX idx_jobs_email ON "jobPostings"(email);
CREATE INDEX idx_jobs_client ON "jobPostings"(client_id);
CREATE INDEX idx_jobs_status ON "jobPostings"(status);
```

---

## Version History

| Version | Date     | Changes                      |
| ------- | -------- | ---------------------------- |
| 1.0     | Jan 2025 | Initial release              |
| 1.1     | Jan 2025 | Added activity logging       |
| 1.2     | Jan 2025 | Enhanced security features   |
| 1.3     | Jan 2025 | Admin dashboard improvements |

---

_Last Updated: January 2025_ _Document Version: 1.3_ _System Version: 1.0.0_
