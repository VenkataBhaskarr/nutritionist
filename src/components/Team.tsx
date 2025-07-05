import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import avatar1 from "/assets/avatar-1.png";
import avatar2 from "/assets/avatar-2.png";
import avatar3 from "/assets/avatar-3.png";
import avatar4 from "/assets/avatar-7.png";
import avatar5 from "/assets/avatar-8.png";

const nutritionists = [
  {
    name: "Dt. Sowmya Balasubramanian",
    education: "MSc & PhD in Nutrition & Dietetics",
    experience: "15+ years",
    clients: "20,000+ clients",
    expertise: [
      "Infertility, Obesity, Diabetes, OSA",
      "Kidney & Liver health",
      "Pediatric to Geriatric nutrition"
    ],
    awards: "Nari Samman awardee, Co-author of 2 international books",
    image: avatar3,
  },
  {
    name: "Dt. Shouli Basak",
    education: "PhD in Food & Nutrition",
    experience: "7+ years",
    clients: "1000+ clients",
    expertise: [
      "Weight management, Diabetes, PCOD",
      "Thyroid, Hypertension, Pediatric nutrition"
    ],
    approach: "Mindful practices, science-backed personalized nutrition",
    image: avatar2,
  },
  {
    name: "Dt. Jellampally Jyothsna",
    education: "B.Sc. in Food & Nutrition with Dietetics",
    experience: "4+ years",
    clients: "1000+ clients",
    expertise: [
      "Weight Management, Diabetes, PCOD",
      "Thyroid, CKD, Cardio, Pregnancy",
      "Pediatric Nutrition"
    ],
    image: avatar4,
  },
  {
    name: "Dt. Pranathi Jandhyala",
    education: "MSc in Food & Nutrition",
    experience: "5.5 years",
    clients: "1000+ clients",
    expertise: [
      "Weight management, Diabetes, PCOD, Thyroid"
    ],
    approach: "Behavior-based nutrition coaching & culturally relevant meal planning",
    image: avatar1,
  },
  {
    name: "Dt. Shiva Raja Shree",
    education: "M.Sc. in Food & Nutrition, CFN, CNCC",
    experience: "4+ years",
    clients: "10,000+ clients",
    expertise: [
      "Weight management, Diabetes, PCOD",
      "Thyroid, CKD, Hypertension, Cardiac"
    ],
    approach: "Custom meal plans, sustainable lifestyle-based nutrition",
    image: avatar5,
  }
];

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }},
};

const OurTeamSection = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    const scrollAmount = 300;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="our-team" className="relative py-20 lg:py-28 overflow-hidden">
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
            Meet Our <span className="text-green-500">Expert Nutritionists</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Personalized expertise for your unique health journey.
          </p>
        </motion.div>

        {/* Scroll buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button onClick={() => scroll('left')} className="p-2 rounded-full bg-green-50 hover:bg-green-100 shadow">
            <ChevronLeft className="text-green-600" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full bg-green-50 hover:bg-green-100 shadow">
            <ChevronRight className="text-green-600" />
          </button>
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {nutritionists.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group min-w-[20rem] bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-green-50 to-green-100 flex flex-col justify-between"
            >
              {/* <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow"
              /> */}
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2 group-hover:text-gray-800">
                {member.name}
              </h3>
              <div className="text-sm text-center text-gray-500 mb-2">
                <p><strong>Experience:</strong> {member.experience}</p>
                <p><strong>Clients:</strong> {member.clients}</p>
                <p><strong>Education:</strong> {member.education}</p>
              </div>
              <div className="text-sm text-left text-gray-800 mb-2">
                <p className="text-green-600 font-semibold mb-1 text-center">Expertise:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                  {member.expertise.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
              {member.awards && (
                <p className="text-xs text-center italic text-green-700 mt-2">{member.awards}</p>
              )}
              {member.approach && (
                <p className="text-xs text-center text-gray-600 mt-1">“{member.approach}”</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeamSection;
