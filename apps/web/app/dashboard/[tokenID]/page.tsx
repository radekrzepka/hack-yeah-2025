"use client";
import { RetirementDashboard } from "./_components/retirement-dashboard";

export default function Home({ params }: { params: { tokenID: string } }) {
  return (
    <main className="bg-background min-h-screen">
      <RetirementDashboard tokenID={params.tokenID} />
    </main>
  );
}
