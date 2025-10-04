import { Button, Hr, Text } from "@react-email/components";
import React from "react";
import { Layout } from "./layout";

export const ResetPasswordEmail = ({
  resetPasswordLink = "https://example.com",
}: {
  resetPasswordLink: string;
}): React.JSX.Element => (
  <Layout>
    <Text className="text-left text-base leading-6 text-[#525f7f]">
      We received a request to reset your password for your Studywise account.
      To complete the password reset process, please click the button below:
    </Text>
    <Button
      className="block rounded-[5px] bg-[#3e84f4] px-[10px] py-[10px] text-center text-base font-bold text-white"
      href={resetPasswordLink}
    >
      Reset Password
    </Button>
    <Text className="text-left text-sm leading-6 text-[#525f7f]">
      This link will expire in {} hours. If you did not request a password
      reset, please ignore this email or contact support if you have concerns.
    </Text>
    <Hr className="my-5 border-[#e6ebf1]" />
    <Text className="text-left text-xs leading-6 text-[#8898aa]">
      For security reasons, we recommend creating a strong password that you
      don't use for other websites.
    </Text>
  </Layout>
);

export default ResetPasswordEmail;
