import React from 'react';
import { Target, LineChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const AboutUs = () => {
    const navigate = useNavigate()
  return (
    <section className="bg-green-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-6">About Us</h1>
        
        <p className="text-center text-slate-700 max-w-3xl mx-auto mb-16">
          The two things, educating people about the significance of health and wellness in today's
          busy lifestyle besides serving our clients with the best holistic approach.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Logo Section */}
          <div className="bg-white rounded-lg shadow-lg p-12 flex items-center justify-center">
              <img 
                    src="/logo.png" 
                    alt="Home Hero Section" 
                    className="rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                />
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Why We Do What We Do</h2>
              <p className="text-slate-600">
                With time people are realizing the value of qualitative living and are striving for it. 
                But its wholeness lies in adapting the well-thy lifestyle and continuing to live with 
                such accompaniment. At Livin Significant, we are focused on empowering individuals to 
                take control of their well-being and building such well-thy communities round the globe.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <LineChart className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">Vision</h3>
                  <p className="text-slate-600">A world where individuals embrace a holistic approach to health, 
                    recognizing the interconnectedness of mind, body, and soul.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">Mission</h3>
                  <p className="text-slate-600">Our mission is to educate, inspire, and guide people toward a 
                    balanced lifestyle that promotes wellness and vitality.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">Team</h3>
                  <p className="text-slate-600">5+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="text-center mt-2">
            <p className="mt-5 text-sm text-center text-gray-500">
                <Link to="/" className="text-primary-500 hover:underline">← Back to Home</Link>
            </p>
        </div>
    </section>
  );
};

export default AboutUs;