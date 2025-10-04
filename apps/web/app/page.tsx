import FunFacts from "./(landing)/_components/fun-facts";
import Header from "./(landing)/_components/header";
import { SeeMore } from "./(landing)/_components/see-more";

import { getLandingData } from "./(landing)/_api/get-landing-data";

export default async function Dashboard() {
  const data = await getLandingData(); 
  return (
    <div className="bg-primary w-full">
      <Header />
      <SeeMore />
      <FunFacts initialData={data} />
    </div>
  );
}
