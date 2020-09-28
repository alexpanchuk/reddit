import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/core";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Wrapper } from "../components/Wrapper";
import { LoginMutationVariables, useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils";

/**
 * @todo
 * - Make components Form and Input to incapsulate trivial form logic
 * - Make Link component = next/link + chakra ui Link
 */

const Login: NextPage = () => {
  const { handleSubmit, errors, setError, register, formState } = useForm<
    LoginMutationVariables
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const [, executeLogin] = useLoginMutation();

  async function onSubmit({
    usernameOrEmail,
    password,
  }: LoginMutationVariables) {
    const response = await executeLogin({ usernameOrEmail, password });
    const errors = response.data?.login.errors;
    const user = response.data?.login.user;

    if (errors) {
      errors.forEach(({ field, message }) =>
        setError(field as keyof LoginMutationVariables, {
          type: "manual",
          message,
        })
      );
    } else if (user) {
      router.push("/");
    }
  }

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Usename */}
        <FormControl isInvalid={Boolean(errors.usernameOrEmail)}>
          <FormLabel htmlFor="usernameOrEmail">Username</FormLabel>
          <Input
            name="usernameOrEmail"
            placeholder="Username or Email"
            ref={register({
              required: "required",
              minLength: {
                value: 4,
                message: "should be at leats 4 characters",
              },
            })}
          />
          <FormErrorMessage>
            {errors.usernameOrEmail && errors.usernameOrEmail.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Usename */}

        {/* Password */}
        <FormControl isInvalid={Boolean(errors.password)} mt={3}>
          <FormLabel htmlFor="password1">Password</FormLabel>
          <Input
            name="password"
            placeholder="Password"
            type="password"
            ref={register({
              required: "required",
              // @findout: do i need this validation when login
              minLength: {
                value: 8,
                message: "should be at leats 8 characters",
              },
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Password */}

        <Box color="#005ea5" fontSize={14}>
          <NextLink href="/forgot-password">
            <Link>Forgot password?</Link>
          </NextLink>
        </Box>

        <Button
          mt={4}
          variantColor="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Login
        </Button>

        <Button mt={4} ml={2} onClick={() => router.back()}>
          Back
        </Button>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
