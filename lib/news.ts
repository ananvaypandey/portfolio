export interface NewsArticle {
  title: string;
  source: string;
  kind: string;
  date: string;
  excerpt: string;
  url: string;
}

export const newsArticles: NewsArticle[] = [
  {
    title:
      "From a College Dream to a Company: The Story of VOIKES Technologies",
    source: "Medium",
    kind: "Essay",
    date: "2026-09-15",
    excerpt:
      "How a college idea grew into VOIKES Technologies — the journey from a single ambitious dream to building intelligent products at the edge of AI, software, and hardware.",
    url: "https://medium.com/@ananvaypandey29/from-a-college-dream-to-a-company-the-story-of-voikes-technologies-08b6bce4f5f4",
  },
  {
    title:
      "From Building Projects to Building Human-Centric Technology: How Ananvay Pandey Is Reimagining Assistive Technology in India",
    source: "The Hindustan Wires",
    kind: "Feature",
    date: "2026-08-22",
    excerpt:
      "There is a new generation of Indian founders building technology not simply to make things smarter, but to make people's lives better. Ananvay Pandey, Founder & CEO of VOIKES Technologies, is shaping a human-centric vision across assistive technology, MedTech, AI, and companion devices.",
    url: "https://thehindustanwires.com/headline/",
  },
];