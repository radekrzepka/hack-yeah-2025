import { Button } from "@hackathon/ui";

    export default function Header() {
        return (
          <div className="bg-background mx-auto mt-20 flex h-1/4 p-6">
            <div className="w-1/2 px-6">
              <h1 className="mx-auto ml-0 flex w-fit justify-center py-6 text-center text-2xl font-bold text-black">
                Myśl o jutrze, działaj dziś
              </h1>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                obcaecati dolorem libero! Numquam cum rem sunt nobis nihil,
                excepturi at, doloremque omnis rerum voluptatum assumenda, odio
                quos ex magni reprehenderit!
              </p>
              <Button className="border-primary text-primary mt-5 border-spacing-1 border-x border-gray-300 bg-white p-3 shadow-lg hover:text-white">
                Oblicz moją emeryturę
              </Button>
            </div>
            <div className="bg-accent w-1/2 rounded-2xl p-10">
              <p className="text-center">photo placeholder</p>
              <button></button>
            </div>
          </div>
        );
    }
    