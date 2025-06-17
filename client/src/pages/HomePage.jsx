import React, { useEffect, useRef } from 'react';
import { useSection } from '../context/SectionContext';
import FeaturesSection from '../components/FeaturesSection';
import UrlShortenerForm from '../components/UrlShortenerForm';
import TestimonialCarousel from '../components/TestimonialCarousel';

const HomePage = () => {
  const { setActiveSection } = useSection();
  const featuresRef = useRef();
  const pricingRef = useRef();
  const aboutRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const sections = [featuresRef.current, pricingRef.current, aboutRef.current];
    sections.forEach((section) => section && observer.observe(section));

    return () => sections.forEach((section) => section && observer.unobserve(section));
  }, [setActiveSection]);

  return (
    <div>
      <section id="features" ref={featuresRef} className="h-screen flex items-center justify-center bg-[#F3F3E0]">
        <UrlShortenerForm/>
      </section>

      <section id="pricing" ref={pricingRef} className="h-screen flex items-center justify-center bg-[#CBDCEB]">
        <FeaturesSection/>
      </section>

      <section id="about" ref={aboutRef} className="h-screen flex items-center justify-center bg-[#608BC1] text-white">
        <TestimonialCarousel/>
      </section>
    </div>
  );
};

export default HomePage;
