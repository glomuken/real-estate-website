import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Home, Image, BarChart3, Settings, LogOut, Search, ArrowLeft, MessageSquare } from "lucide-react";
import { PropertyManager } from "./PropertyManager";
import { ImageManager } from "./ImageManager";
import { DashboardStats } from "./DashboardStats";
import { SEOManager } from "./SEOManager";
import { SiteSettings } from "./SiteSettings";
import { CommunicationPanel } from "./CommunicationPanel";

interface AdminDashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
  onBackToSite?: () => void;
}

export function AdminDashboard({ token, user, onLogout, onBackToSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleBackToSite = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      // Fallback: navigate to home page
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl">
                <span className="text-blue-600">Rainbow</span>
                <span className="text-orange-500">Properties</span>
                <span className="text-gray-600 ml-2">Admin</span>
              </h1>
              {user && (
                <span className="text-sm text-gray-500">
                  Welcome, {user.user_metadata?.name || user.email}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleBackToSite}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Site
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home size={16} />
              Properties
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image size={16} />
              Images
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Messages
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search size={16} />
              SEO
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats token={token} />
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManager token={token} />
          </TabsContent>

          <TabsContent value="images">
            <ImageManager token={token} />
          </TabsContent>

          <TabsContent value="communications">
            <CommunicationPanel token={token} />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager token={token} />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettings token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}