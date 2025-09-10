import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Share2, Facebook, Twitter, Linkedin, Copy, CheckCheck } from "lucide-react";

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  className?: string;
}

interface SEOData {
  siteName?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  twitterImage?: string;
}

export function SocialShare({ 
  title, 
  description, 
  url = window.location.href, 
  imageUrl,
  className = "" 
}: SocialShareProps) {
  const [seoData, setSEOData] = useState<SEOData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch SEO data on component mount
  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        // Note: This would work if we had the projectId and publicAnonKey available
        // For now, we'll skip the API call and use defaults
        // const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/seo`, {
        //   headers: {
        //     'Authorization': `Bearer ${publicAnonKey}`,
        //   },
        // });
        // if (response.ok) {
        //   const data = await response.json();
        //   setSEOData(data);
        // }
        
        // Use default SEO data for now
        setSEOData({
          siteName: "Rainbow Properties",
          title: "Rainbow Properties - Premium Real Estate in South Africa",
          description: "Discover premium properties with Rainbow Properties - your trusted real estate partner.",
          ogImage: "",
          twitterImage: ""
        });
      } catch (error) {
        console.error('Failed to fetch SEO data for sharing:', error);
      }
    };

    fetchSEOData();
  }, []);

  // Use provided data or fallback to SEO data
  const shareTitle = title || seoData?.title || "Rainbow Properties - Premium Real Estate";
  const shareDescription = description || seoData?.description || "Discover premium properties with Rainbow Properties - your trusted real estate partner.";
  const shareImage = imageUrl || seoData?.ogImage || "";
  const siteName = seoData?.siteName || "Rainbow Properties";

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedDescription = encodeURIComponent(shareDescription);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=RainbowProps`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=600');
    }
    
    // Track sharing event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'property',
        item_id: url
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      console.log("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Failed to share");
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNativeShare}
        className={className}
      >
        <Share2 size={16} className="mr-2" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this property</DialogTitle>
          </DialogHeader>
          
          {/* Preview Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex gap-3">
                {shareImage && (
                  <img 
                    src={shareImage} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{shareTitle}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {shareDescription}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{siteName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="justify-start"
            >
              <Facebook size={16} className="mr-2 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="justify-start"
            >
              <Twitter size={16} className="mr-2 text-sky-500" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="justify-start"
            >
              <Linkedin size={16} className="mr-2 text-blue-700" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="justify-start"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="mr-2 text-green-600"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </Button>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <div className="flex-1 p-2 bg-gray-100 rounded text-sm truncate">
              {url}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <CheckCheck size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}