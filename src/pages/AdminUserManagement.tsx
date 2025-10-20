// src/pages/AdminUserManagement.tsx (create new file)
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Share, Copy, ExternalLink, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PreApprovedUser {
  id: string;
  email: string;
  full_name: string;
  company: string;
  department: string;
  roles: string[];
  is_active: boolean;
  has_logged_in: boolean;
}

interface GeneratedLink {
  url: string;
  token: string;
  expires_at: string;
  user_email: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<PreApprovedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PreApprovedUser | null>(null);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLink | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/approved-users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateLinkForUser = async (user: PreApprovedUser) => {
    setGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/proposals/306780/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: user.email,
          user_name: user.full_name,
          company: user.company,
          expires_in_hours: 24,
          permissions: ['view', 'comment']
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink({
          ...data,
          user_email: user.email
        });
        toast({
          title: "Link Generated",
          description: `Secure link created for ${user.email}`
        });
      } else {
        throw new Error('Failed to generate link');
      }
    } catch (error) {
      console.error('Error generating link:', error);
      toast({
        title: "Error",
        description: "Failed to generate link",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (generatedLink?.url) {
      navigator.clipboard.writeText(generatedLink.url);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
    }
  };

  const openLink = () => {
    if (generatedLink?.url) {
      window.open(generatedLink.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">User Management</h1>
        <Badge variant="secondary">Admin</Badge>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Pre-Approved Users</h2>
          <Badge variant="outline">{users.length} users</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.company || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.has_logged_in ? "default" : "outline"}
                    className="text-xs"
                  >
                    {user.has_logged_in ? "Logged In" : "Never Logged In"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Generate Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Generate Secure Link</DialogTitle>
                      </DialogHeader>
                      
                      {selectedUser && (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">User Details</h4>
                            <div className="text-sm space-y-1">
                              <p><strong>Email:</strong> {selectedUser.email}</p>
                              <p><strong>Name:</strong> {selectedUser.full_name || 'N/A'}</p>
                              <p><strong>Company:</strong> {selectedUser.company || 'N/A'}</p>
                            </div>
                          </div>

                          <Button 
                            onClick={() => generateLinkForUser(selectedUser)}
                            disabled={generating}
                            className="w-full"
                          >
                            {generating ? 'Generating...' : 'Generate 24-Hour Link'}
                          </Button>

                          {generatedLink && generatedLink.user_email === selectedUser.email && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Link Generated Successfully!
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs text-green-700 block mb-1">
                                    Secure URL:
                                  </label>
                                  <div className="flex gap-2">
                                    <Input 
                                      value={generatedLink.url} 
                                      readOnly 
                                      className="text-xs bg-white"
                                    />
                                    
                                    <Button size="sm" variant="outline" onClick={copyLink}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={openLink}>
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-green-600">
                                  <p>Expires: {new Date(generatedLink.expires_at).toLocaleString()}</p>
                                  <p>Token: {generatedLink.token.substring(0, 20)}...</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminUserManagement;