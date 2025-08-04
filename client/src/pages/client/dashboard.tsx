// <ClientDashboardPageSnippet>
// This is the client's dashboard where they can manage all their job postings
// Think of it like their personal control center for all their job listings

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Edit, 
  Trash2, 
  LogOut, 
  Loader2,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  Plus
} from "lucide-react";
import type { JobPosting } from "@shared/schema";

// <StatusBadgeSnippet>
// This shows the status of each job posting with colors
// Like traffic lights - green for active, yellow for pending, etc.
const getStatusBadge = (status: string) => {
  const statusConfig = {
    new: { label: "New", className: "bg-blue-100 text-blue-800" },
    contacted: { label: "Contacted", className: "bg-yellow-100 text-yellow-800" },
    contract_pending: { label: "Contract Pending", className: "bg-orange-100 text-orange-800" },
    posted: { label: "Posted", className: "bg-green-100 text-green-800" },
    closed: { label: "Closed", className: "bg-gray-100 text-gray-800" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return <Badge className={config.className}>{config.label}</Badge>;
};
// </StatusBadgeSnippet>

export default function ClientDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);

  // <CheckAuthSnippet>
  // First, check if the client is logged in
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/client/auth"],
    retry: false
  });
  // </CheckAuthSnippet>

  // <FetchJobPostingsSnippet>
  // Get all job postings for this client
  const { data: jobPostings, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/client/job-postings"],
    enabled: !!authData?.isAuthenticated,
    retry: false
  });
  // </FetchJobPostingsSnippet>

  // <LogoutFunctionSnippet>
  // Handle logging out
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/client/logout", { method: "POST" });
    },
    onSuccess: () => {
      navigate("/client/login");
    }
  });
  // </LogoutFunctionSnippet>

  // <UpdateJobFunctionSnippet>
  // Handle updating a job posting
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<JobPosting> }) => {
      await apiRequest(`/api/client/job-postings/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.updates)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client/job-postings"] });
      toast({
        title: "Success!",
        description: "Job posting updated successfully."
      });
      setEditingJob(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job posting.",
        variant: "destructive"
      });
    }
  });
  // </UpdateJobFunctionSnippet>

  // <DeleteJobFunctionSnippet>
  // Handle deleting a job posting
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/client/job-postings/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client/job-postings"] });
      toast({
        title: "Success!",
        description: "Job posting deleted successfully."
      });
      setDeletingJob(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job posting.",
        variant: "destructive"
      });
    }
  });
  // </DeleteJobFunctionSnippet>

  // Redirect if not authenticated
  if (!authLoading && !authData?.isAuthenticated) {
    navigate("/client/login");
    return null;
  }

  // Show loading state
  if (authLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Client Dashboard | Talencor Staffing</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome, {authData?.client?.companyName}</p>
              </div>
              
              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>

          {/* Job Postings */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Job Postings</h2>
              <Badge variant="secondary">
                {jobPostings?.jobPostings?.length || 0} Total Postings
              </Badge>
            </div>

            {jobPostings?.jobPostings?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No job postings yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Contact Talencor to post your first job opening.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jobPostings?.jobPostings?.map((job: JobPosting) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Building2 size={14} />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {job.employmentType}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Job Description */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Description</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">{job.jobDescription}</p>
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Positions:</span>
                            <span className="ml-2 font-medium">{job.numberOfPositions}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Urgency:</span>
                            <span className="ml-2 font-medium capitalize">{job.urgency}</span>
                          </div>
                          {job.salaryRange && (
                            <div className="col-span-2">
                              <span className="text-gray-500">Salary:</span>
                              <span className="ml-2 font-medium">{job.salaryRange}</span>
                            </div>
                          )}
                        </div>

                        {/* Timestamps */}
                        <div className="text-xs text-gray-500">
                          Posted: {new Date(job.createdAt).toLocaleDateString()}
                          {job.updatedAt && job.updatedAt !== job.createdAt && (
                            <span className="ml-4">
                              Updated: {new Date(job.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingJob(job)}
                            disabled={job.status === 'closed'}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeletingJob(job)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingJob && (
        <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job Posting</DialogTitle>
              <DialogDescription>
                Update the details of your job posting below.
              </DialogDescription>
            </DialogHeader>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  jobTitle: formData.get('jobTitle') as string,
                  department: formData.get('department') as string,
                  location: formData.get('location') as string,
                  employmentType: formData.get('employmentType') as string,
                  jobDescription: formData.get('jobDescription') as string,
                  requiredQualifications: formData.get('requiredQualifications') as string,
                  preferredQualifications: formData.get('preferredQualifications') as string,
                  salaryRange: formData.get('salaryRange') as string,
                  numberOfPositions: parseInt(formData.get('numberOfPositions') as string),
                  urgency: formData.get('urgency') as string,
                  specialInstructions: formData.get('specialInstructions') as string
                };
                updateMutation.mutate({ id: editingJob.id, updates });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    defaultValue={editingJob.jobTitle}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    defaultValue={editingJob.department}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingJob.location}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select name="employmentType" defaultValue={editingJob.employmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="contract-to-hire">Contract-to-Hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numberOfPositions">Number of Positions</Label>
                  <Input
                    id="numberOfPositions"
                    name="numberOfPositions"
                    type="number"
                    min="1"
                    defaultValue={editingJob.numberOfPositions}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select name="urgency" defaultValue={editingJob.urgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="salaryRange">Salary Range (Optional)</Label>
                  <Input
                    id="salaryRange"
                    name="salaryRange"
                    defaultValue={editingJob.salaryRange || ''}
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={4}
                  defaultValue={editingJob.jobDescription}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requiredQualifications">Required Qualifications</Label>
                <Textarea
                  id="requiredQualifications"
                  name="requiredQualifications"
                  rows={3}
                  defaultValue={editingJob.requiredQualifications}
                  required
                />
              </div>

              <div>
                <Label htmlFor="preferredQualifications">Preferred Qualifications (Optional)</Label>
                <Textarea
                  id="preferredQualifications"
                  name="preferredQualifications"
                  rows={3}
                  defaultValue={editingJob.preferredQualifications || ''}
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={2}
                  defaultValue={editingJob.specialInstructions || ''}
                  placeholder="Any special notes for Talencor"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingJob(null)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingJob && (
        <Dialog open={!!deletingJob} onOpenChange={() => setDeletingJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Job Posting</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this job posting? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{deletingJob.jobTitle}</strong> at {deletingJob.location}
                </AlertDescription>
              </Alert>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeletingJob(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(deletingJob.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
// </ClientDashboardPageSnippet>