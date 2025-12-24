import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>WhatsFlow - AI-First WhatsApp Business API Platform</title>
        <meta 
          name="description" 
          content="Scale your business with WhatsApp automation. Run campaigns, deploy AI agents, and manage team inbox - all in one powerful platform. Start free trial today." 
        />
        <meta name="keywords" content="WhatsApp API, WhatsApp Business, WhatsApp automation, AI chatbot, WhatsApp marketing" />
      </Helmet>
      
      <div className="min-h-screen bg-background dark">
        <Navbar />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
