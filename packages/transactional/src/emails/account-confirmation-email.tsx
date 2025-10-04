import { Button, Hr, Text } from "@react-email/components";
import React from "react";
import { Layout } from "./layout";

export const AccountConfirmationEmail = ({
  confirmationLink = "https://example.com",
}: {
  confirmationLink: string;
}): React.JSX.Element => (
  <Layout>
    <Text className="text-left text-base leading-6 text-[#525f7f]">
      We're excited to have you on board. Studywise is here to help you achieve
      your learning goals and make your study sessions more effective. To get
      started, please confirm your account by clicking the button below:
    </Text>
    <Button
      className="block rounded-[5px] bg-[#3e84f4] px-[10px] py-[10px] text-center text-base font-bold text-white"
      href={confirmationLink}
    >
      Confirm your registration
    </Button>
    <Hr className="my-5 border-[#e6ebf1]" />
  </Layout>
);

export default AccountConfirmationEmail;
