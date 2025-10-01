import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileSignature, AlertCircle } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signature: string, date: string) => void;
  proposalData: {
    jobNumber: string;
    clientName: string;
    totalCost: number;
  };
}

export function SignatureModal({ isOpen, onClose, onSign, proposalData }: SignatureModalProps) {
  const [signature, setSignature] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async () => {
    if (!signature.trim() || !agreed) return;

    setIsProcessing(true);
    const signatureDate = new Date().toISOString();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSign(signature, signatureDate);
    setSignature('');
    setAgreed(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSignature('');
      setAgreed(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-light rounded-lg">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Sign Proposal</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Review and digitally sign this proposal agreement
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
                  By signing this proposal, you acknowledge and agree to:
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

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isProcessing}
            />
            <label htmlFor="agree" className="text-sm text-foreground cursor-pointer">
              I have read and agree to the terms and conditions outlined in this proposal. 
              I understand that my digital signature below constitutes a legally binding agreement.
            </label>
          </div>

          {/* Signature Input */}
          <div className="space-y-3">
            <Label htmlFor="signature" className="text-base font-semibold">
              Digital Signature *
            </Label>
            <Input
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your full name to sign"
              disabled={!agreed || isProcessing}
              className="text-lg font-serif italic h-14"
              style={{
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive"
              }}
            />
            <p className="text-xs text-muted-foreground">
              Your typed name will serve as your digital signature. 
              Date: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
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
              onClick={handleSubmit}
              disabled={!signature.trim() || !agreed || isProcessing}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Sign Proposal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}