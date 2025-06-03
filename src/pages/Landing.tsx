
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "../App.css"

import {
  CheckIcon,
  ArrowRight,
  Users,
  LayoutDashboard,
  Settings,
  BriefcaseMedical,
  HeartPulse,
  PersonStanding,
  BicepsFlexed
} from "lucide-react";
import MarqueeDemo from "@/components/Testimonials";
import FullStackFlowchart from "./FlowChart";
import ServicesSection from "@/components/Features";
import FeaturesSection from "@/components/Services";
import OurTeamSection from "@/components/Team";
import PackagesSection from "@/components/PackageSection";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <a
        href="https://wa.me/919398036704?text=Hello%20I%20am%20from%20livinsignificant%20site%20can%20we%20please%20talk%20about%20the%20process%20"
        className="whatsapp-float"
        target="_blank"
      >
        <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp Chat" />
      </a>

      <section id="home" className="hero-gradient pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-center md:justify-center gap-32">
            {/* Text Section */}
            <div className="md:w-1/2 mt-10 md:mt-0 md:pr-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your Personal
                <span className="gradient-text block">Nutrition Journey</span>
                Starts Here
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Connect with expert nutritionists, track your progress, and achieve
                your health goals with our comprehensive nutrition platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/login">
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-lg text-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-6 rounded-lg text-lg">
                    Get in touch
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center md:justify-start space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">10+</span> active users
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="order-1 md:order-2 flex justify-center">
              <img
                src="mainph2.png"
                alt="Hero Visual"
                className="max-w-full md:max-w-lg lg:max-w-xl rounded-2xl shadow-sm object-contain"
              />
            </div>
          </div>
        </div>
      </section>

       <section id="testimonials" className="py-20 bg-gray-50">
        <div className="w-full mx-auto px-4">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Health Professionals</h2> */}
             <h2 className="text-4xl font-bold text-black mb-6">
            Trusted by{' '}
            <span className="text-primary-500">
              Health Professionals
            </span>
          </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about their experience with our nutrition platform.
            </p>
          </div>
          <MarqueeDemo />
        </div>
      </section>

      
      <FeaturesSection/>

      <ServicesSection/>

      <PackagesSection/>

      {/* <FullStackFlowchart /> */}



     

      <OurTeamSection />
      {/* <FullStackFlowchart/> */}
      {/* CTA Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary-500 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join our platform today and transform how you manage nutrition services.
              Whether you're an admin, nutritionist, or client, we have the tools for you.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-6 rounded-lg text-lg">
                Signup Now
              </Button>
            </Link>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default Landing;
