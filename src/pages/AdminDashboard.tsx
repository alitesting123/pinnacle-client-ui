// src/pages/AdminDashboard.tsx (create new file)
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, Plus, Trash2, Users, Link2, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GeneratedLink {
  url: string;
  token: string;
  expires_at: string;
  user_email: string;
  user_name?: string;
  company?: string;
  proposal_id: string;
}

interface ApprovedUser {
  id: string;
  email: string;
  full_name: string;
  company: string;
  roles: string[];
  is_active: boolean;
  has_logged_in: boolean;
}

const AdminDashboard = () => {
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [proposalId, setProposalId] = useState('306780');
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [expiryHours, setExpiryHours] = useState(24);

  useEffect(() => {
    loadApprovedUsers();
  }, []);

  const loadApprovedUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/approved-users');
      if (response.ok) {
        const users = await response.json();
        setApprovedUsers(users);
      }
    } catch (error) {
      console.error('Failed to load approved users:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSecureLink = async () => {
    if (!clientEmail || !proposalId) return;
    
    setGenerating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/proposals/${proposalId}/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: clientEmail,
          user_name: clientName || null,
          company: company || null,
          expires_in_hours: expiryHours,
          permissions: ['view', 'comment']
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newLink: GeneratedLink = {
          ...data,
          user_email: clientEmail,
          user_name: clientName,
          company: company,
          proposal_id: proposalId
        };
        
        setGeneratedLinks(prev => [...prev, newLink]);
        
        // Clear form
        setClientEmail('');
        setClientName('');
        setCompany('');
        
        toast({
          title: "Secure Link Generated",
          description: `Link created for ${clientEmail}`,
        });
      } else {
        throw new Error('Failed to generate link');
      }
    } catch (error) {
      console.error('Error generating secure link:', error);
      toast({
        title: "Error",
        description: "Failed to generate secure link",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const quickGenerate = (user: ApprovedUser) => {
    setClientEmail(user.email);
    setClientName(user.full_name);
    setCompany(user.company);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const removeLink = (token: string) => {
    setGeneratedLinks(prev => prev.filter(link => link.token !== token));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage secure proposal links and user access</p>
            </div>
            <Badge variant="secondary">Pinnacle Live Admin</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="generate-links" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate-links" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Generate Links
            </TabsTrigger>
            <TabsTrigger value="approved-users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Approved Users
            </TabsTrigger>
            <TabsTrigger value="generated-links" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Generated Links ({generatedLinks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate-links" className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Generate Secure Proposal Access Link</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="proposal-id">Proposal ID *</Label>
                    <Input
                      id="proposal-id"
                      value={proposalId}
                      onChange={(e) => setProposalId(e.target.value)}
                      placeholder="306780"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry">Expires In (Hours) *</Label>
                    <Input
                      id="expiry"
                      type="number"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(Number(e.target.value))}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Client Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@company.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Client Name</Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corporation"
                    />
                  </div>
                </div>

                <Button 
                  onClick={generateSecureLink} 
                  disabled={generating || !clientEmail || !proposalId}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Secure Link'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="approved-users" className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Approved Users</h3>
                <Badge variant="outline">{approvedUsers.length} users</Badge>
              </div>
              
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <div className="space-y-3">
                  {approvedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-600">
                          {user.full_name} • {user.company}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={user.has_logged_in ? "default" : "outline"}
                          className="text-xs"
                        >
                          {user.has_logged_in ? "Logged In" : "Never Logged In"}
                        </Badge>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => quickGenerate(user)}
                        >
                          Quick Generate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="generated-links" className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Generated Links</h3>
              
              {generatedLinks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No links generated yet. Go to the "Generate Links" tab to create your first link.
                </p>
              ) : (
                <div className="space-y-4">
                  {generatedLinks.map((link) => (
                    <div key={link.token} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{link.user_email}</div>
                          {link.user_name && (
                            <div className="text-sm text-gray-600">{link.user_name}</div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {link.company && (
                              <Badge variant="secondary" className="text-xs">{link.company}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              Proposal: {link.proposal_id}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-gray-500">
                          <div>Expires: {new Date(link.expires_at).toLocaleDateString()}</div>
                          <div>{new Date(link.expires_at).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-600">Secure URL:</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={link.url} 
                            readOnly 
                            className="text-xs font-mono"
                          />
                          <Button size="sm" variant="outline" onClick={() => copyLink(link.url)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openLink(link.url)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removeLink(link.token)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;