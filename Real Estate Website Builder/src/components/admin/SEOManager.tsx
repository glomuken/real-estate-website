import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Search, Globe, Eye, Edit3, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface SEOManagerProps {
  token: string;
}

interface SEOData {
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  robots: string;
}

const defaultPages = [
  { id: "home", name: "Home Page", path: "/" },
  { id: "about", name: "About Page", path: "/about" },
  { id: "properties", name: "Properties Page", path: "/properties" },
  { id: "services", name: "Services Page", path: "/services" },
  { id: "contact", name: "Contact Page", path: "/contact" },
  { id: "calculator", name: "Calculator Page", path: "/calculator" }
];

export function SEOManager({ token }: SEOManagerProps) {
  const [seoData, setSeoData] = useState<Record<string, SEOData>>({});
  const [selectedPage, setSelectedPage] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    setIsLoading(true);
    try {
      // Load SEO data from backend
      const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b`;
      const response = await fetch(`${API_BASE_URL}/seo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSeoData(data || getDefaultSEOData());
      } else {
        // Initialize with default data if none exists
        setSeoData(getDefaultSEOData());
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
      setSeoData(getDefaultSEOData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSEOData = (): Record<string, SEOData> => {
    return {
      home: {
        page: "home",
        title: "Rainbow Properties - Your Trusted Property Partner in South Africa",
        description: "Find your dream home with Rainbow Properties. Expert real estate services across South Africa with 15+ years of experience. Browse properties, get market insights, and connect with our professional team.",
        keywords: "real estate, properties, South Africa, homes for sale, property investment, Rainbow Properties",
        ogTitle: "Rainbow Properties - Your Trusted Property Partner",
        ogDescription: "Expert real estate services across South Africa with over 15 years of experience.",
        ogImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/",
        robots: "index, follow"
      },
      about: {
        page: "about",
        title: "About Rainbow Properties - 15+ Years of Real Estate Excellence",
        description: "Learn about Rainbow Properties' journey, our expert team, and our commitment to exceptional real estate service across South Africa since 2008.",
        keywords: "about Rainbow Properties, real estate team, property experts, South Africa real estate company",
        ogTitle: "About Rainbow Properties - Real Estate Excellence",
        ogDescription: "Meet our expert team and learn about our 15+ years of real estate excellence in South Africa.",
        ogImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/about",
        robots: "index, follow"
      },
      properties: {
        page: "properties",
        title: "Properties for Sale - Browse Homes Across South Africa | Rainbow Properties",
        description: "Browse our extensive collection of properties for sale across South Africa. Find houses, apartments, and investment properties with detailed listings and expert guidance.",
        keywords: "properties for sale, homes South Africa, real estate listings, houses for sale, apartments",
        ogTitle: "Properties for Sale - Rainbow Properties",
        ogDescription: "Browse our extensive collection of properties for sale across South Africa.",
        ogImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/properties",
        robots: "index, follow"
      },
      services: {
        page: "services",
        title: "Real Estate Services - Property Buying, Selling & Investment | Rainbow Properties",
        description: "Comprehensive real estate services including property buying, selling, investment advice, market analysis, and property management across South Africa.",
        keywords: "real estate services, property buying, property selling, investment advice, property management",
        ogTitle: "Real Estate Services - Rainbow Properties",
        ogDescription: "Comprehensive real estate services across South Africa including buying, selling, and investment advice.",
        ogImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/services",
        robots: "index, follow"
      },
      contact: {
        page: "contact",
        title: "Contact Rainbow Properties - Get Expert Real Estate Advice Today",
        description: "Contact Rainbow Properties for expert real estate advice. Reach our professional team via phone, email, or visit our offices across South Africa.",
        keywords: "contact Rainbow Properties, real estate contact, property consultation, real estate advice",
        ogTitle: "Contact Rainbow Properties",
        ogDescription: "Get in touch with our expert real estate team for professional property advice and services.",
        ogImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/contact",
        robots: "index, follow"
      },
      calculator: {
        page: "calculator",
        title: "Property Finance Calculator - Mortgage & Affordability Calculator | Rainbow Properties",
        description: "Use our free property finance calculators to estimate mortgage payments, determine affordability, and plan your property purchase in South Africa.",
        keywords: "mortgage calculator, property finance, affordability calculator, bond calculator, home loan calculator",
        ogTitle: "Property Finance Calculator - Rainbow Properties",
        ogDescription: "Free property finance calculators to help you plan your property purchase and estimate payments.",
        ogImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
        canonical: "https://rainbowproperties.co.za/calculator",
        robots: "index, follow"
      }
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b`;
      const response = await fetch(`${API_BASE_URL}/seo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seoData)
      });

      if (response.ok) {
        toast.success('SEO settings saved successfully');
      } else {
        throw new Error('Failed to save SEO settings');
      }
    } catch (error) {
      console.error('Error saving SEO data:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSEOField = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: value
      }
    }));
  };

  const currentPageData = seoData[selectedPage] || getDefaultSEOData()[selectedPage];

  const getSEOScore = (data: SEOData) => {
    let score = 0;
    if (data.title && data.title.length >= 30 && data.title.length <= 60) score += 20;
    if (data.description && data.description.length >= 120 && data.description.length <= 160) score += 20;
    if (data.keywords && data.keywords.length > 0) score += 15;
    if (data.ogTitle && data.ogTitle.length > 0) score += 15;
    if (data.ogDescription && data.ogDescription.length > 0) score += 15;
    if (data.ogImage && data.ogImage.length > 0) score += 15;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO Management</h2>
          <p className="text-gray-600">Manage search engine optimization settings for each page</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Page Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {defaultPages.map((page) => {
              const pageData = seoData[page.id] || getDefaultSEOData()[page.id];
              const score = getSEOScore(pageData);
              
              return (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPage === page.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`w-2 h-2 rounded-full ${getScoreColor(score)}`}></div>
                      <span className="text-xs text-gray-500">{score}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic SEO</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Basic SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={currentPageData?.title || ""}
                      onChange={(e) => updateSEOField("title", e.target.value)}
                      placeholder="Enter page title (30-60 characters)"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Characters: {currentPageData?.title?.length || 0}</span>
                      <span className={currentPageData?.title?.length >= 30 && currentPageData?.title?.length <= 60 ? "text-green-600" : "text-red-600"}>
                        Optimal: 30-60 characters
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea
                      id="description"
                      value={currentPageData?.description || ""}
                      onChange={(e) => updateSEOField("description", e.target.value)}
                      placeholder="Enter meta description (120-160 characters)"
                      rows={3}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Characters: {currentPageData?.description?.length || 0}</span>
                      <span className={currentPageData?.description?.length >= 120 && currentPageData?.description?.length <= 160 ? "text-green-600" : "text-red-600"}>
                        Optimal: 120-160 characters
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={currentPageData?.keywords || ""}
                      onChange={(e) => updateSEOField("keywords", e.target.value)}
                      placeholder="Enter keywords separated by commas"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas. Focus on 3-5 main keywords.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph (Social Media)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={currentPageData?.ogTitle || ""}
                      onChange={(e) => updateSEOField("ogTitle", e.target.value)}
                      placeholder="Social media title (usually same as page title)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogDescription">OG Description</Label>
                    <Textarea
                      id="ogDescription"
                      value={currentPageData?.ogDescription || ""}
                      onChange={(e) => updateSEOField("ogDescription", e.target.value)}
                      placeholder="Social media description"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={currentPageData?.ogImage || ""}
                      onChange={(e) => updateSEOField("ogImage", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optimal size: 1200x630 pixels. This image appears when your page is shared on social media.
                    </p>
                  </div>

                  {currentPageData?.ogImage && (
                    <div>
                      <Label>Image Preview</Label>
                      <img
                        src={currentPageData.ogImage}
                        alt="OG Image Preview"
                        className="w-full max-w-md h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      value={currentPageData?.canonical || ""}
                      onChange={(e) => updateSEOField("canonical", e.target.value)}
                      placeholder="https://rainbowproperties.co.za/page"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The preferred URL for this page to avoid duplicate content issues.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="robots">Robots Meta Tag</Label>
                    <Select
                      value={currentPageData?.robots || "index, follow"}
                      onValueChange={(value) => updateSEOField("robots", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">Index, Follow (Default)</SelectItem>
                        <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                        <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                        <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Controls how search engines crawl and index this page.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    SEO Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">SEO Score</span>
                          <span className="text-sm">{getSEOScore(currentPageData)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreColor(getSEOScore(currentPageData))}`}
                            style={{ width: `${getSEOScore(currentPageData)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Title length (30-60 chars)</span>
                        <Badge variant={currentPageData?.title?.length >= 30 && currentPageData?.title?.length <= 60 ? "default" : "destructive"}>
                          {currentPageData?.title?.length >= 30 && currentPageData?.title?.length <= 60 ? "✓" : "✗"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Description length (120-160 chars)</span>
                        <Badge variant={currentPageData?.description?.length >= 120 && currentPageData?.description?.length <= 160 ? "default" : "destructive"}>
                          {currentPageData?.description?.length >= 120 && currentPageData?.description?.length <= 160 ? "✓" : "✗"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Keywords present</span>
                        <Badge variant={currentPageData?.keywords?.length > 0 ? "default" : "destructive"}>
                          {currentPageData?.keywords?.length > 0 ? "✓" : "✗"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Open Graph image</span>
                        <Badge variant={currentPageData?.ogImage?.length > 0 ? "default" : "destructive"}>
                          {currentPageData?.ogImage?.length > 0 ? "✓" : "✗"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}