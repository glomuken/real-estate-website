import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Bed, Bath, Square, Search, Filter, Heart } from "lucide-react";
import { SocialShare } from "../SocialShare";
import { AnalyticsTracker, trackPropertyInteraction } from "../AnalyticsTracker";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  city?: string;
  area?: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  images: string[];
  features?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Only fetch from API if we have valid project configuration
        if (projectId && projectId !== 'your-project-id' && publicAnonKey && publicAnonKey !== 'your-anon-key') {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/properties`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            const fetchedProperties = data.properties || [];
            setProperties(fetchedProperties);
            setFilteredProperties(fetchedProperties);
            
            // Extract unique locations and types for dropdowns
            const locations = [...new Set(fetchedProperties.map((p: Property) => p.city || p.area).filter(Boolean))];
            const types = [...new Set(fetchedProperties.map((p: Property) => p.type).filter(Boolean))];
            setAvailableLocations(locations);
            setAvailableTypes(types);
          } else {
            console.log('API not configured, using demo data');
            setProperties([]);
            setFilteredProperties([]);
          }
        } else {
          console.log('Supabase not configured, using demo data');
          // Set empty for now - in a real app you might want some demo data
          setProperties([]);
          setFilteredProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Sort properties
  const sortProperties = (properties: Property[], sortType: string) => {
    const sorted = [...properties];
    
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'area':
        return sorted.sort((a, b) => (b.sqft || 0) - (a.sqft || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  // Filter and sort properties based on search criteria
  const handleSearch = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.area?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(property => property.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        property.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        property.area?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(val => parseInt(val.replace(/,/g, "")));
      filtered = filtered.filter(property => {
        return property.price >= min && (max ? property.price <= max : true);
      });
    }

    // Apply sorting
    filtered = sortProperties(filtered, sortBy);
    setFilteredProperties(filtered);
  };

  // Re-filter when properties or sort changes
  useEffect(() => {
    if (properties.length > 0) {
      handleSearch();
    }
  }, [properties, sortBy]);

  const handleFavorite = (propertyId: string, propertyPrice: number) => {
    trackPropertyInteraction('favorite', propertyId, propertyPrice);
    // Here you could add logic to save to favorites
  };

  const handleShare = (propertyId: string, propertyPrice: number) => {
    trackPropertyInteraction('share', propertyId, propertyPrice);
  };

  const handleContact = (propertyId: string, propertyPrice: number) => {
    trackPropertyInteraction('contact', propertyId, propertyPrice);
    // Here you could open a contact modal or redirect to contact page
  };

  return (
    <div className="py-8">
      <AnalyticsTracker page="properties" title="Property Listings - Rainbow Properties" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-xl opacity-90">
              Discover the perfect home from our extensive collection of premium properties
            </p>
          </div>
          
          {/* Search Filters */}
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4 mb-4">
              <Input
                placeholder="Search location or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-900"
              />
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {availableLocations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-1500000">Under R1.5M</SelectItem>
                  <SelectItem value="1500000-3000000">R1.5M - R3M</SelectItem>
                  <SelectItem value="3000000-5000000">R3M - R5M</SelectItem>
                  <SelectItem value="5000000-">Above R5M</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
              <p className="text-gray-600">{filteredProperties.length} properties found</p>
            </div>
            <div className="flex gap-4 items-center">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area">Area Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const propertyImage = property.images && property.images.length > 0 
                  ? property.images[0] 
                  : "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80";
                
                const propertyUrl = `${window.location.origin}/property/${property.id}`;
                
                return (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback
                        src={propertyImage} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          variant={property.status === "available" ? "default" : "secondary"}
                          className={property.status === "available" ? "bg-green-600" : ""}
                        >
                          {property.status === "available" ? "For Sale" : property.status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <SocialShare
                          title={property.title}
                          description={property.description}
                          url={propertyUrl}
                          imageUrl={propertyImage}
                          className="bg-white/90 p-1 rounded"
                        />
                      </div>
                      <button 
                        onClick={() => handleFavorite(property.id, property.price)}
                        className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{property.sqft ? `${property.sqft} sqft` : 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          variant="outline"
                          onClick={() => {
                            trackPropertyInteraction('view', property.id, property.price);
                            // Navigate to property detail page
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleContact(property.id, property.price)}
                        >
                          Contact Agent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-gray-600">
                {properties.length === 0 
                  ? "Properties will appear here when the backend is connected"
                  : "Try adjusting your search criteria"
                }
              </p>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredProperties.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}