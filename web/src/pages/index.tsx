import { Box, Button, Flex, Heading, Link, Stack } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { PostItem, Wrapper } from "../components";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils";

const Index = () => {
  const [{ data: posts, fetching }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  });

  const isLoadingFirstTime = !posts && fetching;
  const isLoadingMore = posts && fetching;

  return (
    <Wrapper>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>LiReddit</Heading>
        <Box fontWeight="bold" color="#718096">
          <NextLink href="/create-post">
            <Link>Create post</Link>
          </NextLink>
        </Box>
      </Flex>

      {isLoadingFirstTime ? (
        <div>loading...</div>
      ) : posts ? (
        <>
          <Stack spacing={8}>
            {posts.posts.map(({ id, title, shortText }) => (
              <PostItem id={id} title={title} shortText={shortText} />
            ))}
          </Stack>
          <Flex justify="center" my={4}>
            <Button isLoading={isLoadingMore}>Load more</Button>
          </Flex>
        </>
      ) : null}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
