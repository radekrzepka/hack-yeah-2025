import { ROUTES } from "@hackathon/shared";
import type { Metadata } from "next";
import { NotFoundPage } from "./_components/not-found-page";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "Sorry, but the page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <NotFoundPage backToHref={ROUTES.MAIN} backToLabel="Back to homepage" />
  );
}
