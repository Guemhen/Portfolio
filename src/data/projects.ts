import type { Project } from "./types";

/**
 * All portfolio projects, in display order.
 *
 * Add a project: copy an entry, give it a new `slug`, put its images in
 * `public/images/projects/<slug>/`, and fill in what you can. The home page,
 * the work index and `/work/<slug>` are generated from this list.
 *
 * Integrity rules (see README):
 * - `contribution` must describe what you actually did.
 * - No invented research, metrics, testimonials, launch or business claims.
 * - Anything drafted from a screenshot is flagged (`draft: true` or `review`)
 *   so the asset check reminds you to confirm it in your own words.
 */
export const projects: Project[] = [
  {
    slug: "real-estate-marketplace-africa",
    title: "Real-Estate Marketplace Africa",
    tagline: "A redesigned property marketplace connecting buyers, renters, sellers and agents across Africa.",
    sector: "Proptech",
    platforms: ["Responsive web"],
    contribution: "redesign",
    role: "Product design (redesign)",
    flagship: true,
    // The company's live site is deliberately not linked: it may not reflect
    // this redesign, and launch status has not been confirmed.
    overview: [
      "I redesigned the UI/UX of a digital marketplace that connects property buyers, sellers and agents across Africa, focusing on a seamless property discovery experience.",
      "The redesign covers four ways people look for a place (buying, renting, short-let stays and hotels), a search-led home page and a listing page that brings price, size and the responsible agent into one view.",
    ],
    // Your words, from the visual-identity Design Decision Card below.
    challenge:
      "The company requested a revamp of its old website design. The challenge was to give the existing experience a fresh, distinctive visual identity that felt more modern and aesthetically refined.",
    finalUiNote: "From a search-led home page to a listing with its agent one tap away.",
    review: ["overview[1]", "finalUiNote"],
    accent: "#F9B52A",
    cover: {
      src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
      alt: "Two phones showing the Real-Estate Marketplace Africa redesign: the home page with a location, type and price search, featured properties and category cards; and a listing page for a luxury waterfront five-bedroom duplex with a listing agent card.",
      kind: "multi-screen",
      background: "#FDD98A",
    },
    rationaleAsset: {
      src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
      alt: "Home page and listing detail page of the Real-Estate Marketplace Africa redesign, side by side.",
      kind: "multi-screen",
      crop: { x: 22, y: 18, w: 56, h: 63 },
      background: "#FDD98A",
    },
    decisionCards: [
      {
        id: "visual-identity",
        project: "Real-Estate Marketplace Africa (REM)",
        element: "Overall website visual identity, typography, and interface styling",
        question:
          "How can I revamp the existing website into a sharper, more modern, futuristic experience while maintaining clarity and usability?",
        problem:
          "The company requested a revamp of its old website design. The challenge was to give the existing experience a fresh, distinctive visual identity that felt more modern and aesthetically refined.",
        reasoning:
          "I gravitate towards futuristic, cyberpunk-inspired aesthetics, particularly designs with sharp details, clean layouts, and a strong visual identity. I used that preference to guide the visual direction of REM. The Jura typeface reinforces the futuristic feel while helping give the interface a distinctive character.",
        tradeoff:
          "I prioritised visual sharpness, typography, and a cohesive futuristic aesthetic. I wanted the design to feel bold and visually polished without making the interface unnecessarily complicated. The goal was to balance my preferred visual style with the need for a clear, usable real-estate platform.",
        principle: "Distinctive visual identity through purposeful simplicity.",
        principleDetail:
          "Use typography, spacing, and sharp visual elements to create a memorable interface while keeping the experience clear and easy to navigate.",
        keywords: ["Futuristic visual identity", "Jura typeface", "Purposeful simplicity"],
        emphasis: ["futuristic, cyberpunk-inspired aesthetics", "Jura typeface", "visual sharpness", "distinctive visual identity", "purposeful simplicity", "clear, usable"],
        sources: {
          problem: "company-brief",
          reasoning: "aesthetic-preference",
          tradeoff: "designer-judgement",
        },
        visual: {
          src: "/images/projects/real-estate-marketplace-africa/home-and-listing-detail-mobile.webp",
          alt: "The REM revamp: home page and listing detail page, showing the Jura typeface, sharp card edges and amber accents.",
          kind: "multi-screen",
          crop: { x: 22, y: 18, w: 56, h: 63 },
          background: "#FDD98A",
        },
        focus: {
          reasoning: { x: 74.6, y: 29.3, scale: 2, label: "Jura headings: listing title and price" },
          tradeoff: { x: 20.5, y: 32, scale: 1.6, label: "Clean grid and generous spacing on the home page" },
        },
      },
    ],
    decisions: [
      {
        title: "Search comes first",
        pin: { x: 20.5, y: 14 },
        decision: "Location, property type and price range sit in one row at the top of the home page, with a single search action.",
        userNeed: "Most visitors arrive with a place, a kind of property and a budget in mind, and want to see what matches.",
        rationale: "Putting the three filters people decide on first above everything else lets them ask their question immediately, instead of browsing featured listings that may not fit.",
        tradeoffs: "Editorial content such as featured properties moves below the fold on smaller screens.",
        draft: true,
      },
      {
        title: "Four intents, four doors",
        pin: { x: 20.5, y: 65 },
        decision: "Buying, renting, short-let and hotel stays are separate categories, each with its own colour and icon.",
        userNeed: "Someone looking for a hotel night and someone buying a home need very different listings, prices and details.",
        rationale: "Separating intents early keeps every list relevant and lets each category show the price format that fits it (total, per month, per night).",
        tradeoffs: "One extra choice before browsing, in exchange for result lists that are not mixed.",
        draft: true,
      },
      {
        title: "Essentials above the description",
        pin: { x: 75, y: 35 },
        decision: "On a listing, price per period, bedrooms, bathrooms and floor area are summarised in one strip above the longer description and amenity list.",
        userNeed: "People compare several properties quickly and need the deciding facts at a glance.",
        rationale: "A consistent summary strip makes listings comparable without reading each description.",
        tradeoffs: "Less room for imagery in the first screen of the listing.",
        draft: true,
      },
      {
        title: "A person, not just a property",
        pin: { x: 89, y: 31 },
        decision: "The listing agent's card, with call and email actions, sits beside the property details.",
        userNeed: "Once a property looks right, the next step is talking to someone responsible for it.",
        rationale: "Keeping the agent visible next to the details makes contact one step away instead of a separate page.",
        tradeoffs: "The side column narrows the main content area on desktop.",
        draft: true,
      },
    ],
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
      { label: "Information architecture / user flows", expectedPath: "/images/projects/real-estate-marketplace-africa/flow-*.png", kind: "flow" },
      { label: "Wireframes", expectedPath: "/images/projects/real-estate-marketplace-africa/wireframe-*.png", kind: "wireframe" },
      { label: "Desktop screens (home, search results, listing)", expectedPath: "/images/projects/real-estate-marketplace-africa/desktop-*.png", kind: "desktop" },
      { label: "Before (the original product) for a before/after comparison", expectedPath: "/images/projects/real-estate-marketplace-africa/before-*.png", kind: "before" },
    ],
  },
  {
    slug: "go-x",
    title: "Go-X",
    tagline: "Ride the future: a ride-hailing and electric-vehicle rental product.",
    sector: "Mobility",
    platforms: ["Mobile app"],
    contribution: "unconfirmed",
    overview: ["Go-X provides advanced electric vehicles for anyone to rent."],
    accent: "#5B8CFF",
    pending: [
      { label: "Key mobile screens (booking, vehicle selection, trip)", expectedPath: "/images/projects/go-x/*.png", kind: "mobile" },
    ],
  },
  {
    slug: "learnyx",
    title: "Learnyx",
    tagline: "A school management platform: one place for students, staff and academic records.",
    sector: "Education",
    platforms: ["Web app"],
    contribution: "original",
    role: "UI/UX design",
    overview: [
      "I designed a school management platform that gives schools a centralised database for managing students, staff, academic records and administrative operations.",
      "The screen shown is 'My Subjects', where results for each assigned subject are entered and move through draft, approval and return states.",
    ],
    accent: "#E8E8EA",
    cover: {
      src: "/images/projects/learnyx/teacher-my-subjects-dashboard.png",
      alt: "Learnyx 'My Subjects' dashboard listing five subjects with class, session, term, a status chip (Draft, Pending Approval, Returned, Approved) and an action button for each.",
      kind: "desktop",
      background: "#F4F4F4",
    },
    rationaleAsset: {
      src: "/images/projects/learnyx/teacher-my-subjects-dashboard.png",
      alt: "Learnyx 'My Subjects' dashboard with status chips and per-row actions.",
      kind: "desktop",
      background: "#F4F4F4",
    },
    decisions: [
      {
        title: "Navigation mirrors the workflow",
        pin: { x: 13, y: 33.5 },
        decision: "Drafts, Returned and Approved are destinations in the sidebar, matching the states a result moves through.",
        userNeed: "Staff need to find the results that need their attention without scanning every subject.",
        rationale: "Mapping navigation to workflow states turns 'what do I need to do?' into a single click.",
        tradeoffs: "A longer sidebar, and the same result can be reached from more than one place.",
        draft: true,
      },
      {
        title: "Filter by status, with a live count",
        pin: { x: 36, y: 24.2 },
        decision: "One status filter sits above the table, and 'Showing 5 of 5 subjects' confirms what the filter is hiding.",
        userNeed: "When a filter is applied, people need to know they are not seeing everything.",
        rationale: "A count next to the filter prevents the 'where did my subject go?' moment.",
        tradeoffs: "Only one filter dimension is exposed; class or session filtering would need another control.",
        draft: true,
      },
      {
        title: "Status is never colour alone",
        pin: { x: 60.5, y: 50 },
        decision: "Each state pairs a colour with an icon and a written label.",
        userNeed: "Draft, Pending Approval, Returned and Approved must be distinguishable for everyone, including colour-blind users.",
        rationale: "Redundant cues (colour + icon + text) keep status readable in any condition.",
        tradeoffs: "Chips take more horizontal space than colour dots.",
        draft: true,
      },
      {
        title: "The action follows the state",
        pin: { x: 93.5, y: 43.4 },
        decision: "Rows that need work offer 'Enter', approved rows offer 'View', and a row awaiting approval shows a greyed-out button.",
        userNeed: "People should only be offered actions that make sense for the current state of a result.",
        rationale: "State-specific actions stop people editing results that are already under review.",
        tradeoffs: "The action column is not uniform, so its meaning has to be learnt.",
        draft: true,
      },
    ],
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
      { label: "Admin overview, student records and result entry screens", expectedPath: "/images/projects/learnyx/*.png", kind: "desktop" },
      { label: "User flows (result submission and approval)", expectedPath: "/images/projects/learnyx/flow-*.png", kind: "flow" },
    ],
  },
  {
    slug: "silicon-pay",
    title: "Silicon Pay",
    tagline: "A digital wallet and rewards experience.",
    sector: "Fintech",
    platforms: ["Mobile app"],
    contribution: "unconfirmed",
    overview: ["A digital wallet and rewards product."],
    accent: "#36D399",
    pending: [{ label: "Wallet, transfer and rewards screens", expectedPath: "/images/projects/silicon-pay/*.png", kind: "mobile" }],
  },
  {
    slug: "meemgen",
    title: "MeemGen",
    tagline: "A meme-generation product.",
    sector: "Consumer",
    platforms: ["App"],
    contribution: "unconfirmed",
    overview: ["A product for generating memes."],
    accent: "#FF6B9A",
    pending: [{ label: "Editor and template screens", expectedPath: "/images/projects/meemgen/*.png", kind: "mobile" }],
  },
  {
    slug: "trimly",
    title: "Trimly",
    tagline: "Intuitive user flows and a modern interface for a digital platform.",
    platforms: ["App"],
    contribution: "team",
    role: "UI/UX design contributor",
    overview: [
      "I contributed to the UI/UX design of a digital platform, focusing on intuitive user flows and modern interface design to improve the overall experience.",
    ],
    accent: "#B18CFF",
    pending: [{ label: "Screens you contributed to", expectedPath: "/images/projects/trimly/*.png", kind: "mobile" }],
  },
  {
    slug: "port-dealer",
    title: "Port Dealer",
    tagline: "A car export website for global dealers, built with a cross-functional team.",
    sector: "Automotive",
    platforms: ["Website"],
    contribution: "team",
    role: "Design and development, as part of a cross-functional team",
    // Add the specific pages, components or responsibilities that were yours:
    // contributionDetail: "...",
    overview: [
      "I collaborated with a cross-functional team to design and develop a web platform for port dealers, improving usability and making services and information easier to reach.",
      "The homepage brings new cars for export, used-car listings with filters, an auto-parts collection and news together.",
    ],
    accent: "#FF4B4B",
    cover: {
      src: "/images/projects/port-dealer/homepage-mobile-mockup.webp",
      alt: "Port Dealer homepage in a phone mockup: hero headline about Nigerian car export, auto-parts collection, news, new cars for export, used car listings with filters and a reviews section.",
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
    tagline: "One landing layout, two visual identities: a timeless photography studio and a neon city.",
    sector: "Visual exploration",
    platforms: ["Desktop web"],
    contribution: "concept",
    overview: [
      "The same page structure (navigation, headline, circular hero image, thumbnail strip and a now-playing card) presented in two themes: a light, serif photography studio and a dark, neon city.",
    ],
    accent: "#18C9C4",
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
