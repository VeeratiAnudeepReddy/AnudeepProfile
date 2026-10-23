import Intro from "@/components/Intro";
import Dock from "@/components/Dock";
import TopActions from "@/components/TopActions";
import Effects from "@/components/Effects";
import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Awards from "@/components/Awards";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <Intro />
      <div className="grid-bg" aria-hidden="true" />
      <Effects />
      <Dock />
      <TopActions />
      <div id="real-site">
        <main>
          <Hero />
          <Proof />
          <About />
          <Projects />
          <Experience />
          <Awards />
          <Skills />
          <Contact />
        </main>
      </div>
    </>
  );
}
