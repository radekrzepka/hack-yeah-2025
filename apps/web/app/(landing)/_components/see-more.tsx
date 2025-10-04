import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TypographyH3,
  TypographyP,
} from "@hackathon/ui";

function SeeMoreCard({
  title,
  content,
  // imgPath,
  // imgAlt,
}: {
  title: string;
  content: string;
  // imgPath: string;
  // imgAlt: string;
}) {
  return (
    <Card className="flex">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyP>{content}</TypographyP>
        {/* <img src={imgPath} alt={imgAlt} /> */}
      </CardContent>
    </Card>
  );
}

export function SeeMore() {
  return (
    <div className="m-5">
      <TypographyH3>See more</TypographyH3>
      <SeeMoreCard
        title={"test"}
        content={"lorem12"}
        // imgPath={"./"}
        // imgAlt={";);)"}
      />
      <SeeMoreCard
        title={"test"}
        content={"lorem12"}
        // imgPath={"./"}
        // imgAlt={";);)"}
      />
      <SeeMoreCard
        title={"test"}
        content={"lorem12"}
        // imgPath={"./"}
        // imgAlt={";);)"}
      />
    </div>
  );
}
