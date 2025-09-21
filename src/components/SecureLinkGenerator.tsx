// src/components/SecureLinkGenerator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GeneratedLink {
  url: string;
  token: string;
  expires_at: string;
  user_email: string;
  user_name?: string;
  company?: string;
}

interface SecureLinkGeneratorProps {
  proposalId: string;
}

export const SecureLinkGenerator: React.FC<SecureLinkGeneratorProps> = ({ proposalId }) => {
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [generating, setGenerating] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');

  const generateSecureLink = async () => {
    if (!clientEmail) return;
    
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
          expires_in_hours: 24,
          permissions: ['view', 'comment']
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newLink: GeneratedLink = {
          ...data,
          user_email: clientEmail,
          user_name: clientName,
          company: company
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
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Secure Client Access Link</h3>
        
        <div className="space-y-4">
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
            disabled={generating || !clientEmail}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Secure Link'}
          </Button>
        </div>
      </Card>

      {generatedLinks.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Links ({generatedLinks.length})</h3>
          
          <div className="space-y-4">
            {generatedLinks.map((link, index) => (
              <div key={link.token} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{link.user_email}</div>
                    {link.user_name && (
                      <div className="text-sm text-gray-600">{link.user_name}</div>
                    )}
                    {link.company && (
                      <Badge variant="secondary" className="text-xs mt-1">{link.company}</Badge>
                    )}
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
        </Card>
      )}
    </div>
  );
};