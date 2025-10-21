// src/pages/AdminSendProposal.tsx - COMPLETE JWT IMPLEMENTATION
/**
 * Admin Interface for Sending Proposal Links
 * 
 * Features:
 * - Send JWT-secured proposal links to any email
 * - Select from database proposals
 * - Configure expiration time
 * - Track sent links
 * - Email preview
 */

import React, { useState, useEffect } from 'react';
import { Send, Users, FileText, Check, AlertCircle, Loader2, Mail, Clock, Copy, ExternalLink, Award, Shield } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface Client {
  id: string;
  email: string;
  full_name: string;
  company: string;
  roles: string[];
  is_active: boolean;
}

interface Proposal {
  id: string;
  job_number: string;
  client_name: string;
  venue: string;
  total_cost: number;
  status: string;
}

interface SentLink {
  client: Client;
  proposal: Proposal;
  url: string;
  sentAt: string;
  expiresAt?: string;
}

interface SendProposalResponse {
  message: string;
  temp_url: string;
  expires_at: string;
  proposal_info: {
    job_number: string;
    client_name: string;
    total_cost: number;
    venue: string;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminSendProposal = () => {
  // ✅ API BASE URL - Uses CloudFront in production
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dlndpgwc2naup.cloudfront.net';

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Form state
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  
  // Notification state
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Sent links history
  const [sentLinks, setSentLinks] = useState<SentLink[]>([]);

  // ============================================================================
  // LOAD DATA ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadData();
  }, []);

  // ============================================================================
  // LOAD CLIENTS AND PROPOSALS
  // ============================================================================

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load approved users and proposals in parallel
      const [clientsRes, proposalsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/admin/approved-users`),
        fetch(`${API_BASE}/api/v1/proposals`)
      ]);
      
      const clientsData = await clientsRes.json();
      const proposalsData = await proposalsRes.json();
      
      // Filter for client role users
      const clientUsers = Array.isArray(clientsData) 
        ? clientsData.filter((user: Client) => user.roles.includes('client'))
        : [];
      
      setClients(clientUsers);
      
      // Extract proposals array
      const proposalsList = proposalsData.proposals || proposalsData || [];
      setProposals(Array.isArray(proposalsList) ? proposalsList : []);
      
      console.log('✅ Loaded:', clientUsers.length, 'clients and', proposalsList.length, 'proposals');
      
    } catch (error) {
      showNotification('Failed to load data', 'error');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // NOTIFICATION HELPER
  // ============================================================================

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ============================================================================
  // SEND PROPOSAL (MAIN FUNCTION)
  // ============================================================================

  const handleSendProposal = async () => {
    if (!recipientEmail || !selectedProposal) {
      showNotification('Please enter recipient email and select a proposal', 'error');
      return;
    }

    console.log('📧 Sending proposal to:', recipientEmail);
    console.log('📄 Proposal:', selectedProposal.job_number);

    setSending(true);
    
    try {
      // ✅ NEW JWT-BASED API ENDPOINT
      const response = await fetch(`${API_BASE}/api/v1/admin/send-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_email: recipientEmail,
          proposal_id: selectedProposal.job_number,
          duration_hours: durationHours
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send proposal');
      }

      const data: SendProposalResponse = await response.json();
      
      console.log('✅ Email sent successfully!');
      console.log('🔗 Access URL:', data.temp_url);
      console.log('⏰ Expires:', data.expires_at);
      
      showNotification(data.message, 'success');
      
      // Add to sent history
      setSentLinks(prev => [{
        client: {
          id: 'manual',
          email: recipientEmail,
          full_name: recipientEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          company: data.proposal_info?.client_name || 'Manual Entry',
          roles: ['client'],
          is_active: true
        },
        proposal: selectedProposal,
        url: data.temp_url,
        sentAt: new Date().toISOString(),
        expiresAt: data.expires_at
      }, ...prev]);
      
