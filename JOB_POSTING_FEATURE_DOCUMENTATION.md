# Job Posting Feature - Complete Workflow Documentation

## Table of Contents
1. [Overview](#overview)
2. [User Journey](#user-journey)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Form Validation](#form-validation)
7. [Internal Workflow](#internal-workflow)
8. [Status Management](#status-management)
9. [Error Handling](#error-handling)
10. [Security Considerations](#security-considerations)

## Overview

The Job Posting feature allows businesses to submit job vacancies through Talencor's website. The system collects essential information, distinguishes between new and existing clients, and manages the entire workflow from submission to job activation.

### Key Features:
- User-friendly job posting form
- Automatic client status detection
- Real-time form validation
- Status tracking system
- Internal notification system
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

### Step 4: Form Submission

1. **Submit Button**
   - Label: "Send Job Request"
   - Shows loading state with spinner when clicked
   - Disabled during submission

2. **Validation Process**
   - Client-side validation runs first
   - Shows inline error messages for invalid fields
   - Prevents submission until all required fields are valid

3. **Data Transmission**
   - Form data is sent to `/api/job-postings` via POST request
   - Date is formatted to "yyyy-MM-dd" format

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

2. TODO: Email notification to recruiting team

### Step 2: Lead Qualification
**Who:** Recruiting team member
**When:** Within one business day

**Process:**
1. Access job postings dashboard (to be built)
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
1. Only authorized staff can update status
2. Updates tracked with timestamp
3. Status history maintained via updated_at field

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

### Access Control
1. **Public Submission**
   - Anyone can submit job posting
   - No authentication required for submission

2. **Admin Access (Future)**
   - Status updates require authentication
   - Role-based permissions planned

### Privacy Compliance
1. **Privacy Notice**
   - Displayed on form
   - Explains data usage
   - Links to privacy policy

2. **Data Retention**
   - Stored in secure PostgreSQL database
   - Regular backups maintained
   - Retention policy to be defined

## Future Enhancements

1. **Email Notifications**
   - Automated confirmations to submitters
   - Internal alerts to recruiting team

2. **Admin Dashboard**
   - View all submissions
   - Filter and search capabilities
   - Bulk status updates

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