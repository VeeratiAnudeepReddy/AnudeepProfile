export const profile = {
  name: "Anudeep Reddy Veerati",
  email: "anudeepreddy016@gmail.com",
  phone: "+91-9676451605",
  location: "Hyderabad, India",
  github: "https://github.com/VeeratiAnudeepReddy",
  linkedin: "https://www.linkedin.com/in/anudeep-reddy-veerati-336268332",
  resume: "/Anudeep_Reddy_Veerati_Resume.pdf",
};

export const nav = [
  { id: "home", label: "Home", icon: "fa-solid fa-circle-user" },
  { id: "about", label: "About", icon: "fa-regular fa-address-card" },
  { id: "projects", label: "Projects", icon: "fa-regular fa-folder-open" },
  { id: "experience", label: "Experience", icon: "fa-solid fa-briefcase" },
  { id: "awards", label: "Awards", icon: "fa-solid fa-trophy" },
  { id: "skills", label: "Skills", icon: "fa-solid fa-code" },
  { id: "contact", label: "Contact", icon: "fa-regular fa-envelope" },
];

export const focus = [
  { icon: "fa-solid fa-layer-group", title: "Full-stack products", text: "Web and mobile apps in Next.js, React and React Native, backed by Node.js and FastAPI." },
  { icon: "fa-solid fa-plug", title: "APIs and real-time systems", text: "REST APIs, Socket.io live updates and clean data models on MongoDB and PostgreSQL." },
  { icon: "fa-solid fa-diagram-project", title: "Algorithms and optimization", text: "Graph search, constraint solving and data structures, applied to routing and scheduling." },
  { icon: "fa-solid fa-wand-magic-sparkles", title: "Applied AI", text: "LLM APIs, retrieval and agent pipelines that make a product smarter, not noisier." },
];

export type Sim = "pond" | "privacy" | "traffic" | "civix" | "rail" | "recover";

