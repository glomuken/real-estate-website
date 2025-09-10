import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AnalyticsTracker } from "../AnalyticsTracker";
import { 
  Home, 
  TrendingUp, 
  FileSearch, 
  Calculator, 
  Shield, 
  Users, 
  MapPin, 
  Camera,
  Gavel,
  Building,

  CheckCircle,
  ArrowRight
} from "lucide-react";

export function ServicesPage() {
  const mainServices = [
    {
      title: "Property Sales",
      description: "Expert guidance for buying and selling residential and commercial properties",
      icon: Home,
      features: ["Market Analysis", "Professional Photography", "Virtual Tours", "Negotiation Support"],
      popular: true
    },
    {
      title: "Property Investment",
      description: "Strategic investment advice to build your property portfolio",
      icon: TrendingUp,
      features: ["ROI Analysis", "Market Research", "Portfolio Management", "Tax Optimization"],
      popular: false
    },
    {
      title: "Property Valuation",
      description: "Accurate property valuations for sales, insurance, and legal purposes",
      icon: FileSearch,
      features: ["Certified Valuers", "Detailed Reports", "Market Comparisons", "Quick Turnaround"],
      popular: false
    },
    {
      title: "Mortgage & Finance",
      description: "Comprehensive financing solutions and mortgage advisory services",
      icon: Calculator,
      features: ["Bond Origination", "Pre-approval", "Rate Comparison", "Financial Planning"],
      popular: true
    },
    {
      title: "Legal Services",
      description: "Complete legal support for property transactions and compliance",
      icon: Shield,
      features: ["Transfer Documentation", "Due Diligence", "Contract Review", "Compliance"],
      popular: false
    },
    {
      title: "Property Management",
      description: "Full-service property management for landlords and investors",
      icon: Users,
      features: ["Tenant Screening", "Rent Collection", "Maintenance", "Financial Reporting"],
      popular: true
    }
  ];

  const additionalServices = [
    {
      title: "Location Intelligence",
      description: "Detailed area analysis and market insights",
      icon: MapPin
    },
    {
      title: "Professional Photography",
      description: "High-quality property photography and virtual tours",
      icon: Camera
    },
    {
      title: "Auction Services",
      description: "Property auction management and bidding support",
      icon: Gavel
    },
    {
      title: "Commercial Real Estate",
      description: "Specialized services for commercial property transactions",
      icon: Building
    }
  ];

  const process = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We meet to understand your needs and property goals"
    },
    {
      step: "2", 
      title: "Market Analysis",
      description: "Comprehensive analysis of market conditions and opportunities"
    },
    {
      step: "3",
      title: "Strategy Development", 
      description: "Custom strategy tailored to your specific requirements"
    },
    {
      step: "4",
      title: "Implementation",
      description: "Expert execution of your property plan with ongoing support"
    },
    {
      step: "5",
      title: "Follow-up",
      description: "Continued support and guidance even after transaction completion"
    }
  ];

  return (
    <div>
      <AnalyticsTracker page="services" title="Our Services - Rainbow Properties" />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Comprehensive Services</h1>
            <p className="text-xl opacity-90 mb-8">
              From property sales to investment advice, we provide end-to-end real estate solutions 
              to help you achieve your property goals with confidence.
            </p>
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive range of services covers every aspect of your property journey, 
              ensuring you have expert support at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
                  {service.popular && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-orange-500">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="outline">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We follow a proven 5-step process to ensure exceptional results and client satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized services to complement our core offerings and provide complete property solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-orange-100 p-4 rounded-lg w-fit mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Service Areas</h2>
              <p className="text-gray-600 mb-8">
                We proudly serve clients across South Africa's major metropolitan areas and surrounding regions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Gauteng Province</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Johannesburg & Surrounds</li>
                    <li>• Pretoria & Centurion</li>
                    <li>• East Rand</li>
                    <li>• West Rand</li>
                    <li>• Midrand & Sandton</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Western Cape</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Cape Town Metro</li>
                    <li>• Stellenbosch & Surrounds</li>
                    <li>• Paarl & Wellington</li>
                    <li>• Somerset West</li>
                    <li>• Hermanus</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">KwaZulu-Natal</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Durban & eThekwini</li>
                    <li>• Pietermaritzburg</li>
                    <li>• Umhlanga & Ballito</li>
                    <li>• Kloof & Hillcrest</li>
                    <li>• South Coast</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Other Regions</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Port Elizabeth</li>
                    <li>• Bloemfontein</li>
                    <li>• Nelspruit</li>
                    <li>• George & Garden Route</li>
                    <li>• Polokwane</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80" 
                alt="South African cities map" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the service package that best fits your needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Essential</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">1.5%</span>
                  <span className="text-gray-600"> commission</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Property listing on major portals
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Professional photography
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Basic marketing package
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Dedicated agent support
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Choose Essential
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-blue-600 border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-center">Premium</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">2.5%</span>
                  <span className="text-gray-600"> commission</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Essential
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Virtual tour & drone footage
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Enhanced marketing campaign
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Home staging consultation
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Market analysis report
                  </li>
                </ul>
                <Button className="w-full">
                  Choose Premium
                </Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Luxury</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">3.5%</span>
                  <span className="text-gray-600"> commission</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Premium
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Luxury property specialist
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    International marketing
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Concierge services
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Private showing coordination
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Choose Luxury
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and let us help you achieve your property goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Calculator className="w-5 h-5 mr-2" />
              Use Our Calculator
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}