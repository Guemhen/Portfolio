export const site = {
  name: "Joshua Osaguemhen Idogun",
  firstName: "Joshua",
  lastName: "Idogun",
  role: "Product Designer",
  statement: "Designing digital experiences with purpose, clarity, and intention.",
  /**
   * Small availability / current-focus indicator in the hero.
   * Leave null unless it is true right now, e.g. "Open to product design roles".
   */
  status: null as string | null,
  email: "guemhen16@gmail.com",
  /** Links with an empty href are hidden. */
  links: [
    { label: "LinkedIn", href: "" },
    { label: "Behance", href: "" },
    { label: "Dribbble", href: "" },
  ],
  portrait: {
    /** Transparent cutout used in the hero (PNG with alpha). */
    cutout: "/images/profile/joshua-idogun-cutout.png",
    /** Untouched original photo, used for social previews. */
    original: "/images/profile/joshua-idogun-original.jpg",
    alt: "Joshua Idogun in sunglasses and a grey patterned shirt, hands in the pockets of navy trousers.",
  },
  about: {
    lead: "Product Designer with a Computer Science background.",
    body: [
      "I combine visual craft, structured problem-solving and product thinking to design mobile and web experiences that are simple, intuitive and easy to use, from wireframes and prototypes to polished interfaces in Figma.",
      "I studied Computer Science at Babcock University. My work spans fintech, education, property and mobility products, collaborating with others to solve user problems.",
    ],
    aside:
      "I have also competed professionally in Call of Duty: Mobile with Xclusive Gaming Esports, including at the World Championship, which sharpened my teamwork and decision-making under pressure.",
  },
  /** Only list skills that reflect your real experience. */
  skills: [
    "UI/UX and product design",
    "User flows and wireframing",
    "Prototyping and interaction design",
    "User research",
    "Design systems",
    "Product thinking",
    "Figma",
    "Collaboration with developers",
  ],
  education: { degree: "B.Sc. Computer Science", school: "Babcock University" },
  /**
   * Show labelled gaps for case-study content you have not supplied yet
   * (research, flows, wireframes, constraints…). Set to false before launch
   * to hide empty sections instead.
   */
  showContentPlaceholders: true,
};

/**
 * The highlight row under the hero. Verifiable items only: the project count
 * is computed from the data, everything else is a fact from your CV.
 */
export const highlights = (projectCount: number) => [
  { label: "Selected projects", value: String(projectCount).padStart(2, "0"), numeric: true },
  { label: "Discipline", value: "Product design" },
  { label: "Background", value: "Computer Science" },
  { label: "Primary tool", value: "Figma" },
];
