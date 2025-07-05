import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800 px-6 py-16 max-w-5xl mx-auto space-y-16">
      
      {/* Tagline */}
      <div className="h-screen">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-green-600 font-semibold text-xl">India’s most happening Wellness Startup</h2>
            <p className="text-3xl font-bold">Building a global movement of well-thy communities</p>
          </motion.div>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 items-center mt-20"
          >
            <img src="logo.png" alt="Wellness" className="rounded-2xl shadow-md" />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Welcome to Livin Significant</h3>
              <p>
                Your partner in achieving optimal health and a well-thy lifestyle through personalized science-based wellness coaching.
              </p>
              <p>
                Our expert nutritionists help you break out of your sedentary lifestyle with personalized guidance on eating habits, sleep, exercise, and lifestyle improvements — all at the most affordable prices.
              </p>
            </div>
          </motion.div>
      </div>

      {/* Why we do what we do */}
      <div className="h-screen">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-3xl font-bold text-center text-green-600 mb-12">Why We Do What We Do</h3>
            <p >
              People are realizing the value of qualitative living. At Livin Significant, we empower individuals to take control of their health, leading to greater longevity and vitality.
            </p>
            <p>
              We primarily focus on educating people about the significance of health and wellness in today’s busy lifestyle, while serving clients with the best holistic approach.
            </p>
          </motion.div>

          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-8 mt-20"
          >
            <div className="space-y-3 bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="text-xl font-semibold text-green-700">Our Vision</h4>
              <p>
                A world where individuals embrace a holistic approach to health, recognizing the interconnectedness of mind, body, and soul.
              </p>
            </div>
            <div className="space-y-3 bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="text-xl font-semibold text-green-700">Our Mission</h4>
              <p>
                To educate, inspire, and guide people toward a balanced lifestyle that promotes wellness and vitality.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid md:grid-cols-2 gap-8 items-center mt-40 pb-20"
          >
            <img src="logo.png" alt="Founder" className="rounded-2xl shadow-md" />
            <div className="space-y-3">
              <h4 className="text-xl font-semibold">Meet the Founder</h4>
              <p className="font-semibold">Madhusudan N, Founder & CEO</p>
              <p>
                During his business degree, Madhusudan's passion for enhancing daily life and supporting India's economic growth evolved into a goal. 
                With 2 years exploring wellness, 1.5 years at a startup, talking to 100+ nutritionists, reading books, consuming 500+ hours on YouTube, 
                and real testimonials from family — he’s now fulfilling his college dream by guiding millions on their wellness journey across India.
              </p>
            </div>
          </motion.div>
      </div>


      
     

      {/* Meet the Founder */}
      
    </div>
  );
};

export default AboutUs;
