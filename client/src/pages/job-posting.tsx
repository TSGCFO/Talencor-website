import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertJobPostingSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "wouter";

// Extend the schema to add validation rules
const jobPostingFormSchema = insertJobPostingSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  jobDescription: z.string().optional(),
  salaryRange: z.string().optional(),
  specialRequirements: z.string().optional(),
  anticipatedStartDate: z.date().optional(),
});

type JobPostingFormData = z.infer<typeof jobPostingFormSchema>;

export default function JobPosting() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingFormSchema),
    defaultValues: {
      contactName: "",
      companyName: "",
      email: "",
      phone: "",
      jobTitle: "",
      location: "",
      employmentType: "permanent",
      isExistingClient: false,
      jobDescription: "",
      salaryRange: "",
      specialRequirements: "",
    },
  });

  const verifyAccessCode = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Please enter an access code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiRequest("POST", "/api/verify-client", { accessCode });
      
      if (response.success && response.client) {
        // Auto-populate form fields with client data
        form.setValue("companyName", response.client.companyName);
        form.setValue("contactName", response.client.contactName);
        form.setValue("email", response.client.email);
        form.setValue("phone", response.client.phone || "");
        form.setValue("isExistingClient", true);
        
        toast({
          title: "Client verified!",
          description: "Your information has been auto-filled.",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid access code",
        description: "Please check your access code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: JobPostingFormData) => {
      const formattedData = {
        ...data,
        anticipatedStartDate: data.anticipatedStartDate 
          ? format(data.anticipatedStartDate, "yyyy-MM-dd")
          : null,
        accessCode: accessCode.trim() || undefined, // Include access code if provided
      };
      return apiRequest("POST", "/api/job-postings", formattedData);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Job posting submitted successfully!",
        description: "Our recruiting team will contact you within one business day.",
      });
    },
    onError: () => {
      toast({
        title: "Error submitting job posting",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobPostingFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your job posting has been successfully submitted. Our recruiting team will contact you within one business day to discuss next steps.
              </p>
              {!form.getValues("isExistingClient") && (
                <div className="bg-orange-50 rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-lg mb-2">What happens next?</h2>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li>• A recruiter will review your submission</li>
                    <li>• We'll discuss pricing and contract terms</li>
                    <li>• Once agreed, we'll publish your job and start recruiting</li>
                    <li>• You'll receive regular updates on candidate progress</li>
                  </ul>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    Back to Home
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                    setAccessCode("");
                  }}
                >
                  Post Another Job
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Link href="/employers" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Employers
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-4">Post a Job Opening</h1>
            <p className="text-lg text-gray-600 mb-4">
              Fill out the form below to submit your job opening. Our recruiting team will contact you within one business day to discuss your staffing needs.
            </p>
            
            {/* How it works section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h2 className="font-semibold text-navy mb-2">How it works:</h2>
              <ul className="text-charcoal space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-talencor-gold mr-2">✓</span>
                  <span>Posting a job is <strong>free</strong> - simply fill out the form below</span>
                </li>
                <li className="flex items-start">
                  <span className="text-talencor-gold mr-2">✓</span>
                  <span>A recruiter will contact you within <strong>one business day</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-talencor-gold mr-2">✓</span>
                  <span>For new clients, we'll discuss pricing and contract terms before posting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-talencor-gold mr-2">✓</span>
                  <span>Existing clients' jobs are prioritized for immediate processing</span>
                </li>
              </ul>
            </div>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                onKeyDown={(e) => {
                  // Prevent form submission on Enter key in input fields
                  if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                    e.preventDefault();
                  }
                }}
                className="space-y-8">
                {/* Existing Client Access Code Section */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Existing Client?</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    If you're an existing client, enter your access code to expedite your job posting.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter your access code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={verifyAccessCode}
                      disabled={isVerifying || form.getValues("isExistingClient")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : form.getValues("isExistingClient") ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verified
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                  </div>
                  {form.getValues("isExistingClient") && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Client verified - Your information has been auto-filled
                    </p>
                  )}
                </div>

                {/* Contact Information Section */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Job Details Section */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Warehouse Associate" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Toronto, ON" {...field} />
                          </FormControl>
                          <FormDescription>
                            City and province, or "Remote"
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="permanent">Permanent</SelectItem>
                              <SelectItem value="temporary">Temporary</SelectItem>
                              <SelectItem value="contract-to-hire">Contract-to-Hire</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="anticipatedStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Anticipated Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary or Pay Range</FormLabel>
                          <FormControl>
                            <Input placeholder="$20-25/hour" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional - helps with candidate targeting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief summary of responsibilities and qualifications..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requirements or Comments</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information we should know..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Client Status */}
                <div>
                  <FormField
                    control={form.control}
                    name="isExistingClient"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Are you an existing Talencor client?
                          </FormLabel>
                          <FormDescription>
                            This helps us process your request faster
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Additional info based on client status */}
                  {form.watch("isExistingClient") ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm mt-4">
                      <p className="text-green-800">
                        <strong>Great!</strong> As an existing client, your job will be prioritized for immediate processing.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mt-4">
                      <p className="text-blue-800">
                        <strong>Welcome!</strong> After submission, a recruiter will contact you to discuss our services and finalize contract terms before posting your job.
                      </p>
                    </div>
                  )}
                </div>

                {/* Honeypot field for spam prevention - hidden from users */}
                <input 
                  type="text" 
                  name="website" 
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    // If this field is filled, it's likely a bot
                    if (e.target.value) {
                      form.setError('root', { message: 'Invalid submission' });
                    }
                  }}
                />

                {/* Privacy Notice */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>
                    By submitting this form, you agree that Talencor Staffing may contact you about your hiring needs. 
                    Your information will only be used to process your job posting request and will be handled in accordance 
                    with our <Link href="/privacy-policy" className="text-talencor-gold hover:text-talencor-orange underline">privacy policy</Link>.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitMutation.isPending}
                    className="min-w-[200px]"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Send Job Request"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}