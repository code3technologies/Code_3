import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBand from "@/components/StatsBand";
import PartnerLogos from "@/components/PartnerLogos";
import Services from "@/components/Services";
import AboutStrip from "@/components/AboutStrip";
import WhyCode3 from "@/components/WhyCode3";
import Industries from "@/components/Industries";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import AwardsBand from "@/components/AwardsBand";
import BlogFeed from "@/components/BlogFeed";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <PartnerLogos />
        <Services />
        <AboutStrip />
        <WhyCode3 />
        <Industries />
        <Process />
        <Testimonials />
        <AwardsBand />
        <BlogFeed />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
