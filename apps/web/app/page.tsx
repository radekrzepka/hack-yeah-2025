export default async function Dashboard() {
  return (
    <div className="bg-background mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Hackathon Template 2k25</h1>
      <p className="text-muted-foreground">
        Witamy w aplikacji do prognozy emerytalnej.
        <a
          href="/form"
          className="text-primary ml-1 underline hover:no-underline"
        >
          Przejdź do kalkulatora emerytalnego
        </a>
      </p>
    </div>
  );
}
