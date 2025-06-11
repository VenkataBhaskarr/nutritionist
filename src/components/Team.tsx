import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import avatar1 from "/assets/avatar-1.png";
import avatar2 from "/assets/avatar-2.png";
import avatar3 from "/assets/avatar-3.png";
import avatar4 from "/assets/avatar-7.png";
import avatar5 from "/assets/avatar-8.png";

const nutritionists = [
  {
    name: "Pranathi Jandhyala",
    experience: "5.5 years",
    clientbase: "500+ clients",
    specializations: [
      "Weight loss & metabolic disorder management",
      "Diabetes, thyroid, obesity, cholesterol, liver disease, mild kidney disorder",
      "Cancer nutrition and post-operative care",
      "Community Nutrition (5th–10th grade sessions)",
    ],
    approach:
      "Customized diet plans, personalized counseling, and long-term lifestyle guidance tailored to each individual.",
    image: avatar1,
  },
  {
    name: "Shouli Basak",
    experience: "7 years",
    clientbase: "450+ clients",
    specializations: [
      "General clinical nutrition",
      "Personalized nutrition counseling",
      "Weight management & lifestyle interventions",
    ],
    approach:
      "Empowering individuals with lifestyle-focused, personalized diet solutions for sustainable health.",
    image: avatar2,
  },
  {
    name: "Sowmya B.",
    experience: "15+ years",
    clientbase: "Extensive (Data not specified)",
    specializations: [
      "Chronic disease nutrition",
      "Preventive health",
      "Sustainable diet patterns",
    ],
    approach:
      "Integrating clinical precision with decades of hands-on nutrition strategy for long-term impact.",
    image: avatar3,
  },
  {
    name: "Jyothsna",
    experience: "4+ years",
    clientbase: "250–500 clients/month",
    specializations: [
      "Diabetes & weight management",
      "Evidence-based interventions",
      "Structured meal planning",
    ],
    approach:
      "Data-driven dietary planning and follow-ups to deliver measurable outcomes for every client.",
    image: avatar4,
  },
  {
    name: "G. Shiva Raja Shree",
    experience: "4 years",
    clientbase: "10,000+ clients",
    specializations: [
      "Broad-spectrum nutrition care",
      "Scalable transformation models",
      "Large-scale client success",
    ],
    approach:
      "Mass-impact nutrition with precision tracking, making wellness accessible and effective at scale.",
    image: avatar5,
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const OurTeamSection = () => {
  return (
    <section id="our-team" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Background animation */}
      <motion.div 
        className="absolute top-10 left-10 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Sparkles size={80} className="text-green-500" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-black mb-4">
            Meet Our{' '}
            <span className="text-green-500">Expert Nutritionists</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Personalized expertise for your unique health journey.
          </p>
        </motion.div>

        {/* Infinite scroll carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-6 animate-scroll-x"
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {[...nutritionists, ...nutritionists].map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="group w-80 min-w-[20rem] bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-green-50 to-green-100 flex flex-col justify-between"
              >
                {/* <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-sm"
                /> */}
                <h3 className="text-xl text-primary-700 font-semibold text-center text-gray-900 mb-2 group-hover:text-gray-800">
                  {member.name}
                </h3>

                <div className="text-sm text-center text-gray-500 mb-3 space-y-1">
                  <p><strong>Experience:</strong> {member.experience}</p>
                  <p><strong>Clients:</strong> {member.clientbase}</p>
                </div>

                <div className="text-sm text-left text-gray-800 mb-3">
                  <p className="text-green-600 font-semibold mb-1 text-center">Specializations:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                    {member.specializations.map((spec, idx) => (
                      <li key={idx}>{spec}</li>
                    ))}
                  </ul>
                </div>

                {/* <p className="text-xs text-gray-600 text-center italic mt-2">
                  “{member.approach}”
                </p> */}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurTeamSection;
