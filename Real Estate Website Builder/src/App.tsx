import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import { AboutPage } from "./components/pages/AboutPage";
import { PropertiesPage } from "./components/pages/PropertiesPage";
import { ServicesPage } from "./components/pages/ServicesPage";
import { ContactPage } from "./components/pages/ContactPage";
import { CalculatorPage } from "./components/pages/CalculatorPage";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { InitialSetup } from "./components/admin/InitialSetup";
import { Toaster } from "./components/ui/sonner";

type PublicPage = "home" | "about" | "properties" | "services" | "contact" | "calculator";
type ViewType = "public" | "admin-login" | "admin-dashboard" | "setup";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("public");
  const [currentPage, setCurrentPage] = useState<PublicPage>("home");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Check URL for routing and stored authentication
  useEffect(() => {
    const path = window.location.pathname;
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedToken && storedUser) {
      setAdminToken(storedToken);
      setAdminUser(JSON.parse(storedUser));
      setIsAdminAuthenticated(true);
      if (path.startsWith("/admin")) {
        setCurrentView("admin-dashboard");
        return;
      }
    } else if (path === "/setup") {
      setCurrentView("setup");
      return;
    } else if (path === "/admin" || path.startsWith("/admin")) {
      setCurrentView("admin-login");
      return;
    }

    // Handle public page routing
    setCurrentView("public");
    switch (path) {
      case "/about":
        setCurrentPage("about");
        break;
      case "/properties":
        setCurrentPage("properties");
        break;
      case "/services":
        setCurrentPage("services");
        break;
      case "/contact":
        setCurrentPage("contact");
        break;
      case "/calculator":
        setCurrentPage("calculator");
        break;
      default:
        setCurrentPage("home");
        break;
    }
  }, []);

  // Navigation handler for public pages
  const handleNavigation = (page: PublicPage) => {
    setCurrentPage(page);
    setCurrentView("public");
    const path = page === "home" ? "/" : `/${page}`;
    window.history.pushState(null, "", path);
  };

  // Handle admin login
  const handleAdminLogin = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminAuthenticated(true);
    setCurrentView("admin-dashboard");
    
    // Store in localStorage for persistence
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    window.history.pushState(null, "", "/admin/dashboard");
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminToken(null);
    setAdminUser(null);
    setCurrentView("public");
    setCurrentPage("home");
    
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    window.history.pushState(null, "", "/");
  };

  // Navigate to admin login
  const navigateToAdmin = () => {
    setCurrentView("admin-login");
    window.history.pushState(null, "", "/admin");
  };

  // Navigate back to site from admin
  const handleBackToSite = () => {
    setCurrentView("public");
    setCurrentPage("home");
    window.history.pushState(null, "", "/");
  };

  if (currentView === "setup") {
    return (
      <>
        <InitialSetup />
        <Toaster />
      </>
    );
  }

  if (currentView === "admin-login") {
    return (
      <>
        <AdminLogin onLogin={handleAdminLogin} />
        <Toaster />
      </>
    );
  }

  if (currentView === "admin-dashboard") {
    return (
      <>
        <AdminDashboard 
          token={adminToken!} 
          user={adminUser} 
          onLogout={handleAdminLogout}
          onBackToSite={handleBackToSite}
        />
        <Toaster />
      </>
    );
  }

  // Render public pages
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage />;
      case "properties":
        return <PropertiesPage />;
      case "services":
        return <ServicesPage />;
      case "contact":
        return <ContactPage />;
      case "calculator":
        return <CalculatorPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onAdminClick={navigateToAdmin}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}