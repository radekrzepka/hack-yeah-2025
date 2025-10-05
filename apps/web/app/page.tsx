import Form from "./(landing)/_components/form";
import FunFacts from "./(landing)/_components/fun-facts";
import Header from "./(landing)/_components/header";
import { SeeMore } from "./(landing)/_components/see-more";

import { getLandingData } from "./(landing)/_api/get-landing-data";

export default async function Dashboard() {
  const data = await getLandingData();
  return (
    <div className="w-[80vw] mx-auto">
      <Header />
      <div className="mx-auto">
        <FunFacts initialData={data} />
        <SeeMore initialData={data} />
        <Form />
      </div>
    </div>
  );
}
