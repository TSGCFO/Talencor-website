import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock, Linkedin, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { COMPANY_INFO, INQUIRY_TYPES } from "@/lib/constants";

const contactFormSchema = insertContactSubmissionSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      inquiryType: "",
      message: "",
    },
  });

  const submitContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContact.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Contact Talencor Staffing | Get in Touch for Staffing Solutions</title>
        <meta 
          name="description" 
          content="Contact Talencor Staffing for professional employment solutions. Located in Mississauga, ON. Call (905) 555-0123 or email info@talencor.com for staffing needs." 
        />
        <meta property="og:title" content="Contact Talencor Staffing | Professional Employment Solutions" />
        <meta property="og:description" content="Get in touch with Talencor for all your staffing needs in Mississauga, ON." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-light-grey to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-charcoal mb-6">Get in Touch</h1>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Ready to take the next step? Contact our team today to discuss your staffing needs or career goals
            </p>
          </div>
          
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Contact Information */}
            <div className="mb-12 lg:mb-0">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-montserrat text-charcoal mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-montserrat text-charcoal mb-1">Address</h4>
                        <p className="text-charcoal">
                          {COMPANY_INFO.address.street}<br/>
                          {COMPANY_INFO.address.city}, {COMPANY_INFO.address.province} {COMPANY_INFO.address.postal}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                        <Phone size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-montserrat text-charcoal mb-1">Phone</h4>
                        <p className="text-charcoal">{COMPANY_INFO.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                        <Mail size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-montserrat text-charcoal mb-1">Email</h4>
                        <p className="text-charcoal">{COMPANY_INFO.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                        <Clock size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-montserrat text-charcoal mb-1">Hours</h4>
                        <p className="text-charcoal">
                          {COMPANY_INFO.hours.weekdays}<br/>
                          {COMPANY_INFO.hours.saturday}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="font-semibold font-montserrat text-charcoal mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a 
                        href={COMPANY_INFO.socialMedia.linkedin}
                        className="w-10 h-10 bg-talencor-gold hover:bg-talencor-orange rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Linkedin size={16} />
                      </a>
                      <a 
                        href={COMPANY_INFO.socialMedia.twitter}
                        className="w-10 h-10 bg-talencor-gold hover:bg-talencor-orange rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Twitter size={16} />
                      </a>
                      <a 
                        href={COMPANY_INFO.socialMedia.facebook}
                        className="w-10 h-10 bg-talencor-gold hover:bg-talencor-orange rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Facebook size={16} />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-montserrat text-charcoal mb-6">Send us a Message</h2>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-2">Thank You!</h3>
                      <p className="text-charcoal">Your message has been sent successfully. We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium font-montserrat text-charcoal">First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="px-4 py-3" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium font-montserrat text-charcoal">Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="px-4 py-3" />
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
                              <FormLabel className="text-sm font-medium font-montserrat text-charcoal">Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} className="px-4 py-3" />
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
                              <FormLabel className="text-sm font-medium font-montserrat text-charcoal">Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} className="px-4 py-3" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="inquiryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium font-montserrat text-charcoal">Inquiry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="px-4 py-3">
                                    <SelectValue placeholder="Select inquiry type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {INQUIRY_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium font-montserrat text-charcoal">Message</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} className="px-4 py-3" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-energetic-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold font-montserrat"
                          disabled={submitContact.isPending}
                        >
                          {submitContact.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
