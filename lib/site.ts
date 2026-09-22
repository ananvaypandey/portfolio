export const basePath = "/portfolio";

export const site = {
  name: "Ananvay Pandey",
  firstName: "Ananvay",
  role: "AI × Software × Hardware",
  descriptor: "B.Tech CSE Student · Technology Builder · Founder",
  location: "India",
  email: "ananvaypandey29@gmail.com",
  resumeUrl: `${basePath}/Resume.pdf`,
  tagline: "Building intelligent systems that move from screen to reality.",
  bio: "I'm Ananvay Pandey, a B.Tech Computer Science & Engineering student and technology builder who enjoys turning ambitious ideas into working products.\n\nMy work sits at the intersection of Artificial Intelligence, Software, Hardware, Robotics, and Product Development.\n\nI don't just want to understand how technology works. I want to build what it can become.",
  socials: {
    github: "https://github.com/ananvaypandey",
    linkedin: "https://in.linkedin.com/in/ananvay-pandey-98aa94309",
    youtube: "https://www.youtube.com/@ananvayio",
    instagram: "https://www.instagram.com/ananvay.io/",
    medium: "https://medium.com/@ananvaypandey29",
    company: {
      name: "VOIKES Technologies",
      instagram: "https://www.instagram.com/voikes.technologies/",
    },
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Play", href: "/play" },
  { label: "Blog", href: "/blog" },
  { label: "News", href: "/news" },
  { label: "Wall", href: "/wall" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
] as const;