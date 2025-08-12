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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from "react-helmet-async";
import { AdminHeader } from '@/components/AdminHeader';
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
  User,
  Edit,
  RotateCcw,
  Search,
  X
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// <ClientDetailsDialogSnippet>
// Modal that shows detailed information about a specific client
function ClientDetailsDialog({ client, isOpen, onClose }: any) {
  const { data: details, isLoading, error } = useQuery({
    queryKey: [`/api/admin/clients/${client?.id}`],
    enabled: !!client?.id && isOpen
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Loading Client Details</DialogTitle>
            <DialogDescription>
              Unable to load client information. Please try again later.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-red-600 mt-2">
            {(error as any)?.message || 'An unexpected error occurred'}
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
  const [showEditClient, setShowEditClient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkClientData, setBulkClientData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [clientToEdit, setClientToEdit] = useState<any>(null);
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
      setShowDeleteConfirm(false);
      setClientToDelete(null);
      toast({
        title: "Client Deactivated",
        description: "The client has been deactivated successfully",
      });
    }
  });

  // Mutation for reactivating clients
  const reactivateMutation = useMutation({
    mutationFn: async (clientId: number) => {
      const response = await fetch(`/api/admin/clients/${clientId}/reactivate`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to reactivate client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      toast({
        title: "Client Reactivated",
        description: "The client has been reactivated successfully",
      });
    }
  });

  // Mutation for updating client details
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update client');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clients'] });
      setShowEditClient(false);
      setClientToEdit(null);
      toast({
        title: "Client Updated",
        description: "Client details have been updated successfully",
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
      
      // Show confirmation before bulk operation
      setShowBulkConfirm(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid data format. Use: CompanyName, ContactName, Email, Phone",
        variant: "destructive"
      });
    }
  };

  const confirmBulkGenerate = () => {
    const lines = bulkClientData.trim().split('\n');
    const clients = lines.map(line => {
      const [companyName, contactName, email, phone] = line.split(',').map(s => s.trim());
      return { companyName, contactName, email, phone: phone || null };
    });
    bulkGenerateMutation.mutate(clients);
    setShowBulkConfirm(false);
  };

  const pendingRequests = codeRequests.filter((r: any) => r.status === 'pending');
  const activeClients = clients.filter((c: any) => c.isActive);
  const inactiveClients = clients.filter((c: any) => !c.isActive);
  
  // Filter clients based on search term
  const filteredActiveClients = activeClients.filter((client: any) => {
    const search = searchTerm.toLowerCase();
    return client.companyName.toLowerCase().includes(search) ||
           client.contactName.toLowerCase().includes(search) ||
           client.email.toLowerCase().includes(search) ||
           (client.phone && client.phone.toLowerCase().includes(search));
  });
  
  const filteredInactiveClients = inactiveClients.filter((client: any) => {
    const search = searchTerm.toLowerCase();
    return client.companyName.toLowerCase().includes(search) ||
           client.contactName.toLowerCase().includes(search) ||
           client.email.toLowerCase().includes(search) ||
           (client.phone && client.phone.toLowerCase().includes(search));
  });

  return (
    <>
      <Helmet>
        <title>Admin - Client Management | Talencor Staffing</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <AdminHeader 
          adminUser={adminUser} 
          currentPage="client-management" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-2">Manage client access codes and requests</p>
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
            <TabsTrigger value="clients">Active Clients ({activeClients.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Clients ({inactiveClients.length})</TabsTrigger>
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
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Active Clients</CardTitle>
                  <CardDescription>
                    Manage client access codes and monitor activity
                  </CardDescription>
                </div>
                {/* Search Bar */}
                <div className="relative w-96">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by company, contact, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="text-center py-8">Loading clients...</div>
              ) : (
                <>
                  {searchTerm && (
                    <p className="text-sm text-gray-600 mb-4">
                      Showing {filteredActiveClients.length} of {activeClients.length} active clients
                    </p>
                  )}
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
                        {filteredActiveClients.map((client: any) => (
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
                              ? `${format(new Date(client.lastLoginAt), 'PPp')} (${formatDistanceToNow(new Date(client.lastLoginAt), { addSuffix: true })})`
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
                                title="View Details"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setClientToEdit(client);
                                  setShowEditClient(true);
                                }}
                                title="Edit Client"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setClientToDelete(client);
                                  setShowDeleteConfirm(true);
                                }}
                                title="Deactivate Client"
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
                </>
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

        {/* Inactive Clients Tab */}
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Inactive Clients</CardTitle>
                  <CardDescription>
                    View and manage deactivated client accounts
                  </CardDescription>
                </div>
                {/* Search Bar */}
                <div className="relative w-96">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search inactive clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="text-center py-8">Loading clients...</div>
              ) : filteredInactiveClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No inactive clients match your search' : 'No inactive clients'}
                </div>
              ) : (
                <>
                  {searchTerm && (
                    <p className="text-sm text-gray-600 mb-4">
                      Showing {filteredInactiveClients.length} of {inactiveClients.length} inactive clients
                    </p>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Company</th>
                          <th className="text-left p-2">Contact</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Phone</th>
                          <th className="text-left p-2">Deactivated</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInactiveClients.map((client: any) => (
                          <tr key={client.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div className="font-medium">{client.companyName}</div>
                            </td>
                            <td className="p-2">{client.contactName}</td>
                            <td className="p-2">{client.email}</td>
                            <td className="p-2">{client.phone || 'N/A'}</td>
                            <td className="p-2">
                              {client.updatedAt 
                                ? formatDistanceToNow(new Date(client.updatedAt), { addSuffix: true })
                                : 'Unknown'}
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
                                  title="View Details"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => reactivateMutation.mutate(client.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  title="Reactivate Client"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deactivation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {clientToDelete?.companyName}? 
              This will prevent them from accessing their job postings.
              You can reactivate the client later from the Inactive Clients tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteConfirm(false);
              setClientToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deactivateMutation.mutate(clientToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Generate Confirmation Dialog */}
      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Generation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to generate access codes for {bulkClientData.trim().split('\n').length} clients.
              This action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkGenerate}>
              Generate Codes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Client Dialog */}
      <Dialog open={showEditClient} onOpenChange={setShowEditClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client Details</DialogTitle>
            <DialogDescription>
              Update client information
            </DialogDescription>
          </DialogHeader>
          {clientToEdit && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-companyName">Company Name</Label>
                <Input
                  id="edit-companyName"
                  value={clientToEdit.companyName}
                  onChange={(e) => setClientToEdit({...clientToEdit, companyName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-contactName">Contact Name</Label>
                <Input
                  id="edit-contactName"
                  value={clientToEdit.contactName}
                  onChange={(e) => setClientToEdit({...clientToEdit, contactName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={clientToEdit.email}
                  onChange={(e) => setClientToEdit({...clientToEdit, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={clientToEdit.phone || ''}
                  onChange={(e) => setClientToEdit({...clientToEdit, phone: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditClient(false);
              setClientToEdit(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => updateClientMutation.mutate(clientToEdit)}
              disabled={updateClientMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
// </AdminClientManagementPageSnippet>