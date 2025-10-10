import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, ExternalLink, Shield, Clock, Award } from "lucide-react";
import TermsConditionsCard from "./TermsConditionsCard"; // ADD THIS IMPORT

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/60 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        {/* Existing footer content... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Your existing footer sections */}
        </div>

        {/* ADD THE TERMS CARD HERE - BEFORE THE BOTTOM COPYRIGHT */}
        <div className="mt-12 mb-8">
          <TermsConditionsCard />
        </div>

        {/* Copyright and legal links */}
        <div className="border-t border-border pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} Pinnacle Live. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}