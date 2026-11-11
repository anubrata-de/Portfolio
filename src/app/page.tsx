import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { Capabilities } from "@/components/home/Capabilities";
import { Milestones } from "@/components/home/Milestones";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <SelectedProjects />
      <Capabilities />
      <Milestones />
      <ContactCTA />
    </>
  );
}
