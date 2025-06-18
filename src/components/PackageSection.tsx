import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Crown, BadgeCheck } from 'lucide-react';
import { PhoneCall } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
const PackagesSection = () => {
  const navigate = useNavigate()
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  // Top of file:
// Update `packages` array:
const packages = [
  {
    title: "Silver Plan",
    icon: BadgeCheck,
    price: "₹999",
    original: "₹1500",
    refund: "₹500 refund if not satisfied",
    gradient: "from-gray-100 via-slate-100 to-white",
    features: [
      "1 on 1 call with our expert nutritionist",
      "Provides Personalized Guidelines",
      "Upgrade opportunity to Gold at ₹2499",
      "Validity: One-time"
    ],
    normal: true
  },
  {
    title: "Gold Plan",
    icon: Crown,
    price: "₹2499",
    original: "₹3499",
    refund: null,
    gradient: "from-yellow-100 via-yellow-50 to-white",
    features: [
      "1 on 1 consultations",
      "Personalized meal plan designing",
      "Regular chat follow-ups",
      "Habit tracking",
      "In-Website support",
      "Validity: 30 days"
    ],
    normal: true,
  },
  {
    title: "Contact Sales",
    icon: PhoneCall,
    price: null,
    original: null,
    refund: null,
    gradient: "from-emerald-100 via-white to-emerald-200",
    features: [
      "Everything in gold plan",
      "Tailored solutions for large groups",
      "Exclusive support and customizations",
      "Flexible pricing and extended durations",
      "Priority onboarding and consultations"
    ],
    contact: true,
  },
];


  return (
    <section id="package" ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={cardVariants}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your <span className="text-primary-500">Plan</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transparent pricing designed to deliver value and flexibility. Start small or go all-in.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >

        {packages.map((pkg, index) => {
  const Icon = pkg.icon;
  return (
    <motion.div
      key={pkg.title}
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative rounded-2xl border shadow-xl p-8 transition-all duration-500 overflow-hidden
        ${pkg.contact
          ? "bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-emerald-200 hover:ring-4 hover:ring-emerald-400/40 backdrop-blur-sm"
          : `bg-gradient-to-br ${pkg.gradient} border-gray-200 hover:ring-2 hover:ring-primary-400`
        }`}
    >
      {/* Background Sparkles */}
      <div className="absolute top-4 right-4 opacity-10">
        <Sparkles className="w-16 h-16 text-yellow-400" />
      </div>

      {/* Badge */}
      {pkg.title === "Gold Plan" && (
        <div className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Best Value
        </div>
      )}

      {/* Icon + Title + Price */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
          <Icon className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{pkg.title}</h3>
          {pkg.price && (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400 line-through">{pkg.original}</p>
              <p className="text-2xl font-bold text-primary-600">{pkg.price}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info / Promo */}
      {pkg.refund ? (
        <div className="text-sm font-medium text-yellow-900 bg-yellow-100 border border-yellow-300 p-3 rounded-md mb-4 shadow-sm">
          {pkg.refund}
        </div>
      ) : pkg.price ? (
        <div className="text-sm font-medium text-green-700 bg-green-100 border border-green-200 p-3 rounded-md mb-4 shadow-sm">
          Book now & save <span className="font-bold">29%</span> instantly.
        </div>
      ) : null}

      {/* Features */}
      <ul className="space-y-3 text-gray-700 mb-6">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Contact Sales CTA */}
      {pkg.contact && (
        
        <a
        href="https://wa.me/919963257226?text=Hello%20I%20am%20contacting%20from%20livinsignificant%20site%20can%20we%20please%20talk%20about%20the%20process%20"
        
        target="_blank"
      >
        <button className="w-full mt-auto bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all shadow-lg">
          Custom Pricing
        </button>
      </a>
      )}

    {pkg.normal && (
        <button onClick={() => navigate('/signup')} className="w-full mt-auto bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all shadow-lg">
           get in touch
        </button>
      )}


    </motion.div>
  );
})}

      </motion.div>
      
    </section>
  );
};

export default PackagesSection;
