import { Box, Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils";

const Index = () => {
  const [{ data: posts }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  });

  return (
    <Box p={4}>
      <Box mb={4} fontWeight="bold" color="#718096">
        <NextLink href="/create-post">
          <Link>Create post</Link>
        </NextLink>
      </Box>

      {!posts ? (
        <div>loading...</div>
      ) : (
        posts.posts.map(({ title, id }) => <div key={id}>{title}</div>)
      )}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
