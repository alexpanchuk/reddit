import { NavBar } from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";
import { Box } from "@chakra-ui/core";

/**
 * @todo Move cheking auth to context
 */

const Index = () => {
  const [{ data, fetching }] = useMeQuery();

  return (
    <>
      <NavBar username={data?.me?.username} isLoading={fetching} />
      <Box p={4}>Home</Box>
    </>
  );
};

export default Index;