export const projects: {
  sim: Sim; title: string; simTitle: string;
  summary: string; flow: string[]; tryIt: string; points: string[]; tags: string[];
  link?: { href: string; label: string; icon: string };
}[] = [
  {
    sim: "pond", title: "PondFix – Smart Aquaculture Monitoring", simTitle: "PondFix live telemetry",
    summary: "Keeps fish ponds healthy. ESP32 sensors stream water quality to the cloud, an AI assistant tells the farmer what to do, and alerts escalate until someone acts, even when the network drops.",
    flow: ["ESP32 sensors", "Cloud API", "Web + mobile dashboard", "AI / RAG assistant", "Escalating alerts"],
    tryIt: "Press Inject anomaly to crash dissolved oxygen and watch the forecast, the AI advice and the alert chain. Press Cut Wi-Fi to see offline buffering and cellular fallback.",
    points: [
      "Monitors pH, dissolved oxygen, temperature, ammonia and other indicators across 17 ponds, with live updates over Socket.io.",
      "A scikit-learn model trained on 72,750+ readings forecasts water quality 3 hours ahead; alerts escalate from dashboard to push to an automated voice call.",
      "A multilingual RAG assistant (Groq, ChromaDB, Sarvam) recommends fixes for low oxygen, abnormal pH, overfeeding and algal blooms; a YOLOv8 service flags inactive fish.",
      "Offline-first: sensors buffer readings, reconnect automatically and fall back to cellular in low-coverage areas, with sensor health monitoring.",
    ],
    tags: ["ESP32", "Next.js", "React Native", "Node.js", "Socket.io", "MongoDB", "scikit-learn", "RAG", "ChromaDB"],
    link: { href: "https://github.com/VeeratiAnudeepReddy/Pondfix", label: "GitHub", icon: "fab fa-github" },
  },
  {
    sim: "privacy", title: "Privacy-Preserving Browser Agent", simTitle: "On-device PII redaction",
    summary: "A zero-trust browser agent. You type or speak a task, and the sensitive parts of the page are redacted on your own device before anything reaches the backend.",
    flow: ["Extension captures DOM", "On-device Vision / OCR / NER", "Privacy Engine redacts PII", "Backend LLM + JEV plans", "Agent acts, fully traced"],
    tryIt: "Press Run agent to watch the page get captured, scanned and redacted. Switch the Privacy engine off to see what would leak.",
    points: [
      "A Chrome extension captures the DOM, screenshots and UI state locally; WebGPU/WASM models find interface elements and sensitive data.",
      "The backend never sees raw PII. It plans with the sanitized state only, using an LLM and the JEV framework.",
      "Tasks come from text, voice (Sarvam TTS, multilingual) or a mobile app that schedules them remotely over WebSockets.",
      "Every agent action is traced for auditability and debugging, and the design extends to enterprise workflows and accessibility.",
    ],
    tags: ["Chrome Extension", "WebGPU", "WASM", "OCR", "NER", "FastAPI", "LLM", "WebSockets", "Sarvam TTS"],
    link: { href: "https://github.com/VeeratiAnudeepReddy/SIH-2026", label: "GitHub", icon: "fab fa-github" },
  },
  {
    sim: "traffic", title: "Traffix – AI Urban Traffic Flow Optimization", simTitle: "Signal timing: fixed vs AI",
    summary: "Replaces fixed-timer traffic lights with signals that watch the road. Cameras count vehicles, a model predicts congestion minutes ahead, and green time follows the demand.",
    flow: ["Traffic video", "YOLO / OpenCV detection", "Density + queue length", "ML congestion forecast", "Dynamic signal control"],
    tryIt: "Compare Fixed and AI timing. The AI controller gives green time to the busier road; watch the average wait and the live readout.",
    points: [
      "Detects vehicles with YOLOv8/OpenCV and extracts density and queue length at each intersection.",
      "Blends 70% predicted and 30% live traffic to adjust green phases by +10s/-11s per direction, and coordinates downstream junctions.",
      "Cut vehicle waiting time by 29.89% versus fixed-timing signals in SUMO simulation.",
      "A real-time dashboard shows density, congestion and signal state to traffic authorities; FastAPI backend with PostgreSQL/InfluxDB.",
    ],
    tags: ["Python", "YOLOv8", "OpenCV", "FastAPI", "PostgreSQL", "InfluxDB", "SUMO"],
    link: { href: "https://github.com/VeeratiAnudeepReddy/DES_OI_Hawkins-Crew", label: "GitHub", icon: "fab fa-github" },
  },
  {
    sim: "rail", title: "RailConnect – Intelligent Railway Route Optimization", simTitle: "Route finder",
    summary: "Plans multi-hop train journeys that are fast, reliable and accessible, then scores every route for delay risk.",
    flow: ["Next.js request", "Time-expanded graph routing", "CP-SAT transfer optimization", "n8n + Gemini delay risk", "MongoDB logs"],
    tryIt: "Pick two stations, add a Via station, switch on Accessible only, then press Find route to see travel time, transfers and delay risk.",
    points: [
      "Multi-hop planning by travel time, transfers and convenience; a via-station option forces the route through a chosen station.",
      "A disability-friendly filter recommends only stations with the required accessibility facilities. 8,737 stations mapped, covering 64% of the network.",
      "Time-expanded graphs model schedules; CP-SAT keeps transfers feasible (platform occupancy, minimum turnaround, arrival and departure order).",
      "An n8n workflow asks Gemini to score delay risk and returns a description and recommendation; MongoDB stores requests, routes and optimization logs.",
    ],
    tags: ["Next.js", "Python", "MongoDB", "CP-SAT", "n8n", "Gemini"],
  },
  {
    sim: "recover", title: "Recoverix – Intelligent Shipment Piggybacking", simTitle: "Recoverix piggyback assignment",
    summary: "When a shipment goes missing, Recoverix finds a truck already heading that way, adds the recovery to its trip, and phones the driver in their own language.",
    flow: ["Shipment exception", "NetworkX graph + H3 index", "Z3 constraint solving", "Best piggyback assignment", "Sarvam voice call"],
    tryIt: "Press New exception to move the lost shipment, then Recover to see the trucks ranked, one assigned, and the driver call.",
    points: [
      "Models warehouses, hubs, vehicles and shipment dependencies as a NetworkX graph (91 hubs, 143 edges across Telangana) with H3 geospatial indexing.",
      "Z3 decides which vehicle and driver recovers the shipment, from which warehouse, under capacity, distance and deadline constraints, preferring planned trips over dedicated routes.",
      "FastAPI exposes it, and a Sarvam AI voice agent calls the driver in Telugu, explains the task and collects confirmation.",
      "1st Place, Convergence 2K26 Software Hackathon.",
    ],
    tags: ["Python", "FastAPI", "NetworkX", "H3", "Z3", "Sarvam AI", "React Native", "MongoDB"],
    link: { href: "https://github.com/VeeratiAnudeepReddy/Recoverixx", label: "GitHub", icon: "fab fa-github" },
  },
  {
    sim: "civix", title: "Civix – Civic Issue Reporting Platform", simTitle: "Civix report validation",
    summary: "Citizens report civic issues with a GPS tag, and AI checks every report before it reaches the authorities.",
    flow: ["Pin the issue", "GPS geolocation", "AI validation", "Report accepted"],
    tryIt: "Click anywhere on the map to file a report. Reports placed on a road validate; the rest are rejected.",
    points: [
      "GPS-tagged reporting platform with AI report validation, reaching 50+ users in testing.",
      "1st Place at Webathon 4.0 among 1000+ participants.",
    ],
    tags: ["Full Stack", "GPS Geolocation", "AI Validation"],
    link: { href: "https://github.com/VeeratiAnudeepReddy/Micro-Task", label: "GitHub", icon: "fab fa-github" },
  },
];

