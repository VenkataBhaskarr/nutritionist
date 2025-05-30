import React from 'react';
import { motion } from 'framer-motion';
import avatar1 from "/assets/avatar-1.png";
import avatar2 from "/assets/avatar-2.png";
import avatar3 from "/assets/avatar-3.png";
import avatar4 from "/assets/avatar-4.png";
import avatar5 from "/assets/avatar-5.png";
import avatar6 from "/assets/avatar-6.png";
import avatar7 from "/assets/avatar-7.png";
import avatar8 from "/assets/avatar-8.png";
import avatar9 from "/assets/avatar-9.png";

const testimonials = [
  {
    text: "This platform has transformed how I manage my clients’ nutrition plans. The dashboard is intuitive and saves me hours every week.",
    imageSrc: avatar1,
    name: "Anjali Sharma",
    username: "Nutritionist",
  },
  {
    text: "Tracking my diet and communicating with my nutritionist is so easy with this app. It’s helped me stay consistent with my goals.",
    imageSrc: avatar2,
    name: "Suresh Patel",
    username: "Client",
  },
  {
    text: "As an admin, I love the role-based access control. Managing our team of nutritionists and clients is seamless and efficient.",
    imageSrc: avatar3,
    name: "Madhusudan Rao",
    username: "Admin",
  },
  {
    text: "The real-time analytics help me monitor my clients’ progress and tweak their plans instantly. It’s a game-changer for my practice.",
    imageSrc: avatar4,
    name: "Rohit Iyer",
    username: "Nutritionist",
  },
  {
    text: "The personalized meal plans from my nutritionist are amazing, and the app makes it so simple to follow them daily.",
    imageSrc: avatar5,
    name: "Reena",
    username: "Client",
  },
  {
    text: "This platform’s data insights allow me to make informed decisions for my clients, improving their outcomes significantly.",
    imageSrc: avatar6,
    name: "Preethi Reddy",
    username: "Nutritionist",
  },
  {
    text: "As a client, I appreciate how user-friendly the app is. It keeps me motivated with clear progress tracking and tips.",
    imageSrc: avatar7,
    name: "Arjun Desai",
    username: "Client",
  },
  {
    text: "Managing multiple nutritionists and their schedules is effortless with this platform’s robust admin tools.",
    imageSrc: avatar8,
    name: "Neha Gupta",
    username: "Nutritionist",
  },
  {
    text: "The app’s reminders and meal logging features have made sticking to my nutrition plan so much easier!",
    imageSrc: avatar9,
    name: "Priya Menon",
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
                  <img
                    src={testimonial.imageSrc}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full"
                  />
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