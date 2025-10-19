// src/pages/AdminSendProposal.tsx
import React, { useState, useEffect } from 'react';
import { Send, Users, FileText, Check, AlertCircle, Loader2, Mail, Clock, Copy } from 'lucide-react';

interface Client {
  id: string;
  email: string;
  full_name: string;
  company: string;
  department?: string;
  roles: string[];
  is_active: boolean;
  has_logged_in: boolean;
}

interface Proposal {
  id: string;
  job_number: string;
  client_name: string;
  venue: string;
  total_cost: number;
  status: string;
  start_date?: string;
  end_date?: string;
  client_email?: string;
}

interface SentLink {
  client: Client;
  proposal: Proposal;
  url: string;
  sentAt: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const AdminSendProposal = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [adminEmail, setAdminEmail] = useState('ifthikarali20@gmail.com'); // Pre-filled sender
  const [recipientEmail, setRecipientEmail] = useState(''); // Manual email input
  
  const [notification, setNotification] = useState<Notification | null>(null);
  const [sentLinks, setSentLinks] = useState<SentLink[]>([]);

  const API_BASE = 'http://localhost:8000/api/v1';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [clientsRes, proposalsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/approved-users`),
        fetch(`${API_BASE}/proposals`)
      ]);
      
      const clientsData = await clientsRes.json();
      const proposalsData = await proposalsRes.json();
      
      // Filter only clients from approved users
      const clientUsers = Array.isArray(clientsData) 
        ? clientsData.filter((user: Client) => user.roles.includes('client'))
        : [];
      
      setClients(clientUsers);
      
      // Handle different proposal response formats
      const proposalsList = proposalsData.proposals || proposalsData || [];
      setProposals(Array.isArray(proposalsList) ? proposalsList : []);
      
    } catch (error) {
      showNotification('Failed to load data', 'error');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendProposal = async () => {
    // Use manual email input if provided, otherwise use selected client's email
    const emailToSend = recipientEmail || selectedClient?.email;
    
    if (!emailToSend || !selectedProposal || !adminEmail) {
      showNotification('Please provide recipient email, select a proposal, and enter your email', 'error');
      return;
    }

    setSending(true);
    
    try {
      const response = await fetch(`${API_BASE}/admin/send-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_email: emailToSend,  // Can be any email
          proposal_id: selectedProposal.job_number,
          admin_email: adminEmail,
          session_duration_minutes: 20
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send proposal');
      }

      const data = await response.json();
      
      showNotification(data.message, 'success');
      
      // Add to sent history
      setSentLinks(prev => [{
        client: selectedClient || {
          id: 'manual',
          email: emailToSend,
          full_name: data.client_name || emailToSend.split('@')[0],
          company: data.proposal_info?.client_name || 'Manual Entry',
          department: '',
          roles: ['client'],
          is_active: true,
          has_logged_in: false
        },
        proposal: selectedProposal,
        url: data.temp_url,
        sentAt: new Date().toISOString()
      }, ...prev]);
      
      // Reset form
      setSelectedClient(null);
      setSelectedProposal(null);
      setRecipientEmail('');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send proposal';
      showNotification(errorMessage, 'error');
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Link copied to clipboard!', 'success');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Send Proposal to Client</h1>
              <p className="text-gray-600 mt-1">Generate and email secure proposal links</p>
            </div>
            <div className="flex gap-4">
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

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`rounded-lg p-4 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? 
                <Check className="w-5 h-5" /> : 
                <AlertCircle className="w-5 h-5" />
              }
              <span>{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Form */}
          <div className="space-y-6">
            
            {/* Instructions Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                How to Send
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Enter recipient's email (any email - even ali2@gmail.com for testing)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Select a proposal/job from the list</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Click "Send Proposal via Email"</span>
                </li>
              </ol>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  ✉️ All emails sent from: <strong>{adminEmail}</strong>
                </p>
              </div>
            </div>

            {/* Recipient Email Input - PRIMARY */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <label className="block text-base font-semibold text-gray-900">
                  Who should receive this proposal? *
                </label>
              </div>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  setSelectedClient(null); // Clear client selection when typing
                }}
                placeholder="Enter recipient email (e.g., ali2@gmail.com)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Testing:</strong> Use ali2@gmail.com to receive the email in your test inbox
                </p>
              </div>
              
              {/* Show selected client email if any */}
              {selectedClient && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800">
                    ✓ Using email from selected client: <strong>{selectedClient.email}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Quick Select from Pre-Approved Clients */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Or Quick Select Client
                </label>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {clients.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">No pre-approved clients</p>
                  </div>
                ) : (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setRecipientEmail(''); // Clear manual input
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedClient?.id === client.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{client.full_name}</div>
                          <div className="text-xs text-blue-600 font-medium">{client.email}</div>
                          {client.company && (
                            <div className="text-xs text-gray-500 mt-0.5">{client.company}</div>
                          )}
                        </div>
                        {selectedClient?.id === client.id && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Select Proposal - REQUIRED */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
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

          {/* Right Column - Preview & Send */}
          <div className="space-y-6">
            
            {/* Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Email</h3>
              
              {!selectedProposal ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a proposal/job to preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recipient Info */}
                  {(recipientEmail || selectedClient) && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">📧 Sending to:</div>
                      <div className="font-medium text-gray-900">
                        {recipientEmail || selectedClient?.email}
                      </div>
                      {selectedClient && (
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedClient.full_name} • {selectedClient.company}
                        </div>
                      )}
                      {recipientEmail && !selectedClient && (
                        <div className="text-xs text-gray-500 mt-1">
                          💡 Test email (not a pre-approved client)
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Proposal Info */}
                  {selectedProposal && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">📄 Proposal/Job:</div>
                      <div className="font-bold text-gray-900 text-lg">
                        Job #{selectedProposal.job_number}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        Client: {selectedProposal.client_name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Venue: {selectedProposal.venue}
                      </div>
                      <div className="text-lg font-bold text-green-700 mt-2">
                        {formatCurrency(selectedProposal.total_cost)}
                      </div>
                    </div>
                  )}
                  
                  {/* Sender Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">✉️ From:</div>
                    <div className="font-medium text-gray-900">{adminEmail}</div>
                    <div className="text-xs text-gray-500 mt-1">(All emails sent from this address)</div>
                  </div>

                  {/* Session Info */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          🔒 Secure 20-minute access link
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Client can extend by 10 minutes if needed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendProposal}
              disabled={!(recipientEmail || selectedClient) || !selectedProposal || sending}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
            
            {/* Helper Text */}
            <div className="text-center text-xs text-gray-500">
              {!(recipientEmail || selectedClient) && !selectedProposal && (
                <p>⚠️ Please enter recipient email and select a proposal</p>
              )}
              {!(recipientEmail || selectedClient) && selectedProposal && (
                <p>⚠️ Please enter recipient email or select a client</p>
              )}
              {(recipientEmail || selectedClient) && !selectedProposal && (
                <p>⚠️ Please select a proposal/job to send</p>
              )}
              {(recipientEmail || selectedClient) && selectedProposal && (
                <p>✅ Ready to send! Click the button above</p>
              )}
            </div>

            {/* Sent History */}
            {sentLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recently Sent ({sentLinks.length})
                </h3>
                <div className="space-y-3">
                  {sentLinks.slice(0, 3).map((link, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{link.client.full_name}</div>
                          <div className="text-xs text-gray-500">#{link.proposal.job_number}</div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Sent: {new Date(link.sentAt).toLocaleString()}
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