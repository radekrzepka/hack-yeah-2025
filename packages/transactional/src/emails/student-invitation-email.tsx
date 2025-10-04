import { Button, Hr, Text } from "@react-email/components";
import { Layout } from "./layout";

interface StudentInvitationEmailProps {
  invitationLink: string;
  inviterName: string;
}

export function StudentInvitationEmail({
  invitationLink = "https://example.com",
  inviterName = "Jan Kowalski",
}: StudentInvitationEmailProps): React.JSX.Element {
  return (
    <Layout>
      <Text className="text-left text-base leading-6 text-[#525f7f]">
        <strong>{inviterName}</strong> has invited you to join StudyWise as a
        student. StudyWise is a platform that connects students with teachers
        for personalized learning experiences.
      </Text>
      <Text className="text-left text-base leading-6 text-[#525f7f]">
        Click the button below to accept your invitation and create your
        account:
      </Text>
      <Button
        className="block rounded-[5px] bg-[#3e84f4] px-[10px] py-[10px] text-center text-base font-bold text-white"
        href={invitationLink}
      >
        Accept invitation
      </Button>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-left text-xs leading-6 text-[#8898aa]">
        For security reasons, we recommend creating a strong password that you
        don't use for other websites.
      </Text>
    </Layout>
  );
}

export default StudentInvitationEmail;
