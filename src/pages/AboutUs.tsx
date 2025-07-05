import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="w-full">

      {/* Page 1: Hero + Welcome */}
      <section className="h-screen flex flex-col justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
        >
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-green-600 font-semibold text-xl">
              India’s most happening Wellness Startup
            </h2>
            <p className="text-4xl font-bold text-gray-900 leading-snug">
              Building a global movement of well-thy communities
            </p>
            <h3 className="text-2xl font-semibold mt-6">
              Welcome to Livin Significant
            </h3>
            <p className="text-gray-700">
              Your partner in achieving optimal health and a well-thy lifestyle through personalized science-based wellness coaching.
            </p>
            <p className="text-gray-700">
              Our expert nutritionists help you break out of your sedentary lifestyle with personalized guidance on eating habits, sleep, exercise, and lifestyle improvements — all at the most affordable prices.
            </p>
          </div>
          <img src="logo.png" alt="Wellness" className="rounded-2xl shadow-lg w-full max-h-[400px] object-cover" />
        </motion.div>
      </section>

      {/* Page 2: Why + Vision + Mission */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 max-w-6xl w-full"
        >
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-green-600">
              Why We Do What We Do
            </h3>
            <p className="text-gray-700">
              People are realizing the value of qualitative living. At Livin Significant, we empower individuals to take control of their health, leading to greater longevity and vitality.
            </p>
            <p className="text-gray-700">
              We primarily focus on educating people about the significance of health and wellness in today’s busy lifestyle, while serving clients with the best holistic approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition space-y-4">
              <h4 className="text-2xl font-semibold text-green-700">Our Vision</h4>
              <p className="text-gray-700">
                A world where individuals embrace a holistic approach to health, recognizing the interconnectedness of mind, body, and soul.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition space-y-4">
              <h4 className="text-2xl font-semibold text-green-700">Our Mission</h4>
              <p className="text-gray-700">
                To educate, inspire, and guide people toward a balanced lifestyle that promotes wellness and vitality.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Page 3: Meet the Founder */}
      <section className="h-screen flex items-center justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-center"
        >
          <img src="logo.png" alt="Founder" className="rounded-2xl shadow-lg w-full max-h-[400px] object-cover" />
          <div className="space-y-4 text-gray-800">
            <h4 className="text-2xl font-semibold">Meet the Founder</h4>
            <p className="font-semibold">Madhusudan N, Founder & CEO</p>
            <p>
              During his business degree, Madhusudan's passion for enhancing daily life and supporting India's economic growth evolved into a goal. 
              With 2 years exploring wellness, 1.5 years at a startup, talking to 100+ nutritionists, reading books, consuming 500+ hours on YouTube, 
              and real testimonials from family — he’s now fulfilling his college dream by guiding millions on their wellness journey across India.
            </p>
          </div>
        </motion.div>

        
      </section>

      <div className="text-center pb-8">
                  <p className="text-sm text-center text-gray-500">
                      <Link to="/" className="text-primary-500 hover:underline">← Back to Home</Link>
                  </p>
              </div>
      

    </div>
  );
};

export default AboutUs;
