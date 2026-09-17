import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import projects from "./projectData";

export default function Projects() {
  return (
    <section id="projects" className="relative py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="projects"
          title="Things I've built"
          subtitle="AI × hardware experiments and products — from idea to prototype."
        />

        <FeaturedProject />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}