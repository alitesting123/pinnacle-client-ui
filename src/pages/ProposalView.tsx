// src/pages/ProposalView.tsx - COMPLETE JWT-BASED IMPLEMENTATION
/**
 * Unified Proposal View Component
 * Handles JWT token-based temporary access
 * 
 * Flow:
 * 1. Extract token from URL query params
 * 2. Validate JWT with backend (single API call)
 * 3. Display proposal or show error
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProposalDashboard } from "@/components/ProposalDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Clock, Shield, CheckCircle, Lock, Mail } from "lucide-react";
import type { ProposalData } from "@/types/proposal";

// ============================================================================
// INTERFACES
// ============================================================================

interface TokenInfo {
  recipient_email?: string;
  expires_at?: string;
  issued_at?: string;
  proposal_id?: string;
  job_number?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProposalView = () => {
  // Router hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token from URL
  const token = searchParams.get('token');
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  // API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dlndpgwc2naup.cloudfront.net';

  // ============================================================================
  // LOAD PROPOSAL ON MOUNT
  // ============================================================================

  useEffect(() => {
    if (!token) {
      setError("No access token provided in URL");
      setLoading(false);
      return;
    }

    loadProposal();
  }, [token]);

  // ============================================================================
  // LOAD PROPOSAL FUNCTION
  // ============================================================================

  const loadProposal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Validating JWT token...');
      console.log('Token (first 20 chars):', token?.substring(0, 20) + '...');
      
      // ✅ SINGLE API CALL - JWT validation + proposal data
      const response = await fetch(`${API_BASE}/api/v1/proposal/access/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      // Handle different error scenarios
      if (!response.ok) {
        if (response.status === 410) {
          throw new Error('This access link has expired. Please request a new link from your Pinnacle Live representative.');
        } else if (response.status === 401) {
          throw new Error('Invalid access token. Please check your email for the correct link.');
        } else if (response.status === 404) {
          throw new Error('Proposal not found. The proposal may have been removed or is no longer available.');
        } else {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to access proposal' }));
          throw new Error(errorData.detail || 'Failed to access proposal');
        }
      }

      const data = await response.json();
      console.log('✅ Proposal loaded successfully');
      console.log('Proposal ID:', data.eventDetails?.jobNumber);

      // 🔍 DEBUG: Check first item structure
      if (data.sections && data.sections[0]?.items && data.sections[0].items[0]) {
        console.log('📦 First item from API:', data.sections[0].items[0]);
        console.log('  - quantity:', data.sections[0].items[0].quantity);
        console.log('  - price:', data.sections[0].items[0].price);
        console.log('  - discount:', data.sections[0].items[0].discount);
        console.log('  - subtotal:', data.sections[0].items[0].subtotal);
      }

      // Extract token info if provided by backend
      if (data.access_token_info) {
        setTokenInfo(data.access_token_info);
      }

      setProposalData(data);
      
    } catch (err) {
      console.error('❌ Failed to load proposal:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CALCULATE TIME REMAINING
  // ============================================================================

  const getTimeRemaining = () => {
    if (!tokenInfo?.expires_at) return null;
    
    const now = new Date();
    const expires = new Date(tokenInfo.expires_at);
    const diffMs = expires.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Expired";
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="main" aria-busy="true" aria-live="polite">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="relative" role="status" aria-label="Loading">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" aria-hidden="true" />
            <Shield className="h-6 w-6 absolute top-3 left-1/2 -translate-x-1/2 text-primary-foreground" aria-hidden="true" />
            <span className="sr-only">Validating your access, please wait...</span>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Validating Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Verifying your secure access token...
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>Encrypted JWT validation in progress</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================
  
  if (error) {
    const isExpired = error.toLowerCase().includes('expired');
    const isInvalid = error.toLowerCase().includes('invalid');
    const isNotFound = error.toLowerCase().includes('not found');

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6" role="main">
        <Card className="max-w-lg w-full p-8 text-center space-y-6" role="alert" aria-live="assertive">
          {/* Error Icon */}
          <div className="relative mx-auto w-16 h-16" aria-hidden="true">
            <div className={`absolute inset-0 rounded-full ${
              isExpired ? 'bg-orange-100' : 'bg-red-100'
            } flex items-center justify-center`}>
              {isExpired ? (
                <Clock className="h-8 w-8 text-orange-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-destructive" />
              )}
            </div>
          </div>

          {/* Error Message */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {isExpired && 'Access Link Expired'}
              {isInvalid && 'Invalid Access Link'}
              {isNotFound && 'Proposal Not Found'}
              {!isExpired && !isInvalid && !isNotFound && 'Access Denied'}
            </h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          
          {/* Helpful Information */}
          <div className="bg-secondary/30 p-4 rounded-lg text-left space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Need a new link?</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Contact your Pinnacle Live representative to request a new secure access link.
                </p>
              </div>
            </div>
            
            {isExpired && (
              <div className="flex items-start gap-2 text-sm pt-2 border-t border-border">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Secure links expire 24 hours after first access for your security.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              size="lg"
              aria-label="Return to home page"
            >
              Return to Home
            </Button>

            <p className="text-xs text-muted-foreground">
              Questions? Email{' '}
              <a
                href="mailto:support@pinnaclelive.com"
                className="text-primary hover:underline"
                aria-label="Contact support via email at support@pinnaclelive.com"
              >
                support@pinnaclelive.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // NO DATA STATE
  // ============================================================================
  
  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="main">
        <Card className="max-w-md w-full p-8 text-center space-y-4" role="alert" aria-live="polite">
          <AlertCircle className="h-12 w-12 text-warning mx-auto" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-semibold text-foreground mb-2">
              No Proposal Data
            </h1>
            <p className="text-muted-foreground text-sm">
              Unable to load proposal information. Please try again or contact support.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
            aria-label="Reload page to try loading proposal again"
          >
            Reload Page
          </Button>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // SUCCESS - SHOW PROPOSAL
  // ============================================================================
  
  const timeRemaining = getTimeRemaining();
  const recipientEmail = tokenInfo?.recipient_email || searchParams.get('email') || 'Guest';

  return (
    <div className="min-h-screen bg-background">

      {/* ============================================================================ */}
      {/* SKIP LINKS FOR ACCESSIBILITY */}
      {/* ============================================================================ */}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* ============================================================================ */}
      {/* SECURE ACCESS BANNER */}
      {/* ============================================================================ */}

      <header className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 sticky top-0 z-40 shadow-sm" role="banner">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">

            {/* Left: Access Info */}
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white hover:bg-green-700 shadow-sm" aria-label="Secure access status">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                Secure Access
              </Badge>

              <div className="flex items-center gap-2 text-green-800" aria-label={`Logged in as ${recipientEmail}`}>
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{recipientEmail}</span>
              </div>
            </div>

            {/* Right: Expiration Info */}
            <div className="flex items-center gap-2" role="status" aria-live="polite" aria-label={`Access ${timeRemaining || 'Valid for 24 hours'}`}>
              <Clock className="h-4 w-4 text-green-700" aria-hidden="true" />
              <span className="font-semibold text-green-700">
                {timeRemaining || 'Valid for 24 hours'}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* ============================================================================ */}
      {/* PROPOSAL DASHBOARD */}
      {/* ============================================================================ */}

      <main id="main-content" role="main">
        <ProposalDashboard proposalData={proposalData} />
      </main>

    </div>
  );
};

export default ProposalView;