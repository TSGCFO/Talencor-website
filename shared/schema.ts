import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  
  // Personal Information
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  socialInsuranceNumber: text("social_insurance_number").notNull(),
  
  // Address Information
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  majorIntersection: text("major_intersection").notNull(),
  
  // Contact Information
  mobileNumber: text("mobile_number").notNull(),
  whatsappNumber: text("whatsapp_number"),
  email: text("email").notNull(),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name").notNull(),
  emergencyContactNumber: text("emergency_contact_number").notNull(),
  emergencyContactRelationship: text("emergency_contact_relationship").notNull(),
  
  // Legal Status
  legalStatus: text("legal_status").notNull(), // Student, Work Permit, PR, Citizen, Other
  
  // Student Schedule (if applicable)
  mondaySchedule: text("monday_schedule"),
  tuesdaySchedule: text("tuesday_schedule"),
  wednesdaySchedule: text("wednesday_schedule"),
  thursdaySchedule: text("thursday_schedule"),
  fridaySchedule: text("friday_schedule"),
  saturdaySchedule: text("saturday_schedule"),
  sundaySchedule: text("sunday_schedule"),
  
  // Transportation & Equipment
  transportationMode: text("transportation_mode").notNull(), // Car, Transit, Ride, Other
  hasSafetyShoes: boolean("has_safety_shoes").notNull(),
  safetyShoeType: text("safety_shoe_type"), // High Ankle, Normal
  hasForkliftCertification: boolean("has_forklift_certification").notNull(),
  forkliftCertificationValidity: text("forklift_certification_validity"),
  
  // Background Check Consent
  backgroundCheckConsent: boolean("background_check_consent").notNull(),
  
  // Work History
  lastCompanyName: text("last_company_name"),
  lastCompanyType: text("last_company_type"),
  lastJobResponsibilities: text("last_job_responsibilities"),
  lastJobAgencyOrDirect: text("last_job_agency_or_direct"),
  reasonForLeaving: text("reason_for_leaving"),
  
  // Physical Capabilities & Preferences
  liftingCapability: text("lifting_capability").notNull(), // 5-10 kgs, 15-20 kgs, 25-30 kgs, 35-40 kgs
  jobType: text("job_type").notNull(), // Short-term job, Long-term job, On-call shifts only
  commitmentMonths: integer("commitment_months"),
  
  // Availability
  morningAvailability: text("morning_availability"),
  afternoonAvailability: text("afternoon_availability"),
  nightAvailability: text("night_availability"),
  
  // How they found us
  referralPersonName: text("referral_person_name"),
  referralPersonNumber: text("referral_person_number"),
  referralPersonRelationship: text("referral_person_relationship"),
  foundViaInternet: text("found_via_internet").array(), // Google, Facebook, Instagram, etc.
  
  // Office Notes
  additionalNotes: text("additional_notes"),
  
  // Agreement
  agreesToTerms: boolean("agrees_to_terms").notNull(),
  applicantSignature: text("applicant_signature").notNull(),
  recruiterSignature: text("recruiter_signature"),
  
  // Aptitude Test Score
  aptitudeTestScore: integer("aptitude_test_score"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  socialInsuranceNumber: z.string().min(9, "Valid SIN required").max(11),
  mobileNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Format: 123-456-7890"),
  email: z.string().email("Valid email required"),
  legalStatus: z.enum(["Student", "Work Permit", "PR", "Citizen", "Other"]),
  transportationMode: z.enum(["Car", "Transit", "Ride", "Other"]),
  liftingCapability: z.enum(["5-10 kgs", "15-20 kgs", "25-30 kgs", "35-40 kgs"]),
  jobType: z.enum(["Short-term job", "Long-term job", "On-call shifts only"]),
  foundViaInternet: z.array(z.string()).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
