import { Button, cn } from "@hackathon/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NotFoundPageProps {
  backToLabel: string;
  backToHref: string;
  fullScreen?: boolean;
}

export function NotFoundPage({
  backToHref,
  backToLabel,
  fullScreen = false,
}: NotFoundPageProps) {
  return (
    <div
      className={cn(
        "container mx-auto flex min-h-[70svh] flex-col items-center justify-center px-4 text-center",
        fullScreen && "min-h-svh",
      )}
    >
      <div className="relative">
        <h1 className="text-primary text-9xl font-bold opacity-10 md:text-[15rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Oops! Page not found
            </h2>
            <p className="text-muted-foreground">
              Sorry, but the page you are looking for does not exist or has been
              moved.
            </p>
            <div className="flex justify-center pt-4">
              <Link href={backToHref} passHref>
                <Button variant="default" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backToLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
