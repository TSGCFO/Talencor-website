// <ClientLoginPageSnippet>
// This page lets clients log in with their special access code
// Think of it like entering a VIP code to see your special orders

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { Key, Loader2 } from "lucide-react";

// <FormDataTypeSnippet>
// This describes what information we need from the client
// Just one thing: their access code
type ClientLoginForm = {
  accessCode: string;
};
// </FormDataTypeSnippet>

export default function ClientLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // <FormSetupSnippet>
  // Set up the form - like preparing a questionnaire
  const form = useForm<ClientLoginForm>({
    defaultValues: {
      accessCode: ""
    }
  });
  // </FormSetupSnippet>

  // <LoginFunctionSnippet>
  // This handles what happens when they click the login button
  // It's like checking if their VIP code is valid
  const loginMutation = useMutation({
    mutationFn: async (data: ClientLoginForm) => {
      const response = await apiRequest("POST", "/api/client/login", data);
      return response;
    },
    onSuccess: () => {
      // They're in! Send them to their dashboard
      toast({
        title: "Welcome!",
        description: "Successfully logged in to your client portal."
      });
      navigate("/client/dashboard");
    },
    onError: (error: Error) => {
      // Something went wrong - show them an error message
      setError(error.message || "Invalid access code. Please try again.");
    }
  });
  // </LoginFunctionSnippet>

  // <SubmitHandlerSnippet>
  // This runs when they submit the form
  const onSubmit = (data: ClientLoginForm) => {
    setError(null); // Clear any old errors
    loginMutation.mutate(data);
  };
  // </SubmitHandlerSnippet>

  return (
    <>
      {/* Page Title for Browser Tab */}
      <Helmet>
        <title>Client Portal Login | Talencor Staffing</title>
      </Helmet>

      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/talencor-logo-new.png" 
              alt="Talencor Staffing" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Enter Your Access Code</CardTitle>
              <CardDescription>
                Use the access code provided by Talencor to view your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Access Code Field */}
                  <FormField
                    control={form.control}
                    name="accessCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter your access code"
                              className="pl-10"
                              disabled={loginMutation.isPending}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Access Portal"
                    )}
                  </Button>

                  {/* Help Text */}
                  <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an access code?{" "}
                    <a 
                      href="/request-access" 
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Request Access
                    </a>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>For assistance, please contact your Talencor representative</p>
          </div>
        </div>
      </div>
    </>
  );
}
// </ClientLoginPageSnippet>