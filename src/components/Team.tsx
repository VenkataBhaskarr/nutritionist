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
    name: "Dr. Ayesha Rahman",
    title: "Clinical Nutritionist",
    image: avatar1,
    description: "Expert in metabolic disorders and personalized nutrition protocols.",
  },
  {
    name: "Dr. Rohan Singh",
    title: "Sports Dietitian",
    image: avatar2,
    description: "Focuses on performance nutrition for athletes and active individuals.",
  },
  {
    name: "Dr. Meera Patel",
    title: "Pediatric Nutritionist",
    image: avatar3,
    description: "Specializes in children’s dietary planning and holistic development.",
  },
  {
    name: "Dr. Arjun Desai",
    title: "Functional Medicine Expert",
    image: avatar4,
    description: "Blends science and lifestyle to treat chronic health issues naturally.",
  },
  {
    name: "Dr. Sneha Iyer",
    title: "Women’s Health Dietitian",
    image: avatar5,
    description: "Focused on PCOS, hormonal balance, and fertility nutrition.",
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
        <Sparkles size={80} className="text-primary-500" />
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
            <span className="text-green-500">
              Expert Nutritionists
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our elite team brings experience, care, and science-backed strategies tailored just for you.
          </p>
        </motion.div>

        {/* Infinite scroll carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-6 animate-scroll-x "
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
                className="group w-72 min-w-[18rem] bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-green-50 to-green-100"
              >
                {/* <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-sm"
                /> */}
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-1 group-hover:text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-green-600 text-center font-medium mb-2">{member.title}</p>
                <p className="text-sm text-gray-600 text-center">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurTeamSection;
