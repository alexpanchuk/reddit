import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/core";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { Wrapper } from "../components";
import { PostInput, useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils";

const CreatePost: NextPage = () => {
  const { handleSubmit, errors, register, formState } = useForm<PostInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const [, executeCreatePost] = useCreatePostMutation();

  async function onSubmit({ ...data }: PostInput) {
    const { error } = await executeCreatePost({ data });

    if (!error) {
      router.push("/");
    }
  }

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <FormControl isInvalid={Boolean(errors.title)}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            name="title"
            placeholder="title"
            ref={register({
              required: "required",
              minLength: {
                value: 4,
                message: "should be at least 4 characters",
              },
            })}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Title */}

        {/* Email */}
        <FormControl isInvalid={Boolean(errors.text)} mt={3}>
          <FormLabel htmlFor="text">Text</FormLabel>
          <Textarea
            name="text"
            placeholder="Write you post here..."
            ref={register({
              required: "required",
            })}
          />

          <FormErrorMessage>
            {errors.text && errors.text.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Email */}

        <Button
          mt={4}
          variantColor="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Create post
        </Button>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
