import Form from "./(landing)/_components/form";
import FunFacts from "./(landing)/_components/fun-facts";
import Header from "./(landing)/_components/header";
import { SeeMore } from "./(landing)/_components/see-more";

import { getLandingData } from "./(landing)/_api/get-landing-data";

export default async function Dashboard() {
  const data = await getLandingData();
  return (
    <div className="mx-auto w-[80vw]">
      <section aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="sr-only">
          Strona główna ZUSometr - Kalkulator emerytalny
        </h1>
        <Header />
      </section>
      <div className="mx-auto">
        <section aria-labelledby="fun-facts-heading">
          <h2 id="fun-facts-heading" className="sr-only">
            Ciekawostki emerytalne
          </h2>
          <FunFacts initialData={data} />
        </section>
        <SeeMore initialData={data} />
        <section aria-labelledby="calculator-heading">
          <h2 id="calculator-heading" className="sr-only">
            Kalkulator emerytury
          </h2>
          <Form />
        </section>
      </div>
    </div>
  );
}
