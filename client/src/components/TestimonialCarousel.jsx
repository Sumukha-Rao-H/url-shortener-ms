import React, { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Jacob, Business Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    brief: 'Boosted my sales fast!',
    full: 'This short link tool helped my business drive 40% more traffic from social campaigns. It’s fast, intuitive, and powerful.',
  },
  {
    name: 'Lisa, Teacher',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    brief: 'Made sharing easier!',
    full: 'I use it to share classroom links with students. It’s super easy and reliable, even for tech-challenged folks.',
  },
  {
    name: 'Arun, Developer',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    brief: 'API is top-notch!',
    full: 'The API is well documented and robust. Integrated it into our internal dashboard in minutes.',
  },
  {
    name: 'Melania, Content Creator',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    brief: 'Love the analytics!',
    full: 'I track every link I share. Seeing what clicks with my audience is a game-changer.',
  },
  {
    name: 'Jamal, Event Planner',
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    brief: 'So easy to use!',
    full: 'Used it for event invites and RSVPs. It’s clean, fast, and gets the job done beautifully.',
  },
  {
    name: 'Sweden, Student',
    image: 'https://randomuser.me/api/portraits/women/91.jpg',
    brief: 'Perfect for projects!',
    full: 'My teammates and I use this to share links on Notion and Docs. It keeps things tidy.',
  },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const pauseAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const visible = getVisibleCards();

  return (
    <section className="bg-[#608BC1] py-16 px-6 text-center text-[#133E87]">
      <h2 className="text-4xl font-bold mb-10 text-[#CBDCEB]">What Our Users Say</h2>

      <div className="relative max-w-6xl mx-auto flex items-center justify-center gap-6 overflow-hidden">
        <button onClick={prevSlide} className="absolute left-0 z-10">
          <ChevronLeft className="w-10 h-10 hover:text-[#608BC1] transition" />
        </button>

        <div className="flex gap-6 w-full justify-center">
          {visible.map((user, index) => (
            <motion.div
              key={user.name}
              className="bg-[#CBDCEB] rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:bg-[#b2cde2] transition duration-500 w-72"
              onMouseEnter={pauseAutoSlide}
              onMouseLeave={startAutoSlide}
              initial={{ x: 100 * (index + 1), opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100 * (index + 1), opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-20 h-20 rounded-full shadow-md border-4 border-white"
                />
                <h4 className="font-semibold">{user.name}</h4>
                <p className="text-sm text-[#133E87]/70">{user.brief}</p>
                <motion.div
                  className="mt-4 text-sm text-[#133E87] text-center max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out"
                >
                  {user.full}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <button onClick={nextSlide} className="absolute right-0 z-10">
          <ChevronRight className="w-10 h-10 hover:text-[#608BC1] transition" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
