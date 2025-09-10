import { Button } from "./ui/button";
import { Phone, Mail, Menu, X, Calculator, Settings } from "lucide-react";
import { useState } from "react";

type PublicPage = "home" | "about" | "properties" | "services" | "contact" | "calculator";

interface HeaderProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onAdminClick: () => void;
}

export function Header({ currentPage, onNavigate, onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: PublicPage) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const isActivePage = (page: PublicPage) => currentPage === page;

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+27 11 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>info@rainbowproperties.co.za</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>Your Trusted Property Partner</span>
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                title="Admin Login"
              >
                <Settings size={14} />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick("home")}
            className="flex items-center"
          >
            <div className="text-2xl font-bold text-primary">
              <span className="text-blue-600">Rainbow</span>
              <span className="text-orange-500">Properties</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick("home")}
              className={`hover:text-primary transition-colors ${isActivePage("home") ? "text-primary font-medium" : ""}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick("properties")}
              className={`hover:text-primary transition-colors ${isActivePage("properties") ? "text-primary font-medium" : ""}`}
            >
              Properties
            </button>
            <button 
              onClick={() => handleNavClick("about")}
              className={`hover:text-primary transition-colors ${isActivePage("about") ? "text-primary font-medium" : ""}`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick("services")}
              className={`hover:text-primary transition-colors ${isActivePage("services") ? "text-primary font-medium" : ""}`}
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick("contact")}
              className={`hover:text-primary transition-colors ${isActivePage("contact") ? "text-primary font-medium" : ""}`}
            >
              Contact
            </button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavClick("calculator")}
              className={`flex items-center gap-2 ${isActivePage("calculator") ? "bg-accent" : ""}`}
            >
              <Calculator size={16} />
              Calculator
            </Button>
            <Button variant="outline" size="sm">
              List Property
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavClick("home")}
                className={`text-left hover:text-primary transition-colors ${isActivePage("home") ? "text-primary font-medium" : ""}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick("properties")}
                className={`text-left hover:text-primary transition-colors ${isActivePage("properties") ? "text-primary font-medium" : ""}`}
              >
                Properties
              </button>
              <button 
                onClick={() => handleNavClick("about")}
                className={`text-left hover:text-primary transition-colors ${isActivePage("about") ? "text-primary font-medium" : ""}`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick("services")}
                className={`text-left hover:text-primary transition-colors ${isActivePage("services") ? "text-primary font-medium" : ""}`}
              >
                Services
              </button>
              <button 
                onClick={() => handleNavClick("contact")}
                className={`text-left hover:text-primary transition-colors ${isActivePage("contact") ? "text-primary font-medium" : ""}`}
              >
                Contact
              </button>
              <button 
                onClick={() => handleNavClick("calculator")}
                className={`text-left flex items-center gap-2 hover:text-primary transition-colors ${isActivePage("calculator") ? "text-primary font-medium" : ""}`}
              >
                <Calculator size={16} />
                Calculator
              </button>
              <Button variant="outline" size="sm" className="w-fit">
                List Property
              </Button>
              <button
                onClick={() => {
                  onAdminClick();
                  setIsMenuOpen(false);
                }}
                className="text-left flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Settings size={16} />
                Admin Login
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}