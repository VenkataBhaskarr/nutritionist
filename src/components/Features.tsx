import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Utensils, 
  UserCheck, 
  ClipboardList, 
  BookOpen, 
  Heart, 
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const featureDetails = [
    {
      icon: Utensils,
      title: 'Personalized Nutrition Plans',
      value: 'Tailored meal plans designed to meet your unique health goals, crafted by expert nutritionists.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      hasAction: false,
    },
    {
      icon: UserCheck,
      title: 'Certified Wellness Coaches',
      value: 'One-on-one support from certified coaches to guide you through your wellness journey.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      hasAction: true,
    },
    {
      icon: ClipboardList,
      title: 'Food Tracking and Analysis',
      value: 'Log meals and analyze nutritional intake with intuitive tools for better health decisions.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      hasAction: true,
    },
    {
      icon: BookOpen,
      title: 'Meal Planning and Recipes',
      value: 'Access a library of healthy recipes and plan meals effortlessly to stay on track.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      hasAction: true,
    },
    {
      icon: Heart,
      title: 'Lifestyle and Behavior Coaching',
      value: 'Build sustainable habits with expert coaching on lifestyle and behavior changes.',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      hasAction: true,
    },
    {
      icon: GraduationCap,
      title: 'Nutritional Education',
      value: 'Learn about nutrition through engaging workshops and educational resources.',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100',
      hasAction: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      <motion.div 
        className="absolute top-20 left-10 opacity-10"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
      >
        <Sparkles size={80} className="text-white" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-10 opacity-10"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Heart size={60} className="text-white" />
      </motion.div>

      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16 lg:mb-20"
        >
         
          <h2 className="text-4xl font-bold text-black mb-6">
            Transform Your{' '}
            <span className="text-primary-500">
              Wellness Journey
            </span>
          </h2>
          
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive wellness solutions designed to help you achieve your health goals 
            with personalized support every step of the way.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featureDetails.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
                      {feature.value}
                    </p>

                    {/* Action Button */}
                    {feature.hasAction !== false && (
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity group-hover:translate-x-1 transform transition-transform duration-300`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 lg:mt-20"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;