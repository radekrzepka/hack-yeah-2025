import { Button, TypographyH1, TypographyP } from "@hackathon/ui";

export default function Header() {
  return (
    <div className="bg-background mx-auto mt-1 flex h-auto flex-col gap-6 p-6 lg:mt-20 lg:h-1/4 lg:flex-row">
      {/* Photo placeholder - shown first on mobile, second on desktop */}
      <div className="bg-accent order-1 w-full rounded-2xl p-10 lg:order-2 lg:w-1/2">
        <p className="text-center">photo placeholder</p>
        <button></button>
      </div>

      {/* Text content - shown second on mobile, first on desktop */}
      <div className="order-2 w-full px-0 lg:order-1 lg:w-1/2 lg:px-6">
        <TypographyH1 className="mx-auto ml-0 flex w-fit justify-center py-6 text-center text-xl font-bold text-black sm:text-2xl">
          Myśl o jutrze, działaj dziś
        </TypographyH1>
        <TypographyP className="text-sm sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
          obcaecati dolorem libero! Numquam cum rem sunt nobis nihil, excepturi
          at, doloremque omnis rerum voluptatum assumenda, odio quos ex magni
          reprehenderit!
        </TypographyP>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button className="border-primary text-primary border-spacing-1 border-y border-gray-300 bg-white p-3 shadow-lg hover:text-white lg:border-x">
            Oblicz moją emeryturę
          </Button>
          <Button className="border-primary text-primary border-spacing-1 border-y border-gray-300 bg-white p-3 shadow-lg hover:text-white lg:border-x">
            Dowiedz się więcej
          </Button>
        </div>
      </div>
    </div>
  );
}
