// src/components/ConfirmationModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, FileCheck } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmedBy: string, date: string) => void;
  proposalData: {
    jobNumber: string;
    clientName: string;
    totalCost: number;
  };
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, proposalData }: ConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFirstConfirm = () => {
    // Show the "Are you sure?" confirmation
    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    setIsProcessing(true);
    const confirmationDate = new Date().toISOString();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onConfirm(proposalData.clientName, confirmationDate);
    setShowConfirmation(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setShowConfirmation(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-light rounded-lg">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Approve Proposal</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Review and confirm your approval of this proposal
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Proposal Summary */}
          <div className="bg-secondary/30 p-5 rounded-lg border border-card-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Proposal Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium text-foreground">{proposalData.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposal Number:</span>
                <span className="font-medium text-foreground">#{proposalData.jobNumber}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-lg text-primary">
                  ${proposalData.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Agreement Text */}
          <div className="bg-accent-light/30 p-5 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm text-foreground space-y-2">
                <p className="font-medium">
                  By approving this proposal, you acknowledge and agree to:
                </p>
                <ul className="space-y-1.5 ml-4 list-disc text-muted-foreground">
                  <li>The terms, conditions, and pricing outlined in this proposal</li>
                  <li>The equipment specifications and delivery timeline</li>
                  <li>Payment terms as specified in the agreement</li>
                  <li>Cancellation and modification policies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="bg-background p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Approval Date:</span>{' '}
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground">Approved By:</span>{' '}
              {proposalData.clientName}
            </p>
          </div>

          {!showConfirmation ? (
            /* Initial Approve Button */
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFirstConfirm}
                disabled={isProcessing}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Approve Proposal
              </Button>
            </div>
          ) : (
            /* Confirmation Step - "Are you sure?" */
            <div className="space-y-4">
              <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Are you sure you want to approve this proposal?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This action will confirm your acceptance of all terms and conditions. 
                      The proposal status will be updated to "Confirmed".
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleFinalConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Yes, Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}