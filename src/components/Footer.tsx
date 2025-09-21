import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, ExternalLink, Shield, Clock, Award } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/60 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/pinncle_log_tm.png" 
                alt="Pinnacle Live" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premier event production company specializing in corporate events, conferences, and live entertainment. 
              Delivering exceptional audiovisual experiences since 2010.
            </p>
          
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">(555) 123-4567</p>
                  <p className="text-xs text-muted-foreground">24/7 Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">info@pinnaclelive.com</p>
                  <p className="text-xs text-muted-foreground">General Inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dallas, Texas</p>
                  <p className="text-xs text-muted-foreground">Serving Nationwide</p>
                </div>
              </div>
            </div>
          </div>

     
          {/* Support & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Mon-Fri: 8AM-8PM CST</span>
              </div>
            
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
}