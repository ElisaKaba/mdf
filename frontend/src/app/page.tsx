import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section>
          <h2>Qui sommes-nous ?</h2>
        </section>

        <section>
          <h2>Nos actions</h2>
        </section>

        <section>
          <h2>Agenda</h2>
        </section>

        <section>
          <h2>S’impliquer</h2>
        </section>
      </main>

      <Footer />
    </>
  );
}