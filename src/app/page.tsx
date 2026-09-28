import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Manifesto />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
    </>
  );
}
