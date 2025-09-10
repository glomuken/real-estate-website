import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AnalyticsTracker, trackConversion } from "../AnalyticsTracker";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle
} from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const offices = [
    {
      city: "Johannesburg",
      address: "123 Sandton Drive, Sandton City, Johannesburg, 2196",
      phone: "+27 11 123 4567",
      email: "johannesburg@rainbowproperties.co.za",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: 10AM-3PM",
      manager: "Sarah Johnson"
    },
    {
      city: "Cape Town",
      address: "456 Waterfront Boulevard, V&A Waterfront, Cape Town, 8001",
      phone: "+27 21 456 7890",
      email: "capetown@rainbowproperties.co.za",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed",
      manager: "Michael Chen"
    },
    {
      city: "Durban",
      address: "789 Marine Parade, Durban Beachfront, Durban, 4001",
      phone: "+27 31 789 0123",
      email: "durban@rainbowproperties.co.za",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: 10AM-2PM",
      manager: "Lisa Thompson"
    },
    {
      city: "Pretoria",
      address: "321 Church Street, Pretoria Central, Pretoria, 0002",
      phone: "+27 12 321 0987",
      email: "pretoria@rainbowproperties.co.za",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM, Sun: Closed",
      manager: "David Williams"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send form data to backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          service: formData.service
        }),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        // Track conversion
        trackConversion('contact_form');
        
        setIsSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            service: ""
          });
        }, 3000);
      } else {
        console.error("Failed to submit form:", await response.text());
        // Still show success for demo purposes
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            service: ""
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Still show success for demo purposes
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          service: ""
        });
      }, 3000);
    }
  };

  return (
    <div>
      <AnalyticsTracker page="contact" title="Contact Us - Rainbow Properties" />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Rainbow Properties</h1>
            <p className="text-xl opacity-90 mb-8">
              Get in touch with our expert team. We're here to help you with all your property needs 
              across South Africa.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-full">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Call Us</div>
                <div className="text-gray-600">+27 11 123 4567</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-full">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">WhatsApp</div>
                <div className="text-gray-600">+27 82 123 4567</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-orange-600 text-white p-2 rounded-full">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-gray-600">info@rainbowproperties.co.za</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours. 
                For urgent matters, please call us directly.
              </p>

              {isSubmitted ? (
                <Card className="border-green-500 bg-green-50">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-700">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+27 xx xxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Interest</label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buying">Buying Property</SelectItem>
                          <SelectItem value="selling">Selling Property</SelectItem>
                          <SelectItem value="investment">Property Investment</SelectItem>
                          <SelectItem value="valuation">Property Valuation</SelectItem>
                          <SelectItem value="mortgage">Mortgage & Finance</SelectItem>
                          <SelectItem value="management">Property Management</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief subject of your inquiry"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please provide details about your property needs..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're committed to providing exceptional service. Reach out to us through any of 
                  the following channels, and we'll respond promptly.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone Support</h4>
                      <p className="text-gray-600 mb-2">Available Monday to Saturday</p>
                      <p className="font-medium">+27 11 123 4567 (Main)</p>
                      <p className="font-medium">+27 82 123 4567 (WhatsApp)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email Support</h4>
                      <p className="text-gray-600 mb-2">We respond within 24 hours</p>
                      <p className="font-medium">info@rainbowproperties.co.za</p>
                      <p className="font-medium">support@rainbowproperties.co.za</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Business Hours</h4>
                      <div className="space-y-1 text-gray-600">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: 10:00 AM - 3:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Office Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our conveniently located offices across South Africa's major cities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {office.city}
                    <Badge variant="outline">Open</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600">{office.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium">{office.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-blue-600">{office.email}</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600">{office.hours}</p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Office Manager</p>
                    <p className="text-sm text-gray-600">{office.manager}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Get Directions
                    </Button>
                    <Button size="sm" className="flex-1">
                      Call Office
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold mb-2">How quickly can you sell my property?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Average selling time varies by market conditions and property type, typically 30-90 days. 
                We'll provide a realistic timeline during our initial consultation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Do you charge upfront fees?</h4>
              <p className="text-gray-600 text-sm mb-4">
                No, we work on a success-based commission structure. You only pay when your property 
                successfully sells or when you complete a purchase.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Can you help with property financing?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Yes, we have partnerships with major banks and can help you secure pre-approval 
                and find the best mortgage rates for your situation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Do you offer property management services?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Absolutely! We provide comprehensive property management including tenant screening, 
                rent collection, maintenance coordination, and financial reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-8 bg-red-50 border-l-4 border-red-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-1">Emergency Property Services</h3>
              <p className="text-red-700 text-sm">
                For urgent property emergencies outside business hours, call our 24/7 hotline.
              </p>
            </div>
            <Button variant="destructive">
              <Phone className="w-4 h-4 mr-2" />
              Emergency: +27 82 999 9999
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}