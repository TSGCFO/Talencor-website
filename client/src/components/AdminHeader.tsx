import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User, 
  Briefcase, 
  Users,
  ChevronDown,
  Home,
  FileText,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';

interface AdminHeaderProps {
  adminUser: { id: number; username: string } | null;
  currentPage: 'job-postings' | 'client-management';
  onLogout?: () => void;
}

export function AdminHeader({ adminUser, currentPage, onLogout }: AdminHeaderProps) {
  const [location, setLocation] = useLocation();
  
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
        if (onLogout) onLogout();
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

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Admin Badge */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-[#F97316]" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Talencor Admin</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            <Button
              variant={currentPage === 'job-postings' ? 'default' : 'ghost'}
              className={currentPage === 'job-postings' ? 'bg-[#F97316] hover:bg-[#EA580C]' : ''}
              onClick={() => setLocation('/admin/job-postings')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Job Postings
            </Button>
            <Button
              variant={currentPage === 'client-management' ? 'default' : 'ghost'}
              className={currentPage === 'client-management' ? 'bg-[#F97316] hover:bg-[#EA580C]' : ''}
              onClick={() => setLocation('/admin/client-management')}
            >
              <Users className="mr-2 h-4 w-4" />
              Client Management
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Quick Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.open('/', '_blank')}>
                  <Home className="mr-2 h-4 w-4" />
                  View Public Site
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline-block">{adminUser?.username || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{adminUser?.username}</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}