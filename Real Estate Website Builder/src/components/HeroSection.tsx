import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, Home, Banknote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { searchProperties } from "../utils/api";
import { toast } from "sonner";

export function HeroSection() {
  const [searchParams, setSearchParams] = useState({
    location: "",
    type: "",
    priceRange: "",
    bedrooms: ""
  });
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    
    try {
      // Parse price range
      let minPrice: number | undefined;
      let maxPrice: number | undefined;
      
      if (searchParams.priceRange) {
        switch (searchParams.priceRange) {
          case "0-500k":
            minPrice = 0;
            maxPrice = 500000;
            break;
          case "500k-1m":
            minPrice = 500000;
            maxPrice = 1000000;
            break;
          case "1m-2m":
            minPrice = 1000000;
            maxPrice = 2000000;
            break;
          case "2m-5m":
            minPrice = 2000000;
            maxPrice = 5000000;
            break;
          case "5m+":
            minPrice = 5000000;
            break;
        }
      }

      const results = await searchProperties({
        location: searchParams.location || undefined,
        type: searchParams.type || undefined,
        minPrice,
        maxPrice,
        bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined
      });

      // For now, just show results count
      toast.success(`Found ${results.length} matching properties`);
      
      // In a real app, you would navigate to a results page or update the properties list
      console.log('Search results:', results);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NjcwNjk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern luxury house"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Hero Content */}
          <div className="text-white mb-12">
            <h1 className="text-4xl md:text-6xl mb-6 font-bold leading-tight">
              Find Your
              <span className="block">
                <span className="text-blue-400">Dream</span> 
                <span className="text-orange-400"> Home</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl">
              Discover exceptional properties with Rainbow Properties. 
              Your journey to the perfect home starts here.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  Location
                </label>
                <Input 
                  placeholder="City, Area, or Suburb"
                  className="border-gray-300"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <Home size={16} />
                  Property Type
                </label>
                <Select value={searchParams.type} onValueChange={(value) => setSearchParams(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <Banknote size={16} />
                  Price Range
                </label>
                <Select value={searchParams.priceRange} onValueChange={(value) => setSearchParams(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500k">Under R500k</SelectItem>
                    <SelectItem value="500k-1m">R500k - R1M</SelectItem>
                    <SelectItem value="1m-2m">R1M - R2M</SelectItem>
                    <SelectItem value="2m-5m">R2M - R5M</SelectItem>
                    <SelectItem value="5m+">R5M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bedrooms</label>
                <Select value={searchParams.bedrooms} onValueChange={(value) => setSearchParams(prev => ({ ...prev, bedrooms: value }))}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={handleSearch}
              disabled={searching}
            >
              <Search className="mr-2" size={20} />
              {searching ? "Searching..." : "Search Properties"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}