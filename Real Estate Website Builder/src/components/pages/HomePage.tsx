import { HeroSection } from "../HeroSection";
import { FeaturedProperties } from "../FeaturedProperties";
import { AnalyticsTracker } from "../AnalyticsTracker";

export function HomePage() {
  return (
    <div>
      <AnalyticsTracker page="home" title="Rainbow Properties - Premium Real Estate in South Africa" />
      <HeroSection />
      <FeaturedProperties />
      
      {/* Additional Home Page Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Rainbow Properties?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              With over 15 years of experience in the South African property market, we provide 
              expert guidance and personalized service to help you find your perfect home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Expertise</h3>
              <p className="text-gray-600">
                Our team of certified agents provides professional guidance throughout your property journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Knowledge</h3>
              <p className="text-gray-600">
                Deep understanding of neighborhoods, market trends, and property values across South Africa.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
              <p className="text-gray-600">
                Tailored solutions that match your specific needs, budget, and lifestyle preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Market Insights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">South African Property Market Insights</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-1">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Growing Demand</h4>
                    <p className="text-gray-600">Increased interest in suburban and coastal properties post-pandemic.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-1">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Stable Investment</h4>
                    <p className="text-gray-600">Property remains a solid long-term investment option in South Africa.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-1">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">First-Time Buyers</h4>
                    <p className="text-gray-600">Government incentives and low interest rates support new homeowners.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                alt="Modern house exterior" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}