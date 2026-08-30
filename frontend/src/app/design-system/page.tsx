import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import SectionTitle from "@/components/ui/SectionTitle";

export default function DesignSystemPage() {
  return (
    <main>
      <Container>
        <div
          style={{
            paddingBlock: "4rem",
            display: "grid",
            gap: "4rem",
          }}
        >
          <section>
            <SectionTitle
              title="Design System MDF"
              subtitle="Base visuelle du site Maison des Femmes."
            />
          </section>

          <section>
            <h3>Boutons</h3>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Button href="#">
                Bouton principal
              </Button>

              <Button href="#" variant="secondary">
                Bouton secondaire
              </Button>
            </div>
          </section>

          <section>
            <h3>Pills</h3>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <Pill label="Tous" active />
              <Pill label="Ateliers" />
              <Pill label="Permanences" />
              <Pill label="Événements" />
            </div>
          </section>

          <section>
            <h3>Carte</h3>

            <div style={{ maxWidth: "380px" }}>
              <Card>
                <p>12 septembre 2026</p>
                <h4>Atelier estime de soi</h4>
                <p>
                  Un atelier collectif proposé par la Maison des Femmes.
                </p>

                <Button href="#" variant="secondary">
                  Découvrir
                </Button>
              </Card>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}