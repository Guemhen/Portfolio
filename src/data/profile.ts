export interface Profile {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  intro: string;
  about: string[];
  email: string;
  /** Leave a link empty ("") to hide it. */
  links: { label: string; href: string }[];
  photo: {
    /**
     * Path under /public. Change this one line to use a different photo.
     * Set to null (or point at a missing file) and a monogram fallback is shown.
     */
    src: string | null;
    alt: string;
    /** Focal point for cropping, in percent. Keeps the face in frame at every aspect ratio. */
    focus: { x: number; y: number };
  };
  /**
   * Verifiable facts only. The project count is computed from the project
   * list so it can never drift out of date.
   */
  facts: { value: string; label: string }[];
  education: { school: string; degree: string };
  experience: { title: string; org?: string; points: string[] }[];
  skills: string[];
}

export const profile: Profile = {
  name: "Joshua Osaguemhen Idogun",
  shortName: "Joshua Idogun",
  role: "UI/UX Designer",
  headline: "Simple, intuitive products, from property search to school records.",
  intro:
    "I'm a UI/UX designer and Computer Science graduate. I turn ideas into wireframes, prototypes and polished interfaces in Figma, for web and mobile, across fintech, education, property and mobility.",
  about: [
    "I studied Computer Science at Babcock University and design mobile and web experiences that are simple, intuitive and easy to use. I enjoy working with people, learning new skills and contributing to projects that make a positive impact.",
    "I have also competed professionally in Call of Duty: Mobile with Xclusive Gaming Esports, including at the Call of Duty: Mobile World Championship. Design and competitive esports have both strengthened my teamwork, adaptability and ability to perform well under pressure.",
  ],
  email: "guemhen16@gmail.com",
  links: [
    { label: "LinkedIn", href: "" },
    { label: "Behance", href: "" },
    { label: "Dribbble", href: "" },
  ],
  photo: {
    src: "/images/profile/joshua-idogun-portrait.jpg",
    alt: "Portrait of Joshua Idogun wearing sunglasses, a grey patterned shirt and navy trousers, standing against a warm sand-coloured wall.",
    focus: { x: 50, y: 22 },
  },
  facts: [
    { value: "B.Sc.", label: "Computer Science, Babcock University" },
    { value: "Pro", label: "CoD: Mobile esports player, World Championship" },
  ],
  education: {
    school: "Babcock University",
    degree: "Bachelor of Science (B.Sc.) in Computer Science",
  },
  experience: [
    {
      title: "UI/UX Designer",
      points: [
        "Designed mobile and web experiences that are simple, intuitive and easy to use.",
        "Turned ideas into wireframes, prototypes and polished designs using Figma.",
        "Worked on fintech, education and sustainability projects, collaborating with others to solve user problems.",
      ],
    },
    {
      title: "Professional Esports Player",
      org: "Xclusive Gaming Esports",
      points: [
        "Competed in high-level Call of Duty: Mobile tournaments, including the Call of Duty: Mobile World Championship.",
        "Developed strategies with teammates and made decisions under pressure in high-stakes moments.",
        "Maintained performance through consistent training and analysis.",
      ],
    },
  ],
  skills: [
    "UI/UX design",
    "User research",
    "Wireframing & prototyping",
    "Figma",
    "Mobile app design",
    "Web design",
    "Problem solving",
    "Team collaboration",
  ],
};
