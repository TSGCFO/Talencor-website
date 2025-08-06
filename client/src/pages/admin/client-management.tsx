// <AdminClientManagementPageSnippet>
// This page lets admins manage all clients and their access codes
// Like a control center for managing VIP memberships

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from "react-helmet-async";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Plus,
  Activity,
  Calendar,
  Shield,
  Copy,
  LogOut,
  User
} from 'lucide-react';
import { format } from 'date-fns';

// <ClientDetailsDialogSnippet>
// Modal that shows detailed information about a specific client
function ClientDetailsDialog({ client, isOpen, onClose }: any) {
  const { data: details } = useQuery({
    queryKey: ['/api/admin/clients', client?.id],
    enabled: !!client?.id && isOpen
  });

  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Details: {details.client.companyName}</DialogTitle>
          <DialogDescription>
            Access Code: <span className="font-mono font-bold">{details.client.accessCode}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Name</Label>
              <p className="text-sm text-gray-600">{details.client.contactName}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm text-gray-600">{details.client.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-sm text-gray-600">{details.client.phone || 'N/A'}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge variant={details.client.isActive ? 'default' : 'secondary'}>
                {details.client.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <Label>Login Count</Label>
              <p className="text-sm text-gray-600">{details.client.loginCount || 0}</p>
            </div>
            <div>
              <Label>Last Login</Label>
              <p className="text-sm text-gray-600">
                {details.client.lastLoginAt 
                  ? format(new Date(details.client.lastLoginAt), 'PPp')
                  : 'Never'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {details.activities?.length > 0 ? (
                details.activities.map((activity: any) => (
                  <div key={activity.id} className="border rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <Badge variant="outline">{activity.activityType}</Badge>
                      <span className="text-gray-500">
                        {format(new Date(activity.createdAt), 'PPp')}
                      </span>
                    </div>
                    {activity.details && (
                      <p className="text-xs text-gray-600 mt-1">
                        IP: {activity.ipAddress}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No activity recorded</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// </ClientDetailsDialogSnippet>

export default function ClientManagement() {
  const [location, setLocation] = useLocation();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBulkGenerate, setShowBulkGenerate] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [bulkClientData, setBulkClientData] = useState('');
  const [adminUser, setAdminUser] = useState<{ id: number; username: string } | null>(null);
  const { toast } = useToast();
  
  // <NewClientFormStateSnippet>
  // These store the new client information being entered
  const [newClientData, setNewClientData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: ''
  });
  // </NewClientFormStateSnippet>

  // <AuthenticationCheckSnippet>
  // Check if the admin is logged in when the page loads
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

  // Fetch all clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/admin/clients']
  });

  // Fetch code requests
  const { data: codeRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/admin/code-requests']
  });

  // Mutation for approving code requests
  const approveMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch(`/api/admin/code-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to approve request');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/code-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      
      // Copy access code to clipboard
      navigator.clipboard.writeText(data.accessCode);
      
      toast({
        title: "Request Approved!",
        description: `Access code ${data.accessCode} has been copied to clipboard`,
      });
    }
  });

  // Mutation for rejecting code requests
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await fetch(`/api/admin/code-requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/code-requests'] });
      toast({
        title: "Request Rejected",
        description: "The code request has been rejected",
      });
    }
  });

  // Mutation for deactivating clients
  const deactivateMutation = useMutation({
    mutationFn: async (clientId: number) => {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to deactivate client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      toast({
        title: "Client Deactivated",
        description: "The client has been deactivated successfully",
      });
    }
  });

  // Mutation for creating a single client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const response = await fetch('/api/admin/clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Failed to create client');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      setShowCreateClient(false);
      setNewClientData({
        companyName: '',
        contactName: '',
        email: '',
        phone: ''
      });
      
      // Copy access code to clipboard
      navigator.clipboard.writeText(data.accessCode);
      
      toast({
        title: "Client Created Successfully!",
        description: `Access code ${data.accessCode} has been copied to clipboard`,
      });
    }
  });

  // Mutation for bulk generating codes
  const bulkGenerateMutation = useMutation({
    mutationFn: async (clients: any[]) => {
      const response = await fetch('/api/admin/clients/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients })
      });
      if (!response.ok) throw new Error('Failed to generate codes');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      setShowBulkGenerate(false);
      setBulkClientData('');
      
      // Format codes for display
      const codes = data.clients.map((c: any) => 
        `${c.companyName}: ${c.accessCode}`
      ).join('\n');
      
      toast({
        title: "Codes Generated!",
        description: `Generated ${data.clients.length} access codes`,
      });
    }
  });

  const handleBulkGenerate = () => {
    try {
      // Parse the CSV-like input
      const lines = bulkClientData.trim().split('\n');
      const clients = lines.map(line => {
        const [companyName, contactName, email, phone] = line.split(',').map(s => s.trim());
        return { companyName, contactName, email, phone: phone || null };
      });
      
      bulkGenerateMutation.mutate(clients);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid data format. Use: CompanyName, ContactName, Email, Phone",
        variant: "destructive"
      });
    }
  };

  const pendingRequests = codeRequests.filter((r: any) => r.status === 'pending');
  const activeClients = clients.filter((c: any) => c.isActive);

  return (
    <>
      <Helmet>
        <title>Admin - Client Management | Talencor Staffing</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Navigation Tabs */}
          <div className="mb-6 border-b">
            <nav className="-mb-px flex space-x-8">
              <a
                href="/admin/job-postings"
                className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Job Postings
              </a>
              <a
                href="/admin/client-management"
                className="border-b-2 border-[#F97316] py-2 px-1 text-sm font-medium text-[#F97316]"
              >
                Client Management
              </a>
            </nav>
          </div>
          
          {/* Admin Header with User Info and Logout */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
                <p className="text-gray-600 mt-2">Manage client access codes and requests</p>
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

          <div className="space-y-6">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.reduce((sum: number, c: any) => sum + (c.loginCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Codes</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter((c: any) => 
                c.codeExpiresAt && new Date(c.codeExpiresAt) < new Date()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="clients">Active Clients</TabsTrigger>
            <TabsTrigger value="requests">
              Code Requests 
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateClient(true)}
              className="bg-[#F97316] hover:bg-[#EA580C]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Client
            </Button>
            <Button 
              onClick={() => setShowBulkGenerate(true)}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Bulk Generate
            </Button>
          </div>
        </div>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Active Clients</CardTitle>
              <CardDescription>
                Manage client access codes and monitor activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="text-center py-8">Loading clients...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Company</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Access Code</th>
                        <th className="text-left p-2">Logins</th>
                        <th className="text-left p-2">Last Login</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeClients.map((client: any) => (
                        <tr key={client.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="font-medium">{client.companyName}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </td>
                          <td className="p-2">{client.contactName}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {client.accessCode}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(client.accessCode);
                                  toast({ title: "Copied!", description: "Access code copied to clipboard" });
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-2">{client.loginCount || 0}</td>
                          <td className="p-2">
                            {client.lastLoginAt 
                              ? format(new Date(client.lastLoginAt), 'PP')
                              : 'Never'}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowDetails(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deactivateMutation.mutate(client.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Code Requests</CardTitle>
              <CardDescription>
                Review and approve client access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="text-center py-8">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending requests
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{request.companyName}</h3>
                          <p className="text-sm text-gray-600">
                            Contact: {request.contactName} ({request.email})
                          </p>
                          {request.phone && (
                            <p className="text-sm text-gray-600">Phone: {request.phone}</p>
                          )}
                          {request.reason && (
                            <p className="text-sm text-gray-600 mt-2">
                              Reason: {request.reason}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Submitted: {format(new Date(request.createdAt), 'PPp')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate(request.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) {
                                rejectMutation.mutate({ id: request.id, reason });
                              }
                            }}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create New Client Dialog */}
      <Dialog open={showCreateClient} onOpenChange={setShowCreateClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
            <DialogDescription>
              Enter client details to generate an access code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={newClientData.companyName}
                onChange={(e) => setNewClientData({...newClientData, companyName: e.target.value})}
                placeholder="ABC Corporation"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={newClientData.contactName}
                onChange={(e) => setNewClientData({...newClientData, contactName: e.target.value})}
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={newClientData.email}
                onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={newClientData.phone}
                onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})}
                placeholder="555-0123"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateClient(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createClientMutation.mutate(newClientData)}
              disabled={!newClientData.companyName || !newClientData.contactName || !newClientData.email || createClientMutation.isPending}
              className="bg-[#F97316] hover:bg-[#EA580C]"
            >
              Create Client & Generate Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Generate Dialog */}
      <Dialog open={showBulkGenerate} onOpenChange={setShowBulkGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Generate Access Codes</DialogTitle>
            <DialogDescription>
              Enter client details (one per line): CompanyName, ContactName, Email, Phone
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Acme Corp, John Smith, john@acme.com, 555-0123
Tech Solutions, Jane Doe, jane@tech.com, 555-0456"
              value={bulkClientData}
              onChange={(e) => setBulkClientData(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkGenerate(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkGenerate}
              disabled={!bulkClientData.trim() || bulkGenerateMutation.isPending}
            >
              Generate Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <ClientDetailsDialog
        client={selectedClient}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
          </div>
        </div>
      </div>
    </>
  );
}
// </AdminClientManagementPageSnippet>