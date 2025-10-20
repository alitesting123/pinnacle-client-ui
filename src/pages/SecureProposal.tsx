// src/pages/SecureProposal.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProposalDashboard } from "@/components/ProposalDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import type { ProposalData } from "@/types/proposal";

const SecureProposal = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [linkExpires, setLinkExpires] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      validateAndLoadProposal();
    } else {
      setError("No access token provided");
      setValidating(false);
    }
  }, [token]);

  const validateAndLoadProposal = async () => {
    try {
      console.log("Validating token:", token); // Debug log
      
       const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dlndpgwc2naup.cloudfront.net';
       const response = await fetch(`${API_BASE}/api/v1/secure-proposals/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        if (response.status === 410) {
          setError('This link has expired or been revoked. Please request a new one.');
        } else if (response.status === 404) {
          setError('Invalid link. Please check the URL or request a new link.');
        } else {
          setError('Unable to access proposal. Please try again.');
        }
        return;
      }

      const data = await response.json();
      console.log("Received data:", data); // Debug log
      
      // Remove user and metadata from proposal data
      const { user, access_type, link_expires, access_count, message, ...proposal } = data;
      
      setProposalData(proposal as ProposalData);
      setUserInfo(user);
      setLinkExpires(link_expires);

    } catch (err) {
      console.error('Secure access error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setValidating(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validating access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Error</h2>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-warning mx-auto" />
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Proposal Data</h2>
            <p className="text-muted-foreground text-sm">Unable to load proposal information.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Secure Access Banner */}
      <div className="border-b border-border bg-blue-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Secure Access</span>
              </div>
              
              {userInfo && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-700">Welcome, {userInfo.full_name}</span>
                  {userInfo.company && (
                    <span className="text-blue-600">({userInfo.company})</span>
                  )}
                </div>
              )}
            </div>
            
            {linkExpires && (
              <div className="text-blue-700">
                Link expires: {new Date(linkExpires).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Dashboard */}
      <ProposalDashboard proposalData={proposalData} />
    </div>
  );
};

export default SecureProposal;