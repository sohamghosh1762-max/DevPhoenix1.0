import { HeroSection } from "@/components/sections/HeroSection";
import { CatalogSection } from "@/components/sections/CatalogSection";
import { JourneyPreview } from "@/components/sections/JourneyPreview";
import { LearningPathsPreview } from "@/components/sections/LearningPathsPreview";
import { ProgramsPreview } from "@/components/sections/ProgramsPreview";
import { WhyDevPhoenix } from "@/components/sections/WhyDevPhoenix";
import { Testimonials } from "@/components/sections/Testimonials";
import { Mentors } from "@/components/sections/Mentors";
import { CtaSection } from "@/components/sections/CtaSection";
import { GlobalReach } from "@/components/sections/GlobalReach";
import { Footer } from "@/components/sections/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <CatalogSection />
        <JourneyPreview />
        <LearningPathsPreview />
        <ProgramsPreview />
        <WhyDevPhoenix />
        <Mentors />
        <Testimonials />
        <CtaSection />
        <GlobalReach />
      </div>
      <Footer />
    </>
  );
}
