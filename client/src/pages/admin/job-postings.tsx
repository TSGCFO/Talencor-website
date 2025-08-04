import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, Search, Mail, Phone, Building, MapPin, Calendar, DollarSign, LogOut, User } from "lucide-react";
import type { JobPosting } from "@/../../shared/schema";

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { value: "contract_pending", label: "Contract Pending", color: "bg-orange-100 text-orange-800" },
  { value: "posted", label: "Posted", color: "bg-green-100 text-green-800" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" },
];

export default function AdminJobPostings() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null);
  const [adminUser, setAdminUser] = useState<{ id: number; username: string } | null>(null);

  // <AuthenticationCheckSnippet>
  // Check if the admin is logged in when the page loads
  // Like checking if someone has a VIP wristband before letting them into the VIP area
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.isAuthenticated) {
          // Not logged in - redirect to login page
          setLocation('/admin/login');
        } else {
          // They're logged in - save their info
          setAdminUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLocation('/admin/login');
      }
    };
    
    checkAuth();
  }, [setLocation]);
  // </AuthenticationCheckSnippet>

  // <LogoutFunctionSnippet>
  // This function logs the admin out
  // Like taking their VIP wristband when they leave
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of the admin panel.",
        });
        setLocation('/admin/login');
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  // </LogoutFunctionSnippet>

  const { data: jobPostings, isLoading } = useQuery({
    queryKey: ['/api/job-postings', statusFilter],
    queryFn: async () => {
      const url = statusFilter === "all" 
        ? '/api/job-postings'
        : `/api/job-postings?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch job postings');
      return response.json() as Promise<JobPosting[]>;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/job-postings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-postings'] });
      toast({
        title: "Status updated successfully",
        description: "The job posting status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating status",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPostings = jobPostings?.filter(posting => {
    const searchLower = searchTerm.toLowerCase();
    return (
      posting.companyName.toLowerCase().includes(searchLower) ||
      posting.jobTitle.toLowerCase().includes(searchLower) ||
      posting.contactName.toLowerCase().includes(searchLower) ||
      posting.location.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? (
      <Badge className={`${statusOption.color} border-0`}>
        {statusOption.label}
      </Badge>
    ) : null;
  };

  return (
    <>
      <Helmet>
        <title>Admin - Job Postings | Talencor Staffing</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Header with User Info and Logout */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Postings Management</h1>
                <p className="mt-2 text-gray-600">Review and manage job posting submissions</p>
              </div>
              
              {/* Admin User Info and Logout Button */}
              {adminUser && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={20} />
                    <span className="font-medium">{adminUser.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search companies, jobs, contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Total: {filteredPostings?.length || 0} postings
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredPostings && filteredPostings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPostings.map((posting) => (
                      <TableRow key={posting.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building size={16} className="text-gray-400" />
                            {posting.companyName}
                          </div>
                        </TableCell>
                        <TableCell>{posting.jobTitle}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{posting.contactName}</div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail size={12} />
                                {posting.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={12} />
                                {posting.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={14} className="text-gray-400" />
                            {posting.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize">{posting.employmentType.replace('-', ' ')}</span>
                        </TableCell>
                        <TableCell>
                          {posting.isExistingClient ? (
                            <Badge className="bg-green-100 text-green-800 border-0">Existing</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800 border-0">New</Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(posting.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {format(new Date(posting.createdAt), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPosting(posting)}
                            >
                              View
                            </Button>
                            <Select
                              value={posting.status}
                              onValueChange={(value) => 
                                updateStatusMutation.mutate({ id: posting.id, status: value })
                              }
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No job postings found</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedPosting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Job Posting Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Company:</span>
                        <p className="font-medium">{selectedPosting.companyName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Contact:</span>
                        <p className="font-medium">{selectedPosting.contactName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">{selectedPosting.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedPosting.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Job Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Job Title:</span>
                        <p className="font-medium">{selectedPosting.jobTitle}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Location:</span>
                        <p className="font-medium">{selectedPosting.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Employment Type:</span>
                        <p className="font-medium capitalize">{selectedPosting.employmentType.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Client Status:</span>
                        <p className="font-medium">{selectedPosting.isExistingClient ? 'Existing Client' : 'New Client'}</p>
                      </div>
                      {selectedPosting.anticipatedStartDate && (
                        <div>
                          <span className="text-sm text-gray-500">Start Date:</span>
                          <p className="font-medium">{format(new Date(selectedPosting.anticipatedStartDate), 'MMM d, yyyy')}</p>
                        </div>
                      )}
                      {selectedPosting.salaryRange && (
                        <div>
                          <span className="text-sm text-gray-500">Salary Range:</span>
                          <p className="font-medium">{selectedPosting.salaryRange}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPosting.jobDescription && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Job Description</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedPosting.jobDescription}</p>
                    </div>
                  )}

                  {selectedPosting.specialRequirements && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Special Requirements</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedPosting.specialRequirements}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Status Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Current Status:</span>
                        <div className="mt-1">{getStatusBadge(selectedPosting.status)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Submitted:</span>
                        <p className="font-medium">{format(new Date(selectedPosting.createdAt), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelectedPosting(null)}>
                    Close
                  </Button>
                  <Button onClick={() => window.open(`mailto:${selectedPosting.email}`)}>
                    <Mail className="mr-2" size={16} />
                    Email Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}