/** The numbers at the top of the page: entrance rank, grades and wins. */
export const stats = [
  { value: "1818", suffix: "", label: "EAMCET rank", plain: "1818" },
  { value: "9.37", suffix: "", label: "CGPA out of 10, B.Tech CSE at VNRVJIET", plain: "9.37" },
  { value: "4", suffix: "×", label: "Hackathon wins", plain: "4×" },
];

export const timeline = [
  {
    title: "Patent application filed", date: "31 Aug 2026", org: "VNR Vignana Jyothi Institute of Engineering and Technology",
    points: ["Filed a patent application for a closed-loop call completion and callback management system with intelligent reminder scheduling. It is now published and awaiting examination."],
  },
  {
    title: "Full Stack Developer Intern", date: "Feb 2026 – Apr 2026", org: "PSNM Innovations · Remote",
    points: [
      "Architected StudyAI, an AI learning platform that turns study material into 4 formats: explanations, quizzes, flashcards and study plans.",
      "Engineered REST APIs and LLM-based content generation, delivering the platform within a 3-month internship.",
      "Created 2 admin tools (an analytics dashboard and a content-moderation console) to track user activity and platform content.",
    ],
  },
  {
    title: "Product Team Member – Pothole Mapper", date: "2025",
    org: "VNR Vignana Jyothi Institute of Engineering and Technology · Hyderabad, India",
    points: ["Co-developed a community pothole-reporting tool and ran user-feedback cycles to improve usability."],
  },
  {
    title: "B.Tech in Computer Science & Engineering begins", date: "2024", org: "VNR Vignana Jyothi Institute of Engineering and Technology · Hyderabad",
    points: ["Started the four-year programme that led to the hackathon wins, the patent application and the projects shown on this page."],
  },
];

export const patent = {
  title: "A Closed-Loop Call Completion and Callback Management System with Intelligent Reminder Scheduling and Automated Obligation Tracking",
  number: "202641104419",
  filed: "31 August 2026",
  applicant: "VNR Vignana Jyothi Institute of Engineering and Technology",
  summary:
    "A software system that closes the loop on every call: it makes sure a call is actually completed, manages the callbacks that follow, schedules reminders intelligently, and tracks the obligations a call creates automatically, so that nothing promised on a call is left to memory.",
  steps: [
    { label: "Filed", note: "31 August 2026", done: true },
    { label: "Published", note: "Application published", done: true },
    { label: "Examination", note: "Awaiting examination", done: false },
  ],
};

export type Podium = { rank: string; event: string; scale?: string; project?: string; detail: string; tags: string[]; note?: string };

/** Competition results, from first place down. Each one carries the project that earned it. */
export const podium: Podium[] = [
  {
    rank: "1st", event: "Convergence 2K26 · Software Hackathon", project: "Recoverix – Intelligent Shipment Piggybacking",
    detail: "Won by treating shipment recovery as graph search plus constrained optimization: a NetworkX model of the Telangana freight network finds trucks with spare capacity, ranks piggyback options, assigns the best one and closes the loop with an automated driver call.",
    tags: ["NetworkX", "Optimization", "FastAPI", "React Native"],
  },
  {
    rank: "1st", event: "Convergence 2K26 · Project Contest", project: "AI-Based Urban Traffic Flow Optimization",
    detail: "Won with a traffic signal optimizer that cut vehicle waiting time by 29.89% against fixed-timing signals in SUMO simulation, blending 70% predicted and 30% live traffic data from a YOLOv8 and OpenCV pipeline.",
    tags: ["YOLOv8", "OpenCV", "SUMO"], note: "Featured in India Education Diary",
  },
  {
    rank: "1st", event: "Webathon 4.0", scale: "Among 1000+ participants", project: "Civix – Civic Issue Reporting Platform",
    detail: "Won with Civix, a GPS-tagged civic issue reporting platform with AI report validation. It reached 50+ users during testing.",
    tags: ["Full Stack", "GPS", "AI validation"],
  },
  {
    rank: "Runner-up", event: "VJ Hackathon", scale: "Among 10,000+ participants",
    detail: "Finished as runner-up in a hackathon with more than ten thousand participants.",
    tags: ["Hackathon"],
  },
  {
    rank: "First runner-up", event: "VNR Designathon 2026", scale: "Top 30 of 2,800+ registrations",
    detail: "Placed in the top 30 of more than 2,800 registrations and finished as first runner-up.",
    tags: ["Design", "Product"],
  },
];

