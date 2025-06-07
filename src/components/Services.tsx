import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  LayoutDashboard,
  BriefcaseMedical,
  HeartPulse,
  PersonStanding,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Users,
      title: 'Weight Management',
      desc: 'Struggling with overweight? We tailor sustainable plans just for you. Lose fat, gain confidence—with no crash diets involved.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Personalized meal plans', 'Weekly progress tracking', '24/7 nutritionist support', 'Recipe suggestions']
    },
    {
      icon: LayoutDashboard,
      title: 'Diabetes',
      desc: 'Take control of your sugar levels with personalized nutrition plans. Live healthy, energized, and in charge every single day.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Blood sugar monitoring', 'Carb counting guidance', 'Meal timing optimization', 'Doctor consultation']
    },
    {
      icon: BriefcaseMedical,
      title: 'PCOD/PCOS',
      desc: `Hormonal imbalances don't have to rule your life. We help you eat right, feel right, and thrive.`,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Hormone-balancing foods', 'Cycle tracking support', 'Anti-inflammatory diet', 'Lifestyle coaching']
    },
    {
      icon: HeartPulse,
      title: 'Organ Health',
      desc: 'Your liver, heart, and kidneys deserve top-notch care. Support your organs with food that heals and protects.',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'from-rose-50 to-rose-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Detox meal plans', 'Organ-specific nutrition', 'Regular health assessments', 'Supplement guidance']
    },
    {
      icon: PersonStanding,
      title: 'Kids Health',
      desc: `Nutrition shapes your child's future—make every bite count. Smart, tasty plans designed for growing minds and bodies`,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Age-appropriate meals', 'Fun recipe activities', 'Growth tracking', 'Parent guidance sessions']
    },
    {
      icon: HeartPulse,
      title: 'Thyroid Health',
      desc: 'Balance your hormones with personalized nutrition.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      price: 'Upgrade to Gold Plan',
      period: 'per month',
      features: ['Thyroid-friendly foods', 'Metabolism boosting', 'Hormone optimization', 'Energy level tracking']
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
                className="group relative h-80 [perspective:1000px]"
              >
                <div className="relative h-full w-full transition-transform duration-1000 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl [backface-visibility:hidden]">
                    <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-700`}
                      ></div>

                      <div className="relative z-10">
                        <motion.div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {feature.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-sm">
                          {feature.desc}
                        </p>

                        <div className="absolute bottom-6 right-6 opacity-60">
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className={`relative h-full bg-gradient-to-br ${feature.color} rounded-2xl p-8 shadow-xl text-white overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <Icon className="w-8 h-8 text-white/90" />
                            <div className="text-right">
                              <div className="text-2xl font-bold">{feature.price}</div>
                              {/* <div className="text-sm text-white/80">{feature.period}</div> */}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold mb-4">{feature.title}</h3>
                          
                          <div className="space-y-2">
                            {feature.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-white/90 flex-shrink-0" />
                                <span className="text-sm text-white/90">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="mt-2 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-500 border border-white/20"
                        >
                          Get Started
                        </motion.button> */}
                      </div>
                    </div>
                  </div>
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