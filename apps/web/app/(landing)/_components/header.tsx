"use client";

import { Button, TypographyH1, TypographyP } from "@hackathon/ui";
import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-background mx-auto mt-1 flex h-auto flex-col gap-6 p-6 lg:mt-20 lg:flex-row lg:justify-between">
      {/* Photo - shown first on mobile, second on desktop (far right) */}
      <div className="order-1 w-full overflow-hidden rounded-2xl lg:order-2 lg:w-auto lg:flex-shrink-0">
        <Image
          src="/man_with_glasses.png"
          alt="man_with_glasses image"
          width={500}
          height={200}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      {/* Text content - shown second on mobile, first on desktop (left side) */}
      <div className="order-2 w-full px-0 lg:order-1 lg:flex-1 lg:px-6">
        <TypographyH1 className="mx-auto ml-0 flex w-fit justify-center py-6 text-center text-xl font-bold text-black sm:text-2xl">
          Myśl o jutrze, działaj dziś
        </TypographyH1>
        <TypographyP className="text-sm sm:text-base">
          Planowanie emerytury to nie tylko myślenie o przyszłości, ale aktywne
          działanie już teraz. W ZUS rozumiemy, jak ważne jest poczucie
          bezpieczeństwa i stabilności. Dlatego oferujemy Ci nowoczesne
          narzędzia i wsparcie na każdym etapie Twojej kariery. Twoje składki to
          fundament, na którym budujesz swoją przyszłość, a dzięki naszym
          rozwiązaniom masz realny wpływ na to, jak będzie ona wyglądać.
          Przekonaj się, jak proste może być świadome kształtowanie swojej
          emerytury!
        </TypographyP>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            className="border-primary text-primary border-spacing-1 border-y border-gray-300 bg-white p-3 shadow-lg hover:text-black lg:border-x"
            onClick={() => {
              const formSection = document.getElementById('form-section');
              formSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Oblicz moją emeryturę
          </Button>
          <Button
            className="border-primary text-primary border-spacing-1 border-y border-gray-300 bg-white p-3 shadow-lg hover:text-black lg:border-x"
            onClick={() => {
              const seeMoreSection = document.getElementById('see-more-section');
              seeMoreSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Dowiedz się więcej
          </Button>
        </div>
      </div>
    </div>
  );
}
