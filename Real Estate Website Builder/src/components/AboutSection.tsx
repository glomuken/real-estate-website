import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Award, Users, Home, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AboutSection() {
  const stats = [
    {
      icon: Home,
      number: "500+",
      label: "Properties Sold",
      color: "text-blue-600"
    },
    {
      icon: Users,
      number: "1,200+",
      label: "Happy Clients",
      color: "text-green-600"
    },
    {
      icon: Award,
      number: "15+",
      label: "Years Experience",
      color: "text-orange-600"
    },
    {
      icon: TrendingUp,
      number: "R2.5B+",
      label: "Property Value",
      color: "text-purple-600"
    }
  ];

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl mb-6">
              About Rainbow Properties
            </h2>
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                For over 15 years, Rainbow Properties has been South Africa's 
                trusted partner in real estate. We pride ourselves on delivering 
                exceptional service and helping our clients find their perfect homes.
              </p>
              <p>
                Our team of experienced professionals understands the local market 
                intimately and works tirelessly to ensure every transaction is smooth, 
                transparent, and successful. Whether you're buying, selling, or renting, 
                we're here to guide you every step of the way.
              </p>
              <p>
                From luxury estates to first-time buyer homes, we have the expertise 
                and network to meet all your property needs across South Africa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Learn More About Us
              </Button>
              <Button variant="outline">
                Meet Our Team
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwb2ZmaWNlJTIwdGVhbXxlbnwxfHx8fDE3NTY3MzcxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Rainbow Properties Team"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-2xl">15+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                    <stat.icon size={32} />
                  </div>
                  <div className="text-3xl mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}