"use client";

import { MotionConfig } from "framer-motion";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { PortfolioSection } from "@/components/PortfolioSection";
import { PricingSection } from "@/components/PricingSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SsbSection } from "@/components/SsbSection";
import { TestimonialSection } from "@/components/TestimonialSection";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <ProcessSection />
        <PortfolioSection />
        <SsbSection />
        <PricingSection />
        <TestimonialSection />
        <BlogSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
