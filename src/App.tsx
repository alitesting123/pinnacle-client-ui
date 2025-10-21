// src/App.tsx - UPDATE THIS FILE

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page imports
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSendProposal from "./pages/AdminSendProposal";
import ProposalView from "./pages/ProposalView";  // ✅ NEW SINGLE ROUTE
import NotFound from "./pages/NotFound";

// ❌ REMOVE THESE IMPORTS:
// import SecureProposal from "./pages/SecureProposal";
// import TempAccess from "./pages/TempAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/send-proposal" element={<AdminSendProposal />} />
          
          {/* ✅ NEW: Single unified proposal route (handles JWT token) */}
          <Route path="/proposal" element={<ProposalView />} />
          
          {/* ❌ REMOVE THESE OLD ROUTES:
          <Route path="/secure/:token" element={<SecureProposal />} />
          <Route path="/temp-access" element={<TempAccess />} />
          */}
          
          {/* 404 - MUST BE LAST! */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;