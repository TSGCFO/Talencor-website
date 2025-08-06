// <AdminLoginPageSnippet>
// This page is where admins enter their username and password
// Think of it like a security checkpoint for the admin area

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// <AdminLoginComponentSnippet>
export default function AdminLogin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // <FormStateSnippet>
  // These variables store what the user types and what's happening
  const [username, setUsername] = useState("");       // What they type in the username box
  const [password, setPassword] = useState("");       // What they type in the password box
  const [isLoading, setIsLoading] = useState(false); // Are we checking their login?
  const [error, setError] = useState("");            // Any error messages to show
  // </FormStateSnippet>

  // <HandleLoginSnippet>
  // This function runs when they click the login button
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing
    setError("");       // Clear any old error messages
    setIsLoading(true); // Show loading spinner

    try {
      // <SendLoginRequestSnippet>
      // Send the username and password to the server
      // Like showing your ID to the security guard
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include" // Include cookies for the session
      });
      // </SendLoginRequestSnippet>

      const data = await response.json();

      // <CheckResponseSnippet>
      // Check if the login was successful
      if (response.ok && data.success) {
        // Success! Show a welcome message
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to the admin panel.",
        });
        
        // Small delay to ensure session is established before redirect
        setTimeout(() => {
          // Take them to the admin dashboard
          setLocation("/admin/client-management");
        }, 100);
      } else {
        // Login failed - show the error message
        setError(data.message || "Login failed. Please try again.");
      }
      // </CheckResponseSnippet>
    } catch (err) {
      // Something went wrong with the connection
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false); // Stop showing the loading spinner
    }
  };
  // </HandleLoginSnippet>

  // <LoginFormUISnippet>
  // This is what the user sees - the login form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-[#F39200]" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Show error message if there is one */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Username input box */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Password input box */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Login button */}
            <Button
              type="submit"
              className="w-full bg-[#F39200] hover:bg-[#E08100]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
          
          {/* Link back to main site */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <a href="/" className="hover:text-[#F39200] transition-colors">
              ← Back to main site
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  // </LoginFormUISnippet>
}
// </AdminLoginComponentSnippet>
// </AdminLoginPageSnippet>