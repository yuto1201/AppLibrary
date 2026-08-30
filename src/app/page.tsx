import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { AppsSection } from "@/components/AppsSection";
import { Posts, Contact, Footer } from "@/components/Sections";

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <AppsSection />
      <Posts />
      <Contact />
      <Footer />
    </>
  );
}
