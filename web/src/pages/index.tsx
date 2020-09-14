import { NavBar } from "../components/NavBar";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { Box } from "@chakra-ui/core";

/**
 * @todo Move cheking auth to context
 */

const Index = () => {
  const [{ data, fetching }] = useMeQuery();
  const [, logout] = useLogoutMutation();

  return (
    <>
      <NavBar
        username={data?.me?.username}
        isLoading={fetching}
        logout={logout}
      />
      <Box p={4}>Home</Box>
    </>
  );
};

export default Index;
