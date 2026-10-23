import { focus } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import InkFill from "./InkFill";

export default function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SectionHead kicker="About" lines={["Software,", "end to end"]} />
        <div className="about-grid">
          <div className="about-copy">
            <InkFill text="I build software end to end: the interface people touch, and the services, data and algorithms that make it work." />
            <Reveal as="p" variant="left">Hi! I&rsquo;m Anudeep Reddy Veerati, a Software Development Engineer based in Hyderabad. I study Computer Science at VNR Vignana Jyothi Institute of Engineering and Technology, and I build the whole product: interfaces in Next.js and React Native, APIs in Node.js and FastAPI, and the data models and algorithms behind them.</Reveal>
            <Reveal as="p" variant="left" delay={100}>As a Full Stack Developer Intern I architected an AI learning platform and its admin tools within three months. Beyond work I compete and publish: hackathon podiums, competitive programming, and a published patent application for a call-completion and callback management system.</Reveal>
            <ul className="focus">
              {focus.map((f, i) => (
                <Reveal as="li" key={f.title} className="glass" variant={i % 2 ? "right" : "left"} delay={i * 90}>
                  <i className={f.icon} />
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal variant="right" className="about-side" delay={120}>
            <div className="edu glass">
              <i className="fa-solid fa-graduation-cap" />
              <div className="edu-years">2024 – 2028</div>
              <h3>B.Tech, Computer Science &amp; Engineering</h3>
              <div className="edu-school">VNR Vignana Jyothi Institute of Engineering and Technology</div>
              <div className="edu-focus">
                <span className="pill">Full-stack</span>
                <span className="pill">Algorithms</span>
                <span className="pill">Applied AI</span>
              </div>
              <div className="edu-loc"><i className="fa-solid fa-location-dot" /> Hyderabad, India</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
