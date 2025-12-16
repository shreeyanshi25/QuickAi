import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";   // ✅ IMPORTANT import
import AiTools from "../components/AiTools";
import Testimonial from "../components/Testimonials";
import Plan from "../components/Plan";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AiTools /> 
      <Testimonial/>
      <Plan/>
      <Footer/>
    </div>
  );
};

export default Home;

