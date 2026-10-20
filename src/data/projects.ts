import type { Project } from "./types";

/**
 * All portfolio projects, in display order.
 *
 * To add a project: copy one of the entries below, give it a new `slug`, put
 * its images in `public/images/projects/<slug>/`, and point `cover`,
 * `gallery` and `rationale` at those files. The home page, the work index and
 * `/work/<slug>` are generated from this list automatically.
 *
 * Integrity rules (see README):
 * - Only describe what you actually did. `contribution` drives the badge.
 * - No invented metrics, testimonials, research or launch claims.
 * - Rationale notes describe decisions visible in the screenshot. Rewrite them
 *   in your own words before publishing.
 */
export const projects: Project[] = [
  {
    slug: "real-estate-marketplace-africa",
    title: "Real-Estate Marketplace Africa",
    tagline:
      "A property marketplace connecting buyers, renters, sellers and agents across Africa.",
    summary: [
      "I designed the UI/UX for a digital marketplace that connects property buyers, sellers and agents across Africa, with the focus on a seamless property discovery experience.",
      "The product covers four ways people look for a place: buying, renting, short-let stays and hotels. The home screen leads with search; listing pages bring price, size and the responsible agent into one view.",
    ],
    sector: "Proptech",
    platforms: ["Responsive web"],
    contribution: "original",
    role: "UI/UX design",
    liveUrl: "https://realestatemarketplace.africa/",
    flagship: true,
    accent: "#F9B52A",
    onAccent: "#1A1408",
    cover: {
      src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
      alt: "Two phones showing Real-Estate Marketplace Africa: the home page with a location, type and price search, featured properties and category cards; and a listing page for a luxury waterfront five-bedroom duplex with a listing agent card.",
      kind: "multi-screen",
      crop: { x: 12, y: 10, w: 76, h: 80 },
      background: "#FDD98A",
    },
    rationale: {
      asset: {
        src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
        alt: "Home page and listing detail page of Real-Estate Marketplace Africa, side by side.",
        kind: "multi-screen",
        crop: { x: 22, y: 18, w: 56, h: 63 },
        background: "#FDD98A",
      },
      notes: [
        {
          x: 20.5,
          y: 14,
          title: "Search comes first",
          body: "Location, property type and price range sit in a single row at the top of the home page, so the most common question (what is available, where, for how much) can be asked before anything else.",
        },
        {
          x: 20.5,
          y: 65,
          title: "Four intents, four doors",
          body: "Buying, renting, short-let and hotel stays are separate categories with their own colour and icon, rather than one mixed feed of listings.",
        },
        {
          x: 75,
          y: 35,
          title: "The essentials above the description",
          body: "On a listing, price per period, bedrooms, bathrooms and floor area are summarised in one strip before the longer description and amenity list.",
        },
        {
          x: 89,
          y: 31,
          title: "A person, not just a property",
          body: "The listing agent's card, with call and email actions, stays beside the property details, so contacting someone is always one step away.",
        },
      ],
    },
    gallery: [
      {
        src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
        alt: "Real-Estate Marketplace Africa home page: hero search, featured properties grid, browse by category and a call to list your property.",
        kind: "mobile",
        caption: "Home: search, featured properties and categories",
        crop: { x: 23, y: 19.5, w: 21.5, h: 58.5 },
        background: "#FDD98A",
      },
      {
        src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
        alt: "Real-Estate Marketplace Africa listing detail page for a luxury waterfront five-bedroom duplex, with price per day, room counts, amenities, listing agent and similar properties.",
        kind: "mobile",
        caption: "Listing detail: summary, amenities, agent and similar homes",
        crop: { x: 55.5, y: 20.5, w: 20.5, h: 59 },
        background: "#FDD98A",
      },
    ],
    pending: [
      {
        label: "Desktop screens (home, search results, listing)",
        expectedPath: "/images/projects/real-estate-marketplace-africa/desktop-*.png",
        kind: "desktop",
      },
    ],
  },
  {
    slug: "go-x",
    title: "Go-X",
    tagline: "Ride the future: renting advanced electric vehicles.",
    summary: [
      "Go-X provides advanced electric vehicles for anyone to rent, as a ride-hailing and rental product.",
    ],
    sector: "Mobility",
    platforms: ["Mobile app"],
    contribution: "unconfirmed",
    accent: "#2E3A59",
    onAccent: "#FFFFFF",
    pending: [
      {
        label: "Key mobile screens (booking, vehicle selection, trip)",
        expectedPath: "/images/projects/go-x/*.png",
        kind: "mobile",
      },
    ],
  },
  {
    slug: "learnyx",
    title: "Learnyx",
    tagline:
      "A school management system: one place for students, staff and academic records.",
    summary: [
      "I designed a school management platform that gives schools a centralised database for managing students, staff, academic records and administrative operations.",
      "The screen shown here is the 'My Subjects' view, where results for each assigned subject are entered and move through draft, approval and return states.",
    ],
    sector: "Education",
    platforms: ["Web app"],
    contribution: "original",
    role: "UI/UX design",
    accent: "#1C1C1E",
    onAccent: "#FFFFFF",
    cover: {
      src: "/images/projects/learnyx/teacher-my-subjects-dashboard.png",
      alt: "Learnyx 'My Subjects' dashboard listing five subjects with class, session, term, a status chip (Draft, Pending Approval, Returned, Approved) and an action button for each.",
      kind: "desktop",
      background: "#F4F4F4",
    },
    rationale: {
      asset: {
        src: "/images/projects/learnyx/teacher-my-subjects-dashboard.png",
        alt: "Learnyx 'My Subjects' dashboard with status chips and per-row actions.",
        kind: "desktop",
        background: "#F4F4F4",
      },
      notes: [
        {
          x: 13,
          y: 33.5,
          title: "Navigation mirrors the workflow",
          body: "Drafts, Returned and Approved appear in the sidebar as destinations of their own, matching the states a result moves through.",
        },
        {
          x: 36,
          y: 24.2,
          title: "Filter by status, with a live count",
          body: "A single status filter sits above the table, and 'Showing 5 of 5 subjects' confirms what the filter is currently hiding.",
        },
        {
          x: 60.5,
          y: 50,
          title: "Status is never colour alone",
          body: "Each state pairs a colour with an icon and a written label, so Draft, Pending Approval, Returned and Approved stay distinguishable for colour-blind users.",
        },
        {
          x: 93.5,
          y: 43.4,
          title: "The action follows the state",
          body: "Rows that need work offer 'Enter', approved rows offer 'View', and a row awaiting approval shows a greyed-out button instead.",
        },
      ],
    },
    gallery: [
      {
        src: "/images/projects/learnyx/teacher-my-subjects-dashboard.png",
        alt: "Close-up of the Learnyx status and action columns: Draft with Enter, Pending Approval with a greyed button, Returned with Enter, Approved with View.",
        kind: "detail",
        caption: "Close-up: status chips and their matching actions",
        crop: { x: 62, y: 29, w: 30.5, h: 37.5 },
        background: "#FFFFFF",
      },
    ],
    pending: [
      {
        label: "Admin overview, student records and result entry screens",
        expectedPath: "/images/projects/learnyx/*.png",
        kind: "desktop",
      },
    ],
  },
  {
    slug: "silicon-pay",
    title: "Silicon Pay",
    tagline: "A digital wallet with rewards.",
    summary: ["A digital wallet and rewards product."],
    sector: "Fintech",
    platforms: ["Mobile app"],
    contribution: "unconfirmed",
    accent: "#1F4E4A",
    onAccent: "#FFFFFF",
    pending: [
      {
        label: "Wallet, transfer and rewards screens",
        expectedPath: "/images/projects/silicon-pay/*.png",
        kind: "mobile",
      },
    ],
  },
  {
    slug: "meemgen",
    title: "MeemGen",
    tagline: "A meme-generation product.",
    summary: ["A product for generating memes."],
    sector: "Consumer",
    platforms: ["App"],
    contribution: "unconfirmed",
    accent: "#E3684A",
    onAccent: "#1A0C08",
    pending: [
      {
        label: "Editor and template screens",
        expectedPath: "/images/projects/meemgen/*.png",
        kind: "mobile",
      },
    ],
  },
  {
    slug: "trimly",
    title: "Trimly",
    tagline: "Intuitive user flows and a modern interface for a digital platform.",
    summary: [
      "I contributed to the UI/UX design of a digital platform, focusing on intuitive user flows and modern interface design to improve the overall experience.",
    ],
    sector: "Digital platform",
    platforms: ["App"],
    contribution: "team",
    role: "UI/UX design contributor",
    accent: "#5B4E8C",
    onAccent: "#FFFFFF",
    pending: [
      {
        label: "Screens you contributed to",
        expectedPath: "/images/projects/trimly/*.png",
        kind: "mobile",
      },
    ],
  },
  {
    slug: "port-dealer",
    title: "Port Dealer",
    tagline: "A car export platform for global dealers, built with a cross-functional team.",
    summary: [
      "I collaborated with a cross-functional team to design and develop a web platform for port dealers, improving usability and making services and information easier to reach.",
      "The site brings new cars for export, used-car listings with filters, an auto-parts collection and news together on one page.",
    ],
    sector: "Automotive",
    platforms: ["Website"],
    contribution: "team",
    role: "Design & development, as part of a team",
    accent: "#E3262B",
    onAccent: "#FFFFFF",
    cover: {
      src: "/images/projects/port-dealer/homepage-mobile-mockup.webp",
      alt: "Port Dealer homepage in a phone mockup: hero headline about Nigerian car export, auto-parts collection, news, new cars for export, used car listings with filters and client reviews.",
      kind: "mobile",
      background: "#F3F1EE",
      focus: { x: 50, y: 0 },
    },
    gallery: [
      {
        src: "/images/projects/port-dealer/homepage-mobile-mockup.webp",
        alt: "Port Dealer hero section with headline, contact buttons, auto-parts collection, news card and quick links.",
        kind: "detail",
        caption: "Hero, auto-parts collection and quick links",
        crop: { x: 4, y: 2, w: 92, h: 29 },
        background: "#F3F1EE",
      },
      {
        src: "/images/projects/port-dealer/homepage-mobile-mockup.webp",
        alt: "Port Dealer used-car section: filters by brand, model, mileage, price and body type beside a grid of listings with year, mileage, fuel type and price.",
        kind: "detail",
        caption: "Used-car listings with brand, price and body-type filters",
        crop: { x: 8, y: 51, w: 85, h: 30 },
        background: "#FFFFFF",
      },
    ],
  },
  {
    slug: "dual-theme-landing",
    title: "Dual-Theme Landing Exploration",
    tagline:
      "One landing layout, two visual identities: a timeless photography studio and a neon city.",
    summary: [
      "The same page structure (navigation, headline, circular hero image, thumbnail strip and a now-playing card) presented in two themes: a light, serif photography studio and a dark, neon city.",
    ],
    sector: "Visual exploration",
    platforms: ["Desktop web"],
    contribution: "concept",
    accent: "#18C9C4",
    onAccent: "#081A1A",
    cover: {
      src: "/images/projects/dual-theme-landing/light-and-neon-themes-laptops.webp",
      alt: "Two laptops showing the same landing page layout: on the left a light, serif 'Timeless Photography' theme with a portrait; on the right a dark teal 'Neon Lights, Infinite Possibilities' theme with an illustrated character.",
      kind: "multi-screen",
      background: "#A89150",
    },
    gallery: [
      {
        src: "/images/projects/dual-theme-landing/light-and-neon-themes-laptops.webp",
        alt: "Light theme: 'Timeless Photography — Trend-forward images that tell your story' with a brown Learn More button.",
        kind: "desktop",
        caption: "Light theme",
        crop: { x: 16.5, y: 24.5, w: 31.5, h: 39 },
        background: "#A89150",
      },
      {
        src: "/images/projects/dual-theme-landing/light-and-neon-themes-laptops.webp",
        alt: "Neon theme: 'Neon runs through the veins of the city. Are you ready to plug in?' with a magenta Learn More button.",
        kind: "desktop",
        caption: "Neon theme",
        crop: { x: 57, y: 24.5, w: 31.5, h: 39 },
        background: "#0E3D47",
      },
    ],
  },
];

export const flagship = projects.find((p) => p.flagship) ?? projects[0];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
