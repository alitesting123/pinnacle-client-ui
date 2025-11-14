// src/components/ConfirmationModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleConfirm = async () => {
    if (!agreedToTerms) return;

    setIsProcessing(true);
    const confirmationDate = new Date().toISOString();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    onConfirm(proposalData.clientName, confirmationDate);
    setIsProcessing(false);
    setAgreedToTerms(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAgreedToTerms(false);
      onClose();
    }
  };

  const scrollToTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to bottom of the page where terms would be
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // Close modal to show the terms
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
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
          <div className="bg-secondary/20 p-5 rounded-lg border border-card-border">
            <h4 className="font-semibold text-foreground mb-4">Proposal Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium text-foreground">{proposalData.clientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Proposal Number:</span>
                <span className="font-medium text-foreground">#{proposalData.jobNumber}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-muted-foreground font-medium">Total Amount:</span>
                <span className="font-bold text-xl text-primary">
                  ${proposalData.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Agreement Information */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              By approving this proposal, you acknowledge and agree to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>The terms, conditions, and pricing outlined in this proposal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>The equipment specifications and delivery timeline</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Payment terms as specified in the agreement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Cancellation and modification policies</span>
              </li>
            </ul>
          </div>

          {/* Date and Approver Display */}
          <div className="bg-muted/30 p-4 border border-border rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approval Date:</span>
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approved By:</span>
              <span className="font-medium text-foreground">{proposalData.clientName}</span>
            </div>
          </div>

          {/* Terms and Conditions Agreement */}
          <div className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-foreground leading-relaxed cursor-pointer"
            >
              I have read and agree to the{' '}
              <a
                href="#terms-and-conditions"
                onClick={scrollToTerms}
                className="text-primary font-medium hover:underline"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Action Buttons */}
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
              onClick={handleConfirm}
              disabled={isProcessing || !agreedToTerms}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Approving...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Approve Proposal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}