'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, UserCheck, ClipboardList, BookOpen, Heart, GraduationCap, ArrowRight } from 'lucide-react';

const NutritionFeatures = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const featureDetails = [
    {
      icon: Utensils,
      title: 'Personalized Nutrition Plans',
      value: 'Tailored meal plans designed to meet your unique health goals, crafted by expert nutritionists.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue_BGColor',
      hasAction: false,
    },
    {
      icon: UserCheck,
      title: 'Certified Wellness Coaches',
      value: 'One-on-one support from certified coaches to guide you through your wellness journey.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      icon: ClipboardList,
      title: 'Food Tracking and Analysis',
      value: 'Log meals and analyze nutritional intake with intuitive tools for better health decisions.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      icon: BookOpen,
      title: 'Meal Planning and Recipes',
      value: 'Access a library of healthy recipes and plan meals effortlessly to stay on track.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
    {
      icon: Heart,
      title: 'Lifestyle and Behavior Coaching',
      value: 'Build sustainable habits with expert coaching on lifestyle and behavior changes.',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
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

  return (
    <section className="relative py-12 px-4 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden" aria-label="Nutrition Features section">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 left-8 w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-16 right-8 w-32 h-32 bg-gradient-to-r from-green-100 to-teal-100 rounded-full opacity-15 blur-2xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-full px-4 py-2 mb-4 shadow-sm"
          >
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              Our Features
            </span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Why Choose Our <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Nutrition Platform</span>
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-20 gap-5"
        >
          {featureDetails.map((detail) => (
            <motion.div
              key={detail.title}
              variants={cardVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
              }}
              className="group relative"
            >
              {/* Card Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${detail.bgColor} rounded-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              />
              {/* Card Content */}
              <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-xl p-5 shadow-md group-hover:shadow-lg transition-all duration-300">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-10 h-10 bg-gradient-to-r ${detail.color} rounded-lg flex items-center justify-center mb-4 shadow-sm`}
                >
                  <detail.icon className="h-5 w-5 text-white" />
                </motion.div>
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">
                    {detail.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {detail.value}
                  </p>
                </div>
                {/* Action Button */}
                {detail.hasAction && (
                  <motion.a
                    href="/learn-more"
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 inline-flex items-center gap-1 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-400 font-medium text-xs group-hover:underline transition-colors"
                  >
                    <span>Learn More</span>
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </motion.div>
                  </motion.a>
                )}
                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${detail.color} rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NutritionFeatures;