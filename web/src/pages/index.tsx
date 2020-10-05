import { Box } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils";

const Index = () => {
  const [{ data: posts }] = usePostsQuery();

  return (
    <Box p={4}>
      {!posts ? (
        <div>loading...</div>
      ) : (
        posts.posts.map(({ title, id }) => <div key={id}>{title}</div>)
      )}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
