import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertJobApplicationSchema, type InsertJobApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Loader2 } from "lucide-react";
import { useState } from "react";

type JobApplicationFormData = InsertJobApplication;

const INTERNET_SOURCES = [
  "Google", "Facebook", "Instagram", "Telegram", "LinkedIn", 
  "TikTok", "Indeed", "Kijiji", "Other"
];

export default function JobApplication() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(insertJobApplicationSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      socialInsuranceNumber: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      majorIntersection: "",
      mobileNumber: "",
      whatsappNumber: "",
      email: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelationship: "",
      legalStatus: "Student" as const,
      mondaySchedule: "",
      tuesdaySchedule: "",
      wednesdaySchedule: "",
      thursdaySchedule: "",
      fridaySchedule: "",
      saturdaySchedule: "",
      sundaySchedule: "",
      transportationMode: "Car" as const,
      hasSafetyShoes: false,
      safetyShoeType: "",
      hasForkliftCertification: false,
      forkliftCertificationValidity: "",
      backgroundCheckConsent: false,
      lastCompanyName: "",
      lastCompanyType: "",
      lastJobResponsibilities: "",
      lastJobAgencyOrDirect: "",
      reasonForLeaving: "",
      liftingCapability: "5-10 kgs" as const,
      jobType: "Short-term job" as const,
      commitmentMonths: 1,
      morningAvailability: "",
      afternoonAvailability: "",
      nightAvailability: "",
      referralPersonName: "",
      referralPersonNumber: "",
      referralPersonRelationship: "",
      foundViaInternet: [],
      additionalNotes: "",
      agreesToTerms: false,
      applicantSignature: "",
      recruiterSignature: "",
      aptitudeTestScore: 0,
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: JobApplicationFormData) => {
      return await apiRequest("/api/job-applications", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully",
        description: "Thank you for your application. We will review it and contact you soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobApplicationFormData) => {
    submitApplication.mutate(data);
  };

  const RequiredLabel = ({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) => (
    <div className="flex items-center gap-1">
      <span className="text-red-500">*</span>
      <span>{children}</span>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Job Application | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Apply for employment opportunities with Talencor Staffing. Complete our comprehensive application form to join our team of skilled professionals." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-montserrat text-navy mb-4">
              Employment Application
            </h1>
            <p className="text-lg text-charcoal">
              Please fill out this form completely. All fields marked with <span className="text-red-500">*</span> are required.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Office: <a href="tel:647-946-2177" className="text-energetic-orange hover:underline">647-946-2177</a>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Personal Information</CardTitle>
                  <CardDescription>Please provide your basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel tooltip="Full name as it appears on your passport">
                            Full Name (as per passport)
                          </RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name in CAPITAL LETTERS" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel tooltip="Your date of birth (DD/MM/YYYY format)">
                              Date of Birth
                            </RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialInsuranceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel tooltip="Your 9-digit Social Insurance Number">
                              Social Insurance Number
                            </RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="123-456-789" maxLength={11} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Address Information</CardTitle>
                  <CardDescription>Current residential address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>Street Address</RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>City</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Toronto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Province</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="ON" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Postal Code</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="M1A 1A1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="majorIntersection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel tooltip="Nearest major intersection to your address">
                            Major Intersection
                          </RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Yonge & Bloor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Contact Information</CardTitle>
                  <CardDescription>How we can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel tooltip="Format: 123-456-7890">
                              Mobile Number
                            </RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="647-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="647-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>Email Address</RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Emergency Contact</CardTitle>
                  <CardDescription>Person to contact in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Contact Number</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="647-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContactRelationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Relationship</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Spouse, Parent, Sibling" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Legal Status & Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Legal Status & Availability</CardTitle>
                  <CardDescription>Your legal status in Canada and schedule information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="legalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>Legal Status in Canada</RequiredLabel>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your legal status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Work Permit">Work Permit</SelectItem>
                            <SelectItem value="PR">Permanent Resident</SelectItem>
                            <SelectItem value="Citizen">Citizen</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("legalStatus") === "Student" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-navy">Class Schedule (if you're a student)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[
                          { name: "mondaySchedule", label: "Mon" },
                          { name: "tuesdaySchedule", label: "Tue" },
                          { name: "wednesdaySchedule", label: "Wed" },
                          { name: "thursdaySchedule", label: "Thu" },
                          { name: "fridaySchedule", label: "Fri" },
                          { name: "saturdaySchedule", label: "Sat" },
                          { name: "sundaySchedule", label: "Sun" },
                        ].map((day) => (
                          <FormField
                            key={day.name}
                            control={form.control}
                            name={day.name as keyof JobApplicationFormData}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{day.label}</FormLabel>
                                <FormControl>
                                  <Input placeholder="9AM-5PM" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transportation & Equipment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Transportation & Equipment</CardTitle>
                  <CardDescription>Your transportation method and safety equipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transportationMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel tooltip="Select only one mode of transportation">
                            Mode of Transportation
                          </RequiredLabel>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transportation mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Transit">Public Transit</SelectItem>
                            <SelectItem value="Ride">Ride Share</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasSafetyShoes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              <RequiredLabel>Do you have safety shoes?</RequiredLabel>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("hasSafetyShoes") && (
                      <FormField
                        control={form.control}
                        name="safetyShoeType"
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormLabel>Type of Safety Shoes</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shoe type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="High Ankle">High Ankle</SelectItem>
                                <SelectItem value="Normal">Normal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasForkliftCertification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              <RequiredLabel>Do you have forklift certification?</RequiredLabel>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("hasForkliftCertification") && (
                      <FormField
                        control={form.control}
                        name="forkliftCertificationValidity"
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormLabel>Certification Validity</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Valid until MM/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="backgroundCheckConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <RequiredLabel tooltip="We require consent to perform a criminal background check as part of our screening process">
                              Do you provide consent to perform a criminal background check?
                            </RequiredLabel>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Work History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Work History</CardTitle>
                  <CardDescription>Information about your most recent employment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lastCompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastCompanyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Manufacturing, Retail, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="lastJobResponsibilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Responsibilities</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your main job responsibilities..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lastJobAgencyOrDirect"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency or Direct Hire</FormLabel>
                          <FormControl>
                            <Input placeholder="Agency name or 'Direct hire'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reasonForLeaving"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Leaving</FormLabel>
                          <FormControl>
                            <Input placeholder="Contract ended, career change, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Job Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Job Preferences</CardTitle>
                  <CardDescription>Your work preferences and capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="liftingCapability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>Lifting Capability</RequiredLabel>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lifting capability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5-10 kgs">5-10 kgs</SelectItem>
                            <SelectItem value="15-20 kgs">15-20 kgs</SelectItem>
                            <SelectItem value="25-30 kgs">25-30 kgs</SelectItem>
                            <SelectItem value="35-40 kgs">35-40 kgs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>You're looking for a:</RequiredLabel>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Short-term job">Short-term job</SelectItem>
                              <SelectItem value="Long-term job">Long-term job</SelectItem>
                              <SelectItem value="On-call shifts only">On-call shifts only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="commitmentMonths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Commitment Period (months)</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="60" 
                              placeholder="6"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-navy">Available Days for Different Shifts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="morningAvailability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Morning Shift</FormLabel>
                            <FormControl>
                              <Input placeholder="Mon-Fri, Sat-Sun, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="afternoonAvailability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Afternoon Shift</FormLabel>
                            <FormControl>
                              <Input placeholder="Mon-Fri, Sat-Sun, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nightAvailability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Night Shift</FormLabel>
                            <FormControl>
                              <Input placeholder="Mon-Fri, Sat-Sun, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How They Found Us */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">How Did You Find Us?</CardTitle>
                  <CardDescription>Help us understand how you learned about our agency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Through a Person</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="referralPersonName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="referralPersonNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="647-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="referralPersonRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Friend, Colleague, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Through Internet (check all that apply)</h4>
                    <FormField
                      control={form.control}
                      name="foundViaInternet"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {INTERNET_SOURCES.map((source) => (
                              <FormField
                                key={source}
                                control={form.control}
                                name="foundViaInternet"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={source}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(source)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), source])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== source
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {source}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Agreement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Terms and Agreement</CardTitle>
                  <CardDescription>Please read and agree to our terms of employment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <h4 className="font-semibold mb-2">Terms and Conditions for Employment:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Don't walk off the job. If you are not satisfied or if any issue arises, complete your full shift and call us the next day during office hours before your next shift. Walking off the floor will result in being BLACKLISTED.</li>
                      <li>• In case of an accident, you MUST call our office number 647-946-2177. If your call doesn't connect, please call our emergency cell number 647-518-2885 immediately.</li>
                    </ul>
                  </div>

                  <FormField
                    control={form.control}
                    name="agreesToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <RequiredLabel>
                              I have filled this employment form myself and all information is correct and up to date. I understand that any misrepresentation may disqualify me from employment. I agree to abide by all listed terms and conditions of employment with Talencor Staffing.
                            </RequiredLabel>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicantSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel tooltip="Type your full name as your digital signature">
                            Applicant's Digital Signature
                          </RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Type your full name" {...field} />
                        </FormControl>
                        <FormDescription>
                          By typing your name, you are providing your digital signature for this application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-energetic-orange hover:bg-energetic-orange/90 px-12"
                  disabled={submitApplication.isPending}
                >
                  {submitApplication.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}