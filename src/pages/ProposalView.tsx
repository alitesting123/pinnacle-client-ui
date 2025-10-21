// src/pages/ProposalView.tsx - CREATE THIS NEW FILE
/**
 * Unified Proposal View - handles JWT token access
 * Replaces: SecureProposal.tsx and TempAccess.tsx
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProposalDashboard } from "@/components/ProposalDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Clock, Shield } from "lucide-react";
import type { ProposalData } from "@/types/proposal";

const ProposalView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);

  // ✅ Get API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dlndpgwc2naup.cloudfront.net';

  useEffect(() => {
    if (!token) {
      setError("No access token provided in URL");
      setLoading(false);
      return;
    }

    loadProposal();
  }, [token]);

  const loadProposal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Accessing proposal with JWT token...');
      
      const response = await fetch(`${API_BASE}/api/v1/proposal/access/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          detail: response.status === 410 ? 'Link expired' : 'Access denied' 
        }));
        throw new Error(errorData.detail || 'Failed to access proposal');
      }

      const data = await response.json();
      console.log('✅ Proposal data loaded');
      
      // Extract access token info if provided
      const { access_token_info, ...proposal } = data;
      
      setProposalData(proposal);
      setAccessInfo(access_token_info);
      
    } catch (err) {
      console.error('❌ Failed to load proposal:', err);
      setError(err instanceof Error ? err.message : 'Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!accessInfo?.expires_at) return null;
    
    const now = new Date();
    const expires = new Date(accessInfo.expires_at);
    const diffMs = expires.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Expired";
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading Proposal</h2>
          <p className="text-muted-foreground">
            Verifying your access token...
          </p>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    const isExpired = error.toLowerCase().includes('expired');
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">
            {isExpired ? 'Access Link Expired' : 'Access Denied'}
          </h2>
          <p className="text-muted-foreground">{error}</p>
          
          <div className="pt-4 text-xs text-muted-foreground space-y-2">
            {isExpired ? (
              <>
                <p>This proposal link has expired.</p>
                <p>Please contact your Pinnacle Live representative for a new access link.</p>
              </>
            ) : (
              <>
                <p>Unable to access this proposal.</p>
                <p>Please check your email for the correct link or contact support.</p>
              </>
            )}
          </div>
          
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  // No Data State
  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-muted-foreground">No proposal data available</p>
        </Card>
      </div>
    );
  }

  // Success - Show Proposal
  return (
    <div className="min-h-screen bg-background">
      
      {/* Access Info Banner */}
      {accessInfo && (
        <div className="bg-blue-50 border-b border-blue-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Access
                </Badge>
                
                {accessInfo.recipient_email && (
                  <span className="text-blue-800 font-medium">
                    {accessInfo.recipient_email}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  {getTimeRemaining()}
                </span>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Proposal Dashboard */}
      <ProposalDashboard proposalData={proposalData} />
      
    </div>
  );
};

export default ProposalView;