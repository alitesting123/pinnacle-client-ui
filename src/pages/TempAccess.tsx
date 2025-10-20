// src/pages/TempAccess.tsx - FIXED VERSION
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProposalDashboard } from "@/components/ProposalDashboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, AlertTriangle, Timer } from "lucide-react";
import type { ProposalData } from "@/types/proposal";

const TempAccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [extending, setExtending] = useState(false);

  // ✅ Get API base URL - use CloudFront
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dlndpgwc2naup.cloudfront.net';

  useEffect(() => {
    if (!token) {
      setError("Invalid access link - no token provided");
      setLoading(false);
      return;
    }

    validateAccessAndLoadProposal();
  }, [token]);

  // Timer for session countdown
  useEffect(() => {
    if (sessionInfo && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - (1/60); // Decrease by 1 second
          
          // Show extension dialog when 10 seconds remain
          if (newTime <= (10/60) && newTime > 0 && !showExtensionDialog) {
            setShowExtensionDialog(true);
          }
          
          if (newTime <= 0) {
            setError("Your session has expired. Please request a new access link.");
            return 0;
          }
          return newTime;
        });
      }, 1000); // Update every second

      return () => clearInterval(timer);
    }
  }, [sessionInfo, timeRemaining, showExtensionDialog]);

  const validateAccessAndLoadProposal = async () => {
    try {
      console.log('🔐 Validating token:', token?.substring(0, 20) + '...');
      
      // Step 1: Validate temp access token
      const response = await fetch(`${API_BASE}/api/v1/temp-access/${token}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Token validation response:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid or expired access link' }));
        throw new Error(errorData.detail || 'Access validation failed');
      }

      const sessionData = await response.json();
      console.log('✅ Session created:', sessionData.session_id);
      
      const sessionIdFromResponse = sessionData.session_id;
      setSessionId(sessionIdFromResponse);
      
      // Step 2: Load proposal with session
      const proposalResponse = await fetch(
        `${API_BASE}/api/v1/proposals/${sessionData.proposal_id}/temp-session?session_id=${sessionIdFromResponse}`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('📄 Proposal response:', proposalResponse.status);

      if (!proposalResponse.ok) {
        throw new Error('Failed to load proposal');
      }

      const proposalDataResponse = await proposalResponse.json();
      const { session_info, ...proposal } = proposalDataResponse;
      
      console.log('✅ Proposal loaded:', proposal.eventDetails?.jobNumber);
      
      setProposalData(proposal);
      setSessionInfo(session_info);
      setTimeRemaining(session_info.time_remaining_minutes);
      
    } catch (err) {
      console.error('❌ Temp access error:', err);
      setError(err instanceof Error ? err.message : 'Access failed');
    } finally {
      setLoading(false);
    }
  };

  const extendSession = async () => {
    setExtending(true);
    try {
      console.log('⏰ Extending session:', sessionId);
      
      const response = await fetch(
        `${API_BASE}/api/v1/temp-sessions/${sessionId}/extend`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTimeRemaining(data.time_remaining_minutes);
        setShowExtensionDialog(false);
        
        console.log('✅ Session extended:', data.time_remaining_minutes, 'minutes');
        
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        toast.innerHTML = '✓ Session extended by 10 minutes!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.classList.add('animate-fade-out');
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
      } else {
        throw new Error('Failed to extend session');
      }
    } catch (error) {
      console.error('❌ Extension failed:', error);
      setError('Unable to extend session. Please request a new link.');
    } finally {
      setExtending(false);
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Expired";
    
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getTimeColor = (minutes: number) => {
    if (minutes <= (10/60)) return 'text-red-600 animate-pulse'; // Last 10 seconds
    if (minutes <= (30/60)) return 'text-orange-600'; // Last 30 seconds
    if (minutes <= 1) return 'text-yellow-600'; // Last minute
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Validating Access</h2>
          <p className="text-muted-foreground">
            Verifying your temporary access link...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="pt-4 text-xs text-muted-foreground space-y-2">
            <p>This link may have expired or been used already.</p>
            <p>Please check your email for a new access link or contact your Pinnacle Live representative.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-muted-foreground">No proposal data available</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                Temporary Access
              </Badge>
              {sessionInfo?.user?.full_name && (
                <span className="text-blue-800 font-medium">
                  Welcome, {sessionInfo.user.full_name}
                </span>
              )}
              {sessionInfo?.user?.company && (
                <span className="text-blue-600 hidden md:inline">
                  • {sessionInfo.user.company}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className={`font-semibold ${getTimeColor(timeRemaining)}`}>
                {formatTimeRemaining(timeRemaining)} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Dialog */}
      {showExtensionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Timer className="h-6 w-6 text-orange-500 animate-pulse" />
                <h3 className="text-lg font-semibold">Session Expiring Soon</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Your session will expire in a few seconds. Would you like to extend it by 10 minutes to continue reviewing the proposal?
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowExtensionDialog(false)}
                  disabled={extending}
                >
                  Let it expire
                </Button>
                <Button
                  onClick={extendSession}
                  disabled={extending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {extending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extending...
                    </>
                  ) : (
                    'Extend 10 minutes'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Proposal Dashboard */}
      <ProposalDashboard proposalData={proposalData} />
    </div>
  );
};

export default TempAccess;