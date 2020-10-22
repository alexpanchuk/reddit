import { Box, Heading, Text } from "@chakra-ui/core";
import React from "react";
import { Post } from "../generated/graphql";

type PostItemProps = Pick<Post, "id" | "title" | "shortText">;

export const PostItem: React.FC<PostItemProps> = ({ id, title, shortText }) => {
  return (
    <Box key={id} p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4} whiteSpace="pre-line">
        {shortText.replace(/\n/gi, "\n\n")}
      </Text>
    </Box>
  );
};
