import { Box } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { NavBar } from "../components";
import {
  useLogoutMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient, isServer } from "../utils";

/**
 * @todo Move cheking auth to context
 */

const Index = () => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [, logout] = useLogoutMutation();
  const [{ data: posts }] = usePostsQuery();

  return (
    <>
      <NavBar
        username={data?.me?.username}
        isLoading={fetching}
        logout={logout}
      />
      <Box p={4}>
        {!posts ? (
          <div>loading...</div>
        ) : (
          posts.posts.map(({ title, id }) => <div key={id}>{title}</div>)
        )}
      </Box>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
