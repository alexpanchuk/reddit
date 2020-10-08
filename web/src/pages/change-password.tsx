import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/core";
import { ErrorMessage } from "@hookform/error-message";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Wrapper } from "../components";
import { useChangePasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils";

type FormInput = {
  password: string;
  confirm: string;
};

const ChangePassword: NextPage = () => {
  const {
    handleSubmit,
    errors,
    setError,
    register,
    formState,
    watch,
  } = useForm<FormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const { token } = router.query;
  const [, executeChangePassword] = useChangePasswordMutation();

  async function onSubmit({ password }: FormInput) {
    const response = await executeChangePassword({
      token: token as string,
      password,
    });

    const errors = response.data?.changePassword.errors;
    const user = response.data?.changePassword.user;

    if (errors) {
      errors.forEach(({ field, message }) => {
        setError(field as keyof FormInput, {
          type: "manual",
          message,
        });
      });
    } else if (user) {
      router.push("/");
    }
  }

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Password */}
        <FormControl isInvalid={Boolean(errors.password)} mt={3}>
          <FormLabel htmlFor="password1">New password</FormLabel>
          <Input
            id="password1"
            name="password"
            placeholder="Password"
            type="password"
            ref={register({
              required: "required",
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

        {/* Confirm */}
        <FormControl isInvalid={Boolean(errors.confirm)} mt={3}>
          <FormLabel htmlFor="confirm">Confirm</FormLabel>
          <Input
            id="confirm"
            name="confirm"
            placeholder="Confirm password"
            type="password"
            ref={register({
              required: "required",
              validate: (value) =>
                value === watch("password") || "passwords does not match",
            })}
          />
          <FormErrorMessage>
            {errors.confirm && errors.confirm.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Confirm */}

        <ErrorMessage
          errors={errors}
          name="token"
          render={({ message }) => (
            <>
              <Box mt={2} color="tomato">
                {message}
              </Box>
              <Box color="#005ea5">
                <NextLink href="/forgot-password">
                  <Link>Go forget it again</Link>
                </NextLink>
              </Box>
            </>
          )}
        />

        <Button
          mt={4}
          variantColor="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Change
        </Button>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
