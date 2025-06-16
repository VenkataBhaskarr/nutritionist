import React from 'react';
import { motion } from 'framer-motion';
import avatar1 from "/assets/avatar-1.png";
import avatar2 from "/assets/avatar-2.png";
import avatar3 from "/assets/avatar-3.png";
import avatar4 from "/assets/avatar-4.png";
import avatar5 from "/assets/avatar-5.png";
import avatar6 from "/assets/avatar-6.png";
import avatar7 from "/assets/avatar-7.png";

const testimonials = [
  {
    text: "Thank you coach. I'm keen to work on a better regimen to diet and fitness will consider after 6 months. You have trained me very well. Now I want to implement all of it. Thanks again.",
    imageSrc: avatar1,
    name: "Charanjit Singh",
    username: "Client",
  },
  {
    text: "I'm truly blessed to remain under your close guidance all through this year 2024. It certainly gave me an opportunity to learn and understand the intricacies of diabetes management. Now, i feel confident that I'm able to keep my sugar reading under control with exercise and given a stress free life",
    imageSrc: avatar2,
    name: "Santosh Kumar",
    username: "Client",
  },
  {
    text: "You've given me the best advice, best coaching with the best knowledge. You're a true motivator, who was available to me at all required times.",
    imageSrc: avatar3,
    name: "Raju",
    username: "Client",
  },
  {
    text: "You're a great coach to me. Thank you so much for all the best advice that you've given me to support my health goals. You're such a wonderful girl. Love and blessings to my coach",
    imageSrc: avatar4,
    name: "Manjushree",
    username: "Client",
  },
  {
    text: "our diet plan is working good. At first, it was hard for me to change my eating routine but your suggestions for the best alternatives were very supportive to me, whenever I feel like quitting. I continued my plan and it was very normal now. I've lost 4 kgs and my uric acid level was in control. Thank you so much and I wish to continue this plan forward",
    imageSrc: avatar5,
    name: "Jayant",
    username: "Client",
  },
  {
    text: "My LDL cholesterol has decreased and I have a good inch loss too. Your suggestion to eat the same at the same time everyday helped me with my glucose and cravings as well. I'm happy that my body has a good momentum. Thank you",
    imageSrc: avatar6,
    name: "Phani prasad",
    username: "Client",
  },
  {
    text: "I'm grateful to you for helping me manage my PCOD with a practical, easy nutrition plan. It didn't feel like a restrictive diet. Everything was clearly laid out, making it simple to follow.",
    imageSrc: avatar7,
    name: "Sravya",
    username: "Client",
  },
 
];

const TestimonialCard = ({ column, className, duration }) => {
  return (
    <div className={className}>
      <motion.div
        className="flex flex-col gap-4 pb-6 w-80"
        animate={{ translateY: '-50%' }}
        transition={{
          duration: duration || 10,
          repeatType: 'loop',
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {column.map((testimonial, index) => (
              <div
                className="card bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/20 p-4 shadow-lg"
                key={index}
              >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {testimonial.text}
                </div>
                <div className="flex items-center gap-2 mt-5">
                  {/* <img
                    src={testimonial.imageSrc}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full"
                  /> */}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.username}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="px-5">
        <div className="mx-auto max-w-[540px] text-center">
          <div className="flex justify-center">
            <div className="tag inline-block bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-md text-blue-800 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-700/50">
              User Reviews
            </div>
          </div>
          <h2 className="section-title mt-5 text-3xl font-bold text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="section-description mt-5 text-gray-600 dark:text-gray-300">
            Discover how our nutrition platform empowers clients and professionals to achieve their health goals.
          </p>
        </div>
        <div className="flex justify-center items-center border mt-10 gap-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden w-full mx-auto">
          <TestimonialCard column={firstColumn} duration={15} className="" />
          <TestimonialCard
            column={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialCard
            column={thirdColumn}
            className="hidden lg:block "
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;