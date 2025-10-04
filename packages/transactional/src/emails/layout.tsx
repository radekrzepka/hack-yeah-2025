import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import React from "react";

export const Layout = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => (
  <Html>
    <Head>
      <Font
        fontFamily="Roboto"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Tailwind>
      <Body className="bg-[#f2f2f2] font-sans">
        <Container className="mx-auto bg-white px-0 py-5">
          <Section className="px-12">
            <Text className="text-center text-4xl">Studywise</Text>
            <Hr className="my-5 border-[#e6ebf1]" />
            {children}
            <Text className="text-xs leading-4 text-[#8898aa]">
              © {new Date().getFullYear()} Studywise. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
