import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Replace with your own high-quality SVG/PNG
import HeroImage from '../assets/react.svg';

const listItems = [
    '🔗 Instant link shortening',
    '📊 Real-time analytics',
    '🎯 Custom branded URLs',
    '🧩 Easy API integration',
];

const FeaturesSection = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    return (
        <section
            id="features"
            className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-16 bg-[#CBDCEB] text-[#133E87] overflow-hidden"
        >
            {/* Left Content */}
            <motion.div
                className="md:w-1/2 text-center md:text-left space-y-6"
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={{
                    hidden: { opacity: 0, x: -60 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 0.8,
                            ease: 'easeOut',
                            staggerChildren: 0.2,
                        },
                    },
                }}
            >
                <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Smart. Simple. Short.
                </motion.h1>

                <motion.p className="text-lg text-[#133E87]/80">
                    Create short, secure URLs in seconds. Track clicks, analyze traffic, and manage all your links from one powerful dashboard.
                </motion.p>

                <motion.ul className="text-left text-base list-disc list-inside space-y-1">
                    {listItems.map((item, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={controls}
                            variants={{
                                visible: { opacity: 1, x: 0, transition: { delay: 0.3 + idx * 0.2 } },
                                hidden: { opacity: 0, x: -20 },
                            }}
                        >
                            {item}
                        </motion.li>
                    ))}
                </motion.ul>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    variants={{
                        visible: { opacity: 1, y: 0, transition: { delay: 1.2 } },
                        hidden: { opacity: 0, y: 20 },
                    }}
                >
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-block mt-4 bg-[#133E87] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#102f6e] transition"
                    >
                        Get Started
                    </Link>

                </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
                className="md:w-1/2 mb-10 md:mb-0 flex justify-center"
                initial={{ y: 80, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
            >
                <motion.img
                    src={HeroImage}
                    alt="Link shortener graphic"
                    className="w-[300px] md:w-[450px]"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95, rotate: -2 }}
                />
            </motion.div>
        </section>
    );
};

export default FeaturesSection;