export const competitive = [
  { icon: "fas fa-code", title: "CodeChef 2-Star", meta: "Rating 1420", detail: "A competitive programming profile built on steady data structures and algorithms practice." },
  { icon: "fas fa-flag-checkered", title: "Finalist, Solution Sprint Ideathon", meta: "Final round", detail: "Reached the finals of the Solution Sprint Ideathon." },
];

export const certifications = [
  { icon: "fab fa-microsoft", title: "Microsoft Certified: Power BI Data Analyst Associate", issuer: "Microsoft", detail: "Data modelling, analysis and dashboard reporting with Power BI." },
  { icon: "fas fa-network-wired", title: "ServiceNow Virtual Internship", issuer: "SmartBridge", detail: "A virtual internship on the ServiceNow platform, run by SmartBridge." },
  { icon: "fas fa-robot", title: "Generative AI", issuer: "Udemy", detail: "Foundations of generative AI and building applications on large language models." },
];

export const leadership = [
  { icon: "fas fa-flask", title: "Chairperson, Gamma Club", org: "Research Club of VNRVJIET", detail: "Heads the club's student research initiatives." },
  { icon: "fas fa-people-group", title: "Action Committee Member, Turing Hut Coding Club", org: "Selected from 900+ students", detail: "Part of the committee that runs the institute's coding club." },
  { icon: "fas fa-id-card", title: "Member, Computer Society of India", org: "CSI", detail: "Member of the Computer Society of India student community." },
];

export type SkillGroup = { label: string; items: string[] };
export type SkillLayer = { id: string; icon: string; title: string; tag: string; text: string; groups: SkillGroup[] };

/** The stack, classified by the layer of a system each skill works in, from what people touch down to what everything stands on. */
export const skillLayers: SkillLayer[] = [
  {
    id: "interface", icon: "fas fa-display", title: "Interface", tag: "What people touch",
    text: "Web and mobile front ends that feel quick and look deliberate.",
    groups: [
      { label: "Web", items: ["React.js", "Next.js", "Tailwind CSS", "Three.js"] },
      { label: "Mobile", items: ["React Native", "Flutter", "Android"] },
    ],
  },
  {
    id: "services", icon: "fas fa-server", title: "Services", tag: "What does the work",
    text: "APIs and servers that stay fast, validated and in sync in real time.",
    groups: [
      { label: "Frameworks", items: ["Node.js", "Express.js", "FastAPI"] },
      { label: "Interfaces", items: ["REST APIs", "Socket.io"] },
    ],
  },
  {
    id: "data", icon: "fas fa-database", title: "Data", tag: "What remembers",
    text: "The right store for the shape of the data.",
    groups: [
      { label: "Document", items: ["MongoDB", "Firebase"] },
      { label: "Relational", items: ["PostgreSQL", "Supabase"] },
      { label: "Vector", items: ["ChromaDB"] },
    ],
  },
  {
    id: "intelligence", icon: "fas fa-brain", title: "Intelligence", tag: "What decides",
    text: "Models and retrieval that let a product learn, see and reason.",
    groups: [
      { label: "ML and data", items: ["scikit-learn", "NumPy", "Pandas"] },
      { label: "Vision", items: ["YOLOv8", "OpenCV"] },
      { label: "LLMs and retrieval", items: ["LLM APIs", "RAG"] },
    ],
  },
  {
    id: "foundations", icon: "fas fa-cubes", title: "Foundations", tag: "What everything stands on",
    text: "Languages, computer science and the workflow around them.",
    groups: [
      { label: "Languages", items: ["C", "C++", "Java", "Kotlin", "Python", "JavaScript", "SQL", "HTML", "CSS"] },
      { label: "Core CS", items: ["DSA", "OOP", "DBMS", "Operating Systems"] },
      { label: "Workflow", items: ["Git", "GitHub", "Cursor", "Claude Code", "GitHub Copilot"] },
    ],
  },
];

/** Which of my projects mention a skill, taken from the project tags and bullet points. */
export function usedIn(skill: string): string[] {
  const esc = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![\\w+])${esc}(?![\\w+])`, "i");
  return projects.filter((p) => re.test([...p.tags, ...p.points, p.title].join(" "))).map((p) => p.title.split(" – ")[0]);
}
