import { Button } from "@hackathon/ui";

    export default function Header() {
        return (
            <div className="bg-background h-1/4 mx-auto p-6 mt-20 flex">
                <div className="w-1/2 px-6">
                    <h1 className="text-2xl text-black w-fit  mx-auto py-6 flex ml-0 justify-center font-bold text-center">Myśl o jutrze, działaj dziś</h1>
                    <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus obcaecati dolorem libero! Numquam cum rem sunt nobis nihil, excepturi at, doloremque omnis rerum voluptatum assumenda, odio quos ex magni reprehenderit!</p>
                    <Button className="bg-white border-primary p-3 mt-5 text-primary border-x border-spacing-1 border-gray-300 hover:text-white shadow-lg ">Oblicz moją emeryturę</Button>
                </div>
                <div className="w-1/2 p-10 bg-accent rounded-2xl">
                <p className="text-center">photo placeholder</p>
                </div>
            </div>
        );
    }
    