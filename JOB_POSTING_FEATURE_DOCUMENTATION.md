# Job Posting Feature - Complete Workflow Documentation

**Last Updated:** August 3, 2025

## Table of Contents
1. [Overview](#overview)
2. [User Journey](#user-journey)
3. [Client Access Code System](#client-access-code-system)
4. [Technical Architecture](#technical-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Form Validation](#form-validation)
8. [Internal Workflow](#internal-workflow)
9. [Status Management](#status-management)
10. [Error Handling](#error-handling)
11. [Security Considerations](#security-considerations)

## Overview

The Job Posting feature allows businesses to submit job vacancies through Talencor's website. The system collects essential information, distinguishes between new and existing clients, and manages the entire workflow from submission to job activation.

### Key Features:
- User-friendly job posting form
- Client access code system for existing client verification
- Automatic client status detection with dynamic feedback messages
- Real-time form validation
- Status tracking system
- Email notification system (confirmation to submitter, alerts to recruiters)
- Admin dashboard for managing submissions
- Spam prevention using honeypot technique
- Comprehensive data storage

## User Journey

### Step 1: Accessing the Job Posting Form

**Entry Points:**
1. **From Employers Page** → Click "Post a Job" button
   - URL: `/employers` → `/post-job`
   - Button location: Hero section of Employers page

2. **Direct URL Access**
   - URL: `https://[domain]/post-job`

### Step 2: Form Presentation

When users arrive at `/post-job`, they see:

1. **Page Header**
   - Title: "Post a Job Opening"
   - Subtitle explaining the process
   - Back link to Employers page

2. **Form Sections**
   - Client Access Code (optional for existing clients)
   - Contact Information
   - Job Details
   - Client Status
   - Privacy Notice

### Step 3: Filling Out the Form

#### Contact Information Section (All Required)
1. **Contact Name**
   - Text input field
   - Placeholder: "John Doe"
   - Validation: Required, non-empty

2. **Company Name**
   - Text input field
   - Placeholder: "ABC Corporation"
   - Validation: Required, non-empty

3. **Email Address**
   - Email input field
   - Placeholder: "john@company.com"
   - Validation: Required, valid email format

4. **Phone Number**
   - Tel input field
   - Placeholder: "(555) 123-4567"
   - Validation: Required, minimum 10 characters

#### Job Details Section
1. **Job Title** (Required)
   - Text input field
   - Placeholder: "Warehouse Associate"
   - Validation: Required, non-empty

2. **Location** (Required)
   - Text input field
   - Placeholder: "Toronto, ON"
   - Helper text: "City and province, or 'Remote'"
   - Validation: Required, non-empty

3. **Employment Type** (Required)
   - Dropdown select field
   - Options: Permanent, Temporary, Contract-to-Hire
   - Default: "permanent"
   - Validation: Required, must be valid option

4. **Anticipated Start Date** (Optional)
   - Date picker with calendar
   - Validation: Must be future date
   - Format: Displayed as "PPP" (e.g., "January 15, 2025")

5. **Salary or Pay Range** (Optional)
   - Text input field
   - Placeholder: "$20-25/hour"
   - Helper text: "Optional - helps with candidate targeting"

6. **Job Description** (Optional)
   - Textarea field
   - Placeholder: "Brief summary of responsibilities and qualifications..."
   - Minimum height: 120px

7. **Special Requirements or Comments** (Optional)
   - Textarea field
   - Placeholder: "Any additional information we should know..."
   - Minimum height: 100px

#### Client Status Section
1. **Existing Client Toggle**
   - Switch/toggle component
   - Label: "Are you an existing Talencor client?"
   - Helper text: "This helps us process your request faster"
   - Default: false (unchecked)

2. **Dynamic Feedback Messages**
   - **For Existing Clients:** Green info box displays: "Great! As an existing client, your job will be prioritized for immediate processing."
   - **For New Clients:** Blue info box displays: "Welcome! After submission, a recruiter will contact you to discuss our services and finalize contract terms before posting your job."

### Step 4: Form Submission

1. **Submit Button**
   - Label: "Send Job Request"
   - Shows loading state with spinner when clicked
   - Disabled during submission

2. **Form Behavior**
   - **Enter Key Prevention:** Pressing Enter in input fields does NOT submit the form (prevents accidental submissions)
   - Form can only be submitted by clicking the Submit button

3. **Validation Process**
   - Client-side validation runs first
   - Shows inline error messages for invalid fields
   - Prevents submission until all required fields are valid
   - Honeypot field checks for bot submissions

4. **Data Transmission**
   - Form data is sent to `/api/job-postings` via POST request
   - Date is formatted to "yyyy-MM-dd" format
   - Email notifications are sent upon successful submission

### Step 5: Post-Submission Experience

#### Success State:
1. **Confirmation Page Shows:**
   - Green checkmark icon
   - "Thank You!" heading
   - Success message: "Your job posting has been successfully submitted..."
   
2. **For New Clients (isExistingClient = false):**
   - Orange info box explaining next steps:
     - Recruiter will review submission
     - Discussion of pricing and contract terms
     - Job publication after agreement
     - Regular candidate updates

3. **Action Buttons:**
   - "Back to Home" → Returns to homepage
   - "Post Another Job" → Resets form for new submission

#### Error State:
1. **Toast Notification Shows:**
   - Red error message
   - "Error submitting job posting"
   - Suggestion to try again or contact directly

## Technical Architecture

### Frontend Components

#### 1. Job Posting Page Component
**File:** `client/src/pages/job-posting.tsx`

**Key Features:**
- React functional component with hooks
- Form state management using `react-hook-form`
- Zod schema validation
- TanStack Query for API calls
- Framer Motion animations
- Responsive design with Tailwind CSS

**Component Structure:**
```typescript
- JobPosting (main component)
  - Form (shadcn/ui form wrapper)
    - Contact Information Fields
    - Job Details Fields
    - Client Status Toggle
    - Privacy Notice
    - Submit Button
  - Success Confirmation View
```

#### 2. Form Schema
```typescript
const jobPostingFormSchema = insertJobPostingSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  jobDescription: z.string().optional(),
  salaryRange: z.string().optional(),
  specialRequirements: z.string().optional(),
  anticipatedStartDate: z.date().optional(),
});
```

### Backend Architecture

#### 1. Database Table
**Table Name:** `job_postings`

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `contact_name` (TEXT NOT NULL)
- `company_name` (TEXT NOT NULL)
- `email` (TEXT NOT NULL)
- `phone` (TEXT NOT NULL)
- `job_title` (TEXT NOT NULL)
- `location` (TEXT NOT NULL)
- `employment_type` (TEXT NOT NULL)
- `is_existing_client` (BOOLEAN DEFAULT FALSE)
- `anticipated_start_date` (DATE)
- `salary_range` (TEXT)
- `job_description` (TEXT)
- `special_requirements` (TEXT)
- `status` (TEXT DEFAULT 'new')
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

#### 2. API Routes
**File:** `server/routes.ts`

**Endpoints:**
1. **POST /api/job-postings**
   - Creates new job posting
   - Validates input data
   - Returns success with posting ID

2. **GET /api/job-postings**
   - Retrieves all job postings
   - Optional status filter
   - Returns array of postings

3. **GET /api/job-postings/:id**
   - Retrieves single posting by ID
   - Returns 404 if not found

4. **PATCH /api/job-postings/:id/status**
   - Updates posting status
   - Validates status value
   - Returns updated posting

#### 3. Storage Layer
**File:** `server/storage.ts`

**Methods:**
- `createJobPosting(posting)` - Inserts new posting
- `getJobPostings(filters)` - Retrieves postings with optional filters
- `getJobPostingById(id)` - Gets single posting
- `updateJobPostingStatus(id, status)` - Updates posting status

## Database Schema

### Drizzle ORM Schema Definition
```typescript
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  // Contact Information
  contactName: text("contact_name").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Job Details
  jobTitle: text("job_title").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(),
  isExistingClient: boolean("is_existing_client").default(false).notNull(),
  
  // Optional Fields
  anticipatedStartDate: date("anticipated_start_date"),
  salaryRange: text("salary_range"),
  jobDescription: text("job_description"),
  specialRequirements: text("special_requirements"),
  
  // Status Management
  status: text("status").default("new").notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### TypeScript Types
```typescript
export type JobPosting = {
  id: number;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  employmentType: string;
  isExistingClient: boolean;
  anticipatedStartDate: Date | null;
  salaryRange: string | null;
  jobDescription: string | null;
  specialRequirements: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### 1. Create Job Posting
**Endpoint:** `POST /api/job-postings`

**Request Body:**
```json
{
  "contactName": "John Doe",
  "companyName": "ABC Corporation",
  "email": "john@company.com",
  "phone": "(555) 123-4567",
  "jobTitle": "Warehouse Associate",
  "location": "Toronto, ON",
  "employmentType": "permanent",
  "isExistingClient": false,
  "anticipatedStartDate": "2025-02-01",
  "salaryRange": "$20-25/hour",
  "jobDescription": "Looking for experienced warehouse associate...",
  "specialRequirements": "Must have forklift certification"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "id": 123
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid form data",
  "errors": [
    {
      "path": ["email"],
      "message": "Please enter a valid email address"
    }
  ]
}
```

### 2. Get Job Postings
**Endpoint:** `GET /api/job-postings?status=new`

**Query Parameters:**
- `status` (optional): Filter by status value

**Success Response (200):**
```json
[
  {
    "id": 123,
    "contactName": "John Doe",
    "companyName": "ABC Corporation",
    "email": "john@company.com",
    "phone": "(555) 123-4567",
    "jobTitle": "Warehouse Associate",
    "location": "Toronto, ON",
    "employmentType": "permanent",
    "isExistingClient": false,
    "anticipatedStartDate": "2025-02-01",
    "salaryRange": "$20-25/hour",
    "jobDescription": "Looking for experienced warehouse associate...",
    "specialRequirements": "Must have forklift certification",
    "status": "new",
    "createdAt": "2025-01-03T12:00:00Z",
    "updatedAt": "2025-01-03T12:00:00Z"
  }
]
```

### 3. Get Single Job Posting
**Endpoint:** `GET /api/job-postings/:id`

**Success Response (200):**
Returns single job posting object

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

### 4. Update Job Posting Status
**Endpoint:** `PATCH /api/job-postings/:id/status`

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Valid Status Values:**
- `new`
- `contacted`
- `contract_pending`
- `posted`
- `closed`

**Success Response (200):**
```json
{
  "success": true,
  "posting": { /* updated posting object */ }
}
```

## Form Validation

### Client-Side Validation

1. **Required Field Validation**
   - All required fields must be non-empty
   - Shows inline error messages

2. **Email Validation**
   - Must match email format (contains @ and domain)
   - Custom error: "Please enter a valid email address"

3. **Phone Validation**
   - Minimum 10 characters
   - Custom error: "Please enter a valid phone number"

4. **Date Validation**
   - Must be future date (after today)
   - Disabled dates in calendar picker

5. **Employment Type Validation**
   - Must be one of: permanent, temporary, contract-to-hire

### Server-Side Validation

1. **Zod Schema Validation**
   - Runs before database insertion
   - Returns 400 status with detailed errors

2. **Database Constraints**
   - NOT NULL constraints on required fields
   - Default values for status and timestamps

## Internal Workflow

### Step 1: Submission Notification
**When:** Immediately after successful form submission

**Actions:**
1. Console log created with submission details:
   ```
   New job posting created:
   - ID: 123
   - Company: ABC Corporation
   - Job Title: Warehouse Associate
   - Is Existing Client: false
   ```

2. **Email Notifications Sent:**
   
   **Confirmation Email to Submitter:**
   - Subject: "Job Posting Received - Talencor Staffing"
   - Includes job details and next steps
   - Different messaging for new vs existing clients
   - Professional HTML template with Talencor branding
   
   **Internal Alert to Recruiting Team:**
   - Subject: "New Job Posting: [Job Title] at [Company]"
   - Sent to recruiting@talencor.com (or configured email)
   - Includes all submission details
   - Shows client status (NEW CLIENT or EXISTING CLIENT)
   - Provides action items based on client type
   - Links to admin dashboard for viewing submission

### Step 2: Lead Qualification
**Who:** Recruiting team member
**When:** Within one business day

**Process:**
1. Access job postings dashboard at `/admin/job-postings`
2. Review new submissions (status = "new")
3. Check if existing client:
   - If YES → Verify current contract exists
   - If NO → Begin new client onboarding

### Step 3: Client Contact
**For New Clients:**
1. Update status to "contacted"
2. Call/email to discuss:
   - Talencor's services
   - Pricing structure
   - Contract terms
   - Required documents (WSIB, insurance)

**For Existing Clients:**
1. Verify contract is current
2. Proceed directly to job posting

### Step 4: Contract Processing
**For New Clients Only:**
1. Send contract documents
2. Update status to "contract_pending"
3. Wait for signed agreement
4. Collect compliance documents

### Step 5: Job Activation
**When:** Contract signed/verified

**Actions:**
1. Update status to "posted"
2. Publish job on public job board
3. Begin candidate sourcing
4. Start screening process

### Step 6: Ongoing Management
1. Regular updates to client
2. Candidate submissions
3. Interview coordination
4. Status updates until position filled
5. Update status to "closed" when complete

## Status Management

### Status Values and Transitions

```
new → contacted → contract_pending → posted → closed
                ↓                  ↓
                └──────────────────┘
```

**Status Definitions:**
1. **new** - Initial submission, awaiting review
2. **contacted** - Recruiter has reached out to company
3. **contract_pending** - Awaiting contract signature (new clients)
4. **posted** - Job is live on public board
5. **closed** - Position filled or cancelled

### Status Update Process
1. Only authorized staff can update status via admin dashboard
2. Updates tracked with timestamp
3. Status history maintained via updated_at field
4. Admin dashboard available at `/admin/job-postings` for managing all submissions

## Error Handling

### Form Submission Errors

1. **Validation Errors**
   - Inline field-level error messages
   - Prevents form submission
   - Clear error descriptions

2. **Network Errors**
   - Toast notification shown
   - Suggests retry or direct contact
   - Form data preserved

3. **Server Errors**
   - 500 status returns generic error
   - Error logged to console
   - User-friendly message displayed

### API Error Responses

1. **400 Bad Request**
   - Invalid input data
   - Returns validation errors array

2. **404 Not Found**
   - Resource doesn't exist
   - Clear error message

3. **500 Internal Server Error**
   - Database or system errors
   - Generic user message
   - Detailed error logged

## Security Considerations

### Data Protection
1. **No Sensitive Data Collection**
   - No SSN, financial info, or passwords
   - Only business contact information

2. **HTTPS Transport**
   - All data transmitted over HTTPS
   - Prevents man-in-the-middle attacks

3. **Input Sanitization**
   - Zod validation prevents injection attacks
   - Database parameterized queries

### Spam Prevention
1. **Honeypot Field Implementation**
   - Hidden field invisible to real users
   - Automatically filled by bots
   - Submissions rejected if honeypot is filled
   - No user interaction required (better UX than CAPTCHA)

### Access Control
1. **Public Submission**
   - Anyone can submit job posting
   - No authentication required for submission

2. **Admin Access**
   - Admin dashboard available at `/admin/job-postings`
   - Currently open access (authentication to be implemented)
   - Allows viewing all submissions and updating status

### Privacy Compliance
1. **Privacy Notice**
   - Displayed on form
   - Explains data usage
   - Links to privacy policy

2. **Data Retention**
   - Stored in secure PostgreSQL database
   - Regular backups maintained
   - Retention policy to be defined

## Implemented Features

1. **Email Notifications (Implemented)**
   - Automated confirmations sent to submitters with job details
   - Internal alerts sent to recruiting team with full submission info
   - Different email content for new vs existing clients
   - Professional HTML templates with branding

2. **Admin Dashboard (Implemented)**
   - Available at `/admin/job-postings`
   - View all job posting submissions
   - Filter by status (new, contacted, contract_pending, posted, closed)
   - Update individual posting status
   - View complete submission details

## Future Enhancements

3. **Client Portal**
   - Login for existing clients
   - View their job postings
   - Track candidate progress

4. **API Authentication**
   - Secure endpoints for status updates
   - JWT or session-based auth

5. **Audit Trail**
   - Track all status changes
   - Record who made changes
   - Timestamp all actions

6. **Integration Options**
   - CRM integration
   - Job board syndication
   - Applicant tracking system

## Testing Checklist

### User Interface Testing
- [ ] Form loads correctly at /post-job
- [ ] All form fields display properly
- [ ] Required field indicators visible
- [ ] Calendar picker works
- [ ] Toggle switch functions
- [ ] Validation messages appear
- [ ] Submit button loading state
- [ ] Success page displays
- [ ] Navigation links work

### API Testing
- [ ] POST creates new posting
- [ ] GET retrieves all postings
- [ ] GET by ID returns correct posting
- [ ] PATCH updates status
- [ ] Invalid data returns 400
- [ ] Missing posting returns 404

### Database Testing
- [ ] All fields save correctly
- [ ] Timestamps auto-populate
- [ ] Status defaults to "new"
- [ ] Optional fields handle NULL

### Integration Testing
- [ ] Form submission creates database record
- [ ] Success response shows correct ID
- [ ] Error handling works end-to-end
- [ ] Date formatting preserved

## Client Access Code System

### Overview
The client access code system provides a streamlined experience for existing Talencor clients by allowing them to:
- Auto-populate their contact information
- Fast-track their job postings
- Skip initial verification steps

### Implementation Details

#### Database Schema

**Table: `clients`**
```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  access_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Relation to job_postings:**
- `job_postings.client_id` → References `clients.id`
- Allows tracking which postings came from verified clients

### User Experience

1. **Access Code Entry**
   - Orange-highlighted section at top of job posting form
   - Input field with "Verify Code" button
   - Real-time verification without page reload

2. **Successful Verification**
   - Green checkmark indicates success
   - Form fields auto-populate:
     - Company Name
     - Contact Name
     - Email
     - Phone (if available)
   - "Existing Client" toggle automatically set to true
   - Fields remain editable if updates needed

3. **Failed Verification**
   - Error toast notification appears
   - User can retry or continue without code
   - Form remains fully functional

### API Endpoints

#### Verify Client Access Code
**Endpoint:** `POST /api/verify-client`

**Request Body:**
```json
{
  "accessCode": "ACME2025"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "client": {
    "companyName": "Acme Corporation",
    "contactName": "John Smith",
    "email": "john.smith@acme.com",
    "phone": "416-555-0001"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid access code"
}
```

### Benefits

1. **For Clients:**
   - Faster form completion
   - No need to re-enter company details
   - Immediate recognition as trusted client
   - Priority processing

2. **For Talencor:**
   - Verified client submissions
   - Reduced manual verification
   - Better client experience
   - Faster workflow processing

### Status Workflow Impact

When a valid access code is used:
- Job posting status starts at "contacted" instead of "new"
- Bypasses initial review queue
- Recruiter can proceed directly with job posting

### Test Access Codes

For development and testing:
- `ACME2025` - Acme Corporation
- `TECH2025` - Tech Solutions Inc  
- `GLOB2025` - Global Manufacturing Ltd

### Security Considerations

1. **Access Code Management**
   - Codes should be unique and non-guessable
   - Regular rotation recommended
   - Deactivation capability via `is_active` flag
   - Audit trail of usage

2. **Data Protection**
   - Only non-sensitive contact info returned
   - No financial or confidential data exposed
   - HTTPS required for all API calls

### Future Enhancements

1. **Access Code Expiration**
   - Add expiration dates to codes
   - Automatic renewal process

2. **Usage Analytics**
   - Track how often codes are used
   - Monitor for suspicious activity

3. **Self-Service Portal**
   - Allow clients to request codes
   - Reset forgotten codes

4. **Multi-User Support**
   - Multiple codes per company
   - Different permission levels