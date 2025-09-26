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

  useEffect(() => {
    if (!token) {
      setError("Invalid access link");
      setLoading(false);
      return;
    }

    validateAccessAndLoadProposal();
  }, [token]);

  // Timer for session countdown - updates every second for precise timing
  useEffect(() => {
    if (sessionInfo && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - (1/60); // Decrease by 1 second (1/60 of a minute)
          
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
      // Step 1: Validate temp access token
      const response = await fetch(`http://localhost:8000/api/v1/temp-access/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Access validation failed');
      }

      const sessionData = await response.json();
      const sessionIdFromResponse = sessionData.session_id;
      setSessionId(sessionIdFromResponse); // Store session ID for extensions
      
      // Step 2: Load proposal with session
      const proposalResponse = await fetch(
        `http://localhost:8000/api/v1/proposals/${sessionData.proposal_id}/temp-session?session_id=${sessionIdFromResponse}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!proposalResponse.ok) {
        throw new Error('Failed to load proposal');
      }

      const proposalData = await proposalResponse.json();
      const { session_info, ...proposal } = proposalData;
      
      setProposalData(proposal);
      setSessionInfo(session_info);
      setTimeRemaining(session_info.time_remaining_minutes);
      
    } catch (err) {
      console.error('Temp access error:', err);
      setError(err instanceof Error ? err.message : 'Access failed');
    } finally {
      setLoading(false);
    }
  };

  const extendSession = async () => {
    setExtending(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/temp-sessions/${sessionId}/extend`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTimeRemaining(data.time_remaining_minutes);
        setShowExtensionDialog(false);
        
        // Show brief success indicator
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        successDiv.textContent = 'Session extended by 10 minutes!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      } else {
        throw new Error('Failed to extend session');
      }
    } catch (error) {
      console.error('Extension failed:', error);
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
    if (minutes <= (10/60)) return 'text-red-600'; // Last 10 seconds
    if (minutes <= (20/60)) return 'text-orange-600'; // Last 20 seconds
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
          <h2 className="text-xl font-semibold text-foreground">Access Expired</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="text-xs text-muted-foreground">
            Please check your email for a new access link or contact your Pinnacle Live representative.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500 text-white">
                Temporary Access
              </Badge>
              <span className="text-blue-800">
                Welcome, {sessionInfo?.user?.full_name}
              </span>
              {sessionInfo?.user?.company && (
                <span className="text-blue-600">
                  • {sessionInfo.user.company}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className={`font-medium ${getTimeColor(timeRemaining)}`}>
                {formatTimeRemaining(timeRemaining)} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Dialog */}
      {showExtensionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Timer className="h-6 w-6 text-orange-500" />
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
      {proposalData && <ProposalDashboard proposalData={proposalData} />}
    </div>
  );
};

export default TempAccess;