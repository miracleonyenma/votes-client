// ./app/poll/[id]/page.tsx

import PollPage from "@/components/Poll/Page";

const Poll = ({
  params,
}: {
  params: {
    id: string;
  };
}) => <PollPage id={params.id} />;

export default Poll;
