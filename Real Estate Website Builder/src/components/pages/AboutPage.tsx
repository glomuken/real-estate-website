import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Award, Users, Home, Clock, CheckCircle, Quote } from "lucide-react";
import { AnalyticsTracker } from "../AnalyticsTracker";

export function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Managing Director",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
      specialization: "Luxury Properties"
    },
    {
      name: "Michael Chen",
      role: "Senior Sales Agent",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      specialization: "Commercial Real Estate"
    },
    {
      name: "Lisa Thompson",
      role: "Property Consultant",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      specialization: "First-Time Buyers"
    },
    {
      name: "David Williams",
      role: "Investment Specialist",
      experience: "10+ years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      specialization: "Property Investment"
    }
  ];

  const achievements = [
    { number: "1500+", label: "Properties Sold", icon: Home },
    { number: "15", label: "Years Experience", icon: Clock },
    { number: "50+", label: "Team Members", icon: Users },
    { number: "20+", label: "Industry Awards", icon: Award }
  ];

  const values = [
    {
      title: "Integrity",
      description: "We conduct business with honesty, transparency, and ethical practices in every interaction.",
      icon: CheckCircle
    },
    {
      title: "Excellence",
      description: "We strive for exceptional service quality and go above and beyond client expectations.",
      icon: Award
    },
    {
      title: "Innovation",
      description: "We embrace technology and modern solutions to enhance the property buying experience.",
      icon: Users
    },
    {
      title: "Community",
      description: "We're committed to contributing positively to the communities we serve across South Africa.",
      icon: Home
    }
  ];

  return (
    <div>
      <AnalyticsTracker page="about" title="About Us - Rainbow Properties" />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">About Rainbow Properties</h1>
            <p className="text-xl leading-relaxed mb-8 opacity-90">
              For over 15 years, we've been South Africa's trusted partner in real estate, 
              helping thousands of families find their perfect homes and make smart property investments.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary">
                Meet Our Team
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Rainbow Properties was founded in 2008 with a simple mission: to make the property 
                  buying and selling process transparent, efficient, and stress-free for all South Africans.
                </p>
                <p>
                  Starting as a small family business in Johannesburg, we've grown into one of the 
                  country's most respected real estate agencies, with offices in major cities including 
                  Cape Town, Durban, and Pretoria.
                </p>
                <p>
                  Our success is built on understanding that buying or selling a property is one of 
                  life's most significant decisions. That's why we combine cutting-edge technology 
                  with personalized service to deliver exceptional results for every client.
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-700 italic">
                    "To empower every South African with the knowledge, tools, and support they need 
                    to make confident property decisions that enhance their lives and build wealth for the future."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" 
                alt="Rainbow Properties office" 
                className="rounded-lg shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80" 
                alt="Team meeting" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and the trust our clients place in us.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{achievement.number}</div>
                  <div className="text-gray-600">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our relationships with clients and communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Expert Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to providing you with exceptional service 
              and expert guidance throughout your property journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600">{member.experience}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">Specializes in {member.specialization}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact {member.name.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud to be recognized by industry leaders and clients for our commitment to excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Estate Agency of the Year</h3>
                <p className="text-gray-600 mb-2">South African Property Awards 2023</p>
                <Badge variant="outline">Winner</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Customer Service Excellence</h3>
                <p className="text-gray-600 mb-2">National Business Awards 2023</p>
                <Badge variant="outline">Gold</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Top Residential Agency</h3>
                <p className="text-gray-600 mb-2">Property Professional Awards 2022</p>
                <Badge variant="outline">Platinum</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work with Us?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Experience the Rainbow Properties difference. Let our expert team help you 
            achieve your property goals with confidence and peace of mind.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Contact Our Team
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              View Our Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}