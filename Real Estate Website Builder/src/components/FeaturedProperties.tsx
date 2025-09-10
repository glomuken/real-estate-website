import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Property, getProperties } from "../utils/api";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      // Show only first 6 properties for featured section
      setProperties(data.slice(0, 6));
    } catch (error) {
      console.error('Error loading properties:', error);
      // If there's an error, show empty state but don't crash
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "sold":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "pending":
        return "Pending";
      case "sold":
        return "Sold";
      default:
        return status;
    }
  };

  return (
    <section id="properties" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Featured Properties</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties that offer 
            exceptional value and outstanding features.
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-700 mb-2">No Properties Available</h3>
              <p className="text-gray-500">
                Properties will appear here once they are added to the system.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <ImageWithFallback
                    src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZXxlbnwxfHx8fDE3NTY3MDY5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getStatusColor(property.status)} text-white border-none`}>
                      {formatStatus(property.status)}
                    </Badge>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{property.city}, {property.area || property.location}</span>
                    </div>
                    <div className="text-2xl text-blue-600">{new Intl.NumberFormat('en-ZA', {
                      style: 'currency',
                      currency: 'ZAR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(property.price)}</div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <Bed size={16} className="mr-1" />
                      <span className="text-sm">{property.bedrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Bath size={16} className="mr-1" />
                      <span className="text-sm">{property.bathrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Square size={16} className="mr-1" />
                      <span className="text-sm">{property.sqft || 0}sqft</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}