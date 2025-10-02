// src/pages/Index.tsx - Debug version
import { useEffect, useState } from "react";
import { ProposalDashboard } from "@/components/ProposalDashboard";
import { useApi } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import type { ProposalData } from "@/types/proposal";

const Index = () => {
  const { user, loading: userLoading, error: userError, refetch, apiService } = useApi();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Fetch proposal data
// Fetch proposal data
const fetchProposalData = async () => {
  setProposalLoading(true);
  setProposalError(null);
  
  try {
    // Get proposals list first
    const proposals = await apiService.getProposals();
    console.log('Raw proposals response:', proposals);
    
    if (proposals && proposals.length > 0) {
      console.log('First proposal structure:', proposals[0]);
      
      // Try multiple ways to get the proposal ID
      let proposalId: string | null = null;
      
      // Check different possible property names
      if (proposals[0].eventDetails?.jobNumber) {
        proposalId = proposals[0].eventDetails.jobNumber;
        console.log('Using jobNumber:', proposalId);
      } else if (proposals[0].event_details?.job_number) {
        proposalId = proposals[0].event_details.job_number;
        console.log('Using job_number:', proposalId);
      } else if (proposals[0].job_number) {
        proposalId = proposals[0].job_number;
        console.log('Using direct job_number:', proposalId);
      } else if (proposals[0].id) {
        proposalId = proposals[0].id;
        console.log('Using id:', proposalId);
      }
      
      // If we still don't have a valid ID, throw an error
      if (!proposalId) {
        throw new Error('No valid proposal ID found in response. Check backend data structure.');
      }
      
      const detailedProposal = await apiService.getProposal(proposalId);
      console.log('Detailed proposal response:', detailedProposal);
      
      if (detailedProposal) {
        setProposalData(detailedProposal);
      } else {
        throw new Error('Failed to load proposal details');
      }
    } else {
      throw new Error('No proposals found in database');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load proposal data';
    setProposalError(errorMessage);
    console.error('Failed to fetch proposal data:', error);
  } finally {
    setProposalLoading(false);
  }
};
  // Check API health
  const checkApiHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await apiService.checkHealth();
      setHealthStatus(health?.status || 'unknown');
    } catch (error) {
      setHealthStatus('error');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    checkApiHealth();
    fetchProposalData();
  }, [apiService]);

  // Show loading state while fetching user or proposal data
  if (userLoading || proposalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {userLoading ? "Connecting to Pinnacle Live API..." : "Loading proposal data..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there are critical errors
  if (userError || proposalError) {
    const displayError = userError || proposalError;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {userError ? "Connection Error" : "Data Loading Error"}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {userError 
                ? "Unable to connect to the Pinnacle Live API. Please check your connection."
                : "Unable to load proposal data from the API."
              }
            </p>
            <Badge variant="destructive" className="mb-4">
              {displayError}
            </Badge>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                refetch();
                fetchProposalData();
              }} 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Don't render if proposal data is not available
  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-warning mx-auto" />
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Proposal Data</h2>
            <p className="text-muted-foreground text-sm mb-4">
              No proposal data is available to display.
            </p>
          </div>
          <Button onClick={fetchProposalData} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
   

      {/* Main Application */}
      <ProposalDashboard proposalData={proposalData} />
    </div>
  );
};

export default Index;