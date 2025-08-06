# Talencor Job-Posting Feature – Project Overview (Non-Technical)

## 1. Purpose and Goals

The purpose of this project is to transform the existing "Post a Job" button on
the Talencor Staffing website into a fully functional job-posting tool that:

- Allows any business to submit details about a job vacancy.
- Collects just enough information to qualify the lead without causing friction
  for the visitor.
- Clearly explains that Talencor will reach out to new companies to discuss
  pricing, contracts and regulatory requirements before listing the job
  publicly.
- Provides a simple process for existing Talencor clients to submit job orders.
- Serves as an inbound marketing funnel, converting prospective companies into
  clients by capturing their details and showcasing the value of Talencor's
  staffing services.

## 2. Background

A review of the current site and code base showed that the "Post a Job" button
simply links to the general contact page. There is no dedicated workflow for a
company to submit a job order, and visitors are not informed of the steps
required to become a client. The site is built with modern frontend frameworks,
so adding a new page and form can be accomplished without disrupting existing
pages.

## 3. Summary of the New Feature

The new feature will consist of:

1. A dedicated job-posting page accessible from the Employers section (e.g.,
   `/post-job`).
2. A short web form that captures the most important details about the company
   and the job they want to fill.
3. Clear messaging that explains what happens after the form is submitted,
   including that Talencor will contact non-clients to discuss contracts.
4. An internal workflow that notifies Talencor's recruiting team, records the
   submission and guides the process from lead qualification to job posting.
5. A simple way for existing clients to log in or identify themselves so their
   jobs can be posted without delay.

## 4. High-Level User Journey

1. **Finding the Form.** A business user clicks "Post a Job" or "Post a Job
   Opening" from the Employers page. They are taken to the new job-posting page.
   The page's introduction reassures them that posting a job is free and that a
   recruiter will be in touch within one business day.

2. **Completing the Form.** The user fills out a simple form with contact and
   job details. Required fields include their name, company name, email, phone,
   job title, job location and employment type. Optional fields allow them to
   provide more details about the role. They indicate whether they are already a
   Talencor client.

3. **Acknowledgement.** Upon submission, the user receives an on-screen
   confirmation message thanking them for the information and explaining that
   Talencor will contact them shortly. An automated confirmation email may also
   be sent.

4. **Internal Review.** The recruiter team receives a notification with the
   submission details and sees the request in the internal system. If the
   company is an existing client, the recruiter can quickly verify the contract
   and proceed to post the job. If the company is new, the recruiter begins the
   new-client onboarding process (pricing, contract signing and compliance
   documentation).

5. **Job Activation.** Once a contract has been signed (for new clients) or
   verified (for existing clients), the job is marked as ready and is published
   on the public job board. The recruiting team begins sourcing and screening
   candidates.

## 5. Form Requirements (What the user should see)

The form should be welcoming, concise and easy to navigate. Instructions should
be clear and supportive. Fields should be grouped logically so the user doesn't
feel overwhelmed.

### 5.1 Core Fields (Required)

- **Contact name** – The name of the person submitting the job.
- **Company name** – The legal name of the company hiring.
- **Email address** – For Talencor to follow up.
- **Phone number** – Useful for quick communications.
- **Job title** – The position the company wants to fill (e.g., "Warehouse
  Associate").
- **Location** – City and province (or "Remote").
- **Employment type** – A choice of "Permanent," "Temporary" or
  "Contract-to-Hire."
- **Are you an existing client?** – A yes/no question to help route the request
  appropriately.

### 5.2 Additional Fields (Optional)

- **Anticipated start date** – When the position needs to be filled.
- **Salary or pay range** – Optional figure to assist with candidate targeting.
- **Job description** – A brief summary of responsibilities and qualifications.
- **Comments or special requirements** – Anything else the company wants
  Talencor to know.

### 5.3 UX Considerations

- Clearly mark required fields and use helpful placeholder text.
- Break the form into two small sections if needed (contact details first, job
  details second) to make it feel shorter.
- Include a short privacy notice explaining that the information will only be
  used to contact the user about their hiring needs.
- Use a friendly, action-oriented submit button label such as "Send Job
  Request."

## 6. Data Handling (High-Level Overview)

When the form is submitted, the website will create a new record in a secure
storage system (database or CRM). Each record will include the fields listed
above plus timestamps and a status field. The status field tracks where the
request is in the process (for example: "new," "contacted," "contract pending,"
"posted," or "closed").

No sensitive financial information is collected. The data will only be used by
Talencor's recruitment and sales teams to follow up on the request and to post
the job once all necessary agreements are in place.

## 7. Internal Notifications and Workflow

- **Automatic notification.** Each new job-posting request triggers an email or
  system alert to the designated recruiter team. The alert includes the form
  details and a link to view the full record.
- **Lead qualification.** A recruiter reviews the submission. If the company
  indicated that they are an existing client, the recruiter checks that a
  current contract and compliance documents exist.
- **Onboarding for new companies.** If the company is not yet a client, the
  recruiter contacts the person who submitted the job to explain Talencor's
  services and discuss pricing, terms and required documents (e.g., WSIB and
  insurance information).
- **Status updates.** As the recruiter makes contact and progresses through
  contract negotiation, the record's status is updated (e.g., from "new" to
  "contacted" to "contract signed").
- **Job activation.** Once the contract is finalized, the recruiter (or an
  administrator) publishes the job on the public job board. At this point the
  record's status changes to "posted," and candidates can apply.
- **Ongoing communication.** The recruiter keeps the company informed about the
  hiring progress and provides updates until the position is filled.

## 8. Non-Client Follow-Up and Nurturing

Companies that do not sign a contract immediately should be added to a nurturing
list. This list can receive periodic emails with helpful hiring tips, case
studies and success stories. The goal is to build trust and remain top-of-mind
until the company is ready to engage Talencor's services.

## 9. Success Criteria (How to know the feature works)

- The job-posting page is easy to find from the Employers section and clearly
  explains the process.
- The form captures the essential information without causing confusion or
  abandonment.
- Submitted requests trigger prompt internal notifications and appear in the
  recruiter's pipeline.
- Recruiters can easily distinguish between new and existing clients and follow
  the appropriate process.
- New clients receive timely outreach and clear guidance on how to become a
  partner.
- Jobs are only posted to the public board once contracts are signed, ensuring
  compliance with Talencor's policies.
- Website analytics show that the form conversion rate (number of completed
  submissions divided by number of visits to the job-posting page) is meeting or
  exceeding targets.

## 10. Dependencies and Considerations

- **Content and copywriting.** The IT team will need finalised wording for the
  form headings, field labels and confirmation messages. Marketing or leadership
  should supply this copy.
- **Design consistency.** The form should follow the existing Talencor website's
  styling (typography, colours, spacing). A designer may need to supply any new
  icons or illustrations.
- **CRM integration.** If Talencor uses a Customer Relationship Management
  system, the IT team should plan how new job-posting records feed into it. If
  no CRM exists, a simple database or spreadsheet can be used initially.
- **Email confirmations.** Automated emails sent to both the user and the
  internal team will require access to an email-sending service.
- **Spam prevention.** Include basic protections (e.g., hidden fields or
  CAPTCHA) to prevent automated spam submissions without making the form
  difficult for real users.
- **Accessibility.** Ensure that labels, placeholders and confirmation messages
  are clear for screen-reader users and that colour choices meet contrast
  guidelines.
- **Privacy.** A link to Talencor's privacy policy should be present, and data
  handling must comply with applicable privacy laws.