      // Reset form
      setSelectedProposal(null);
      setRecipientEmail('');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send proposal';
      console.error('❌ Send failed:', errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setSending(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Link copied to clipboard!', 'success');
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const quickFillFromClient = (client: Client) => {
    setRecipientEmail(client.email);
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ============================================================================ */}
      {/* HEADER */}
      {/* ============================================================================ */}
      
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
            
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Test Admin Page</h1>
                <p className="text-gray-600 mt-1">Send a test email to your application </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Clients</div>
                <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Proposals</div>
                <div className="text-2xl font-bold text-green-600">{proposals.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================================ */}
      {/* NOTIFICATION */}
      {/* ============================================================================ */}
      
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`rounded-lg p-4 shadow-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================================================ */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ============================================================================ */}
          {/* LEFT COLUMN - FORM */}
          {/* ============================================================================ */}
          
          <div className="space-y-6">
            
         

            {/* Recipient Email Input */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <label className="block text-base font-semibold text-gray-900">
                  Recipient Email *
                </label>
              </div>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient email (e.g., client@company.com)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                Email will be sent from: <strong className="text-gray-700">ifthicaralikhan@gmail.com</strong>
              </p>
            </div>

            {/* Duration Selector */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                Link Expiration
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours (default)</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours (3 days)</option>
                <option value={168}>1 week</option>
              </select>
            </div>

            {/* Select Proposal */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                Select Proposal (Job) *
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {proposals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p>No proposals found</p>
                  </div>
                ) : (
                  proposals.map((proposal) => (
                    <button
                      key={proposal.id}
                      onClick={() => setSelectedProposal(proposal)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedProposal?.id === proposal.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-gray-900">
                              Job #{proposal.job_number}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              proposal.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              proposal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {proposal.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">{proposal.client_name}</div>
                          <div className="text-xs text-gray-500 mt-1">{proposal.venue}</div>
                          <div className="text-sm font-bold text-blue-600 mt-2">
                            {formatCurrency(proposal.total_cost)}
                          </div>
                        </div>
                        {selectedProposal?.id === proposal.id && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ============================================================================ */}
          {/* RIGHT COLUMN - PREVIEW & SEND */}
          {/* ============================================================================ */}
          
          <div className="space-y-6 relative">
            
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Preview
              </h3>
              
              {!selectedProposal ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a proposal to preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Recipient Info */}
                  {recipientEmail && (
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                      <div className="text-sm text-gray-600 mb-1">📧 Email will be sent to:</div>
                      <div className="font-bold text-gray-900 text-lg break-all">
                        {recipientEmail}
                      </div>
                    </div>
                  )}
                  
                  {/* Proposal Info */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">📄 Proposal:</div>
                    <div className="font-bold text-gray-900 text-lg">
                      Job #{selectedProposal.job_number}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {selectedProposal.client_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedProposal.venue}
                    </div>
                    <div className="text-lg font-bold text-green-700 mt-2">
                      {formatCurrency(selectedProposal.total_cost)}
                    </div>
                  </div>
                  
                  {/* Security Info */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-purple-900">
                          🔒 JWT Secure Link
                        </div>
                        <div className="text-xs text-purple-700 mt-1">
                          Link expires in {durationHours} hours
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Cryptographically signed - cannot be modified
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          No database storage - stateless validation
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Template Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 mb-2">📨 Email Content:</div>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>✉️ Subject: <span className="font-medium">Pinnacle Live Proposal #{selectedProposal.job_number}</span></p>
                      <p>👤 From: <span className="font-medium">Pinnacle Live Team</span></p>
                      <p>🎨 Design: Professional white theme with branding</p>
                      <p>🔗 CTA: "VIEW PROPOSAL" button with JWT link</p>
                      <p>📋 Includes: Summary, security notice, company footer</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Send Button - Fixed Position */}
            <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 z-10">
              <button
                onClick={handleSendProposal}
                disabled={!recipientEmail || !selectedProposal || sending}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Proposal via Email
                  </>
                )}
              </button>
              
              {/* Status Message */}
              <div className="text-center text-xs mt-2">
                {!recipientEmail && !selectedProposal && (
                  <p className="text-gray-500">⚠️ Enter email and select proposal</p>
                )}
                {recipientEmail && selectedProposal && !sending && (
                  <p className="text-green-600 font-medium">✅ Ready to send!</p>
                )}
                {sending && (
                  <p className="text-blue-600 font-medium">📧 Generating JWT and sending email...</p>
                )}
              </div>
            </div>

            {/* Sent History */}
            {sentLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-32">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    Recently Sent
                  </span>
                  <span className="text-sm text-gray-500">({sentLinks.length})</span>
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {sentLinks.map((link, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-blue-600 break-all">
                            {link.client.email}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Job #{link.proposal.job_number} • {link.proposal.client_name}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => copyToClipboard(link.url)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openLink(link.url)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>
                          📅 Sent: {new Date(link.sentAt).toLocaleString()}
                        </span>
                        {link.expiresAt && (
                          <span>
                            ⏰ Expires: {new Date(link.expiresAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendProposal;