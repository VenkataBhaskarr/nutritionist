import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  LayoutDashboard,
  BriefcaseMedical,
  HeartPulse,
  Sparkles,
  Check
} from 'lucide-react';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Users,
      title: "Weight Management",
      shortDesc: "Over weight, obesity and weight gain service",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      whatYouGet: "Over weight, Obesity and Weight gain",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: LayoutDashboard,
      title: "Diabetes",
      shortDesc: "Type 1, type 2 and gestational diabetes",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      whatYouGet: "Type 1, type 2 and gestational diabetes",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: HeartPulse,
      title: "Thyroid Health",
      shortDesc: "Hormonal imbalances in TSH, T3 and T4 values",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      whatYouGet: "Hormonal imbalances in TSH, T3 and T4 values",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: BriefcaseMedical,
      title: "PCOD, PCOS",
      shortDesc: "Overall woman health including pregnancy care",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      whatYouGet: "Overall woman health including pregnancy care",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: Users,
      title: "Hyper tension",
      shortDesc: "Stress Management and blood pressure issues",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      whatYouGet: "Stress Management and blood pressure issues",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: Users,
      title: "Kids Health",
      shortDesc: "Overall kids health, growth and their issues",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      whatYouGet: "Overall kids health, growth and their issues",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    },
    {
      icon: HeartPulse,
      title: "Organ Health",
      shortDesc: "Maintaining good health of heart, lungs, liver, kidney, GUT, spleen and pancreas",
      color: "from-rose-500 to-rose-600",
      bgColor: "from-rose-50 to-rose-100",
      whatYouGet: "Maintaining good health of heart, lungs, liver, kidney, GUT, and pancreas",
      coach: "A nutritionist with expertise over almost all the lifestyle disorders",
      consultations: "Unlimited (tailored according to our nutritionist guidelines)",
      whatWillBeCovered: "Personalized food planning, behavioral coaching and guidance for Living Significant",
      tools: "24/7 Website support and Quickest WhatsApp support"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
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
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl font-bold text-black mb-6">
            Transform Your <span className="text-primary-500">Wellness Journey</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive wellness solutions designed to help you achieve your health goals 
            with personalized support every step of the way.
          </p>
        </motion.div>

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
                    <div className="relative h-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-700`}></div>
                      <div className="relative z-10 space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-800 text-sm font-semibold leading-relaxed">{feature.shortDesc}</p>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Check className="w-4 h-4 text-primary-500" />
                            <span>*Unlimited Consults</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Check className="w-4 h-4 text-primary-500" />
                            <span>24/7 website Support</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Check className="w-4 h-4 text-primary-500" />
                            <span>Whatsapp Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className={`relative h-full bg-gradient-to-br ${feature.color} rounded-2xl p-6 shadow-xl text-white overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="space-y-2 text-s text-white/90">
                          <div><span className="font-bold">What you get:</span> {feature.whatYouGet}</div>
                          <div><span className="font-bold">Coach:</span> {feature.coach}</div>
                          <div><span className="font-bold">Consultations:</span> {feature.consultations}</div>
                          <div><span className="font-bold">Covered:</span> {feature.whatWillBeCovered}</div>
                          {/* <div><span className="font-bold">Tools:</span> {feature.tools}</div> */}
                        </div>
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
