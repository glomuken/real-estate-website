import { Card, CardContent } from "./ui/card";
import { Home, Search, FileText, Calculator, Users, Shield } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: Search,
      title: "Property Search",
      description: "Expert assistance in finding your ideal property that matches your requirements and budget.",
      color: "text-blue-600"
    },
    {
      icon: Home,
      title: "Property Sales",
      description: "Professional marketing and sales services to get the best value for your property.",
      color: "text-green-600"
    },
    {
      icon: FileText,
      title: "Rental Management",
      description: "Complete rental property management including tenant screening and maintenance.",
      color: "text-orange-600"
    },
    {
      icon: Calculator,
      title: "Property Valuation",
      description: "Accurate property valuations for buying, selling, insurance, or investment purposes.",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Investment Advice",
      description: "Strategic guidance for property investment opportunities and portfolio management.",
      color: "text-teal-600"
    },
    {
      icon: Shield,
      title: "Legal Support",
      description: "Professional legal assistance throughout the property transaction process.",
      color: "text-red-600"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive real estate services designed to meet all your property needs. 
            From buying and selling to investment and management.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 group-hover:scale-110 transition-transform ${service.color}`}>
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}