import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  LayoutDashboard,
  BriefcaseMedical,
  HeartPulse,
  PersonStanding,
  BicepsFlexed,
  Sparkles,
} from 'lucide-react';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Users,
      title: 'Obesity',
      desc: 'Struggling with weight? We tailor sustainable plans just for you. Lose fat, gain confidence—with no crash diets involved.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
    },
    {
      icon: LayoutDashboard,
      title: 'Diabetes',
      desc: 'Take control of your sugar levels with personalized nutrition plans. Live healthy, energized, and in charge every single day.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
    },
    {
      icon: BriefcaseMedical,
      title: 'PCOD/PCOS',
      desc: 'Hormonal imbalances don’t have to rule your life. We help you eat right, feel right, and thrive.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
    },
    {
      icon: HeartPulse,
      title: 'Organ Health',
      desc: 'Your liver, heart, and kidneys deserve top-notch care. Support your organs with food that heals and protects.',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'from-rose-50 to-rose-100',
    },
    {
      icon: PersonStanding,
      title: 'Kids Health',
      desc: 'Nutrition shapes your child’s future—make every bite count. Smart, tasty plans designed for growing minds and bodies',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      icon: BicepsFlexed,
      title: 'Muscle Gain',
      desc: 'Muscles are built in the kitchen as much as the gym. Get the right fuel to power your strength and recovery.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <section id="services" ref={sectionRef} className="relative py-20 bg-white overflow-hidden">
        <motion.div 
            className="absolute top-10 left-10 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
        >
            <Sparkles size={80} className="text-primary-500" />
        </motion.div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl font-bold text-black mb-6">
            Comprehensive{' '}
            <span className="text-primary-500">Nutrition Platform</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform connects clients with professional nutritionists under the supervision of admin experts.
          </p>
        </motion.div>

        {/* Grid Features */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

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

                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
