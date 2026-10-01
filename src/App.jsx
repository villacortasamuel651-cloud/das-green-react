import { useCallback, useState } from "react";

import Preloader from "./components/layout/Preloader/Preloader";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import ScrollProgress from "./components/ui/ScrollProgress/ScrollProgress";

import Hero from "./components/sections/Hero/Hero";
import About from "./components/sections/About/About";
import Timeline from "./components/sections/Timeline/Timeline";
import Exhibitions from "./components/sections/Exhibitions/Exhibitions";
import Experience from "./components/sections/Experience/Experience";
import News from "./components/sections/News/News";
import Testimonials from "./components/sections/Testimonials/Testimonials";
import Courses from "./components/sections/Courses/Courses";
import Booking from "./components/sections/Booking/Booking";
import Quote from "./components/sections/Quote/Quote";
import Contact from "./components/sections/Contact/Contact";
import WhatsAppButton from "./components/ui/WhatsAppButton/WhatsAppButton";
import PrivacyPolicy from "./components/layout/PrivacyPolicy/PrivacyPolicy";



export default function App() {
  const [ready, setReady] = useState(false);
  const handleReveal = useCallback(() => setReady(true), []);

  return (
    <div className={`app ${ready ? "ready" : ""}`}>
      <Preloader onReveal={handleReveal} />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Timeline />
        <Exhibitions />
        <Experience />
        <News />
        <Testimonials />
        <Courses />
        <Booking />
        <Quote />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <PrivacyPolicy />
    </div>
  );
}