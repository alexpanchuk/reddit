import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Wrapper } from "../components/Wrapper";
import {
  RegisterMutationVariables,
  useRegisterMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils";

/**
 * @todo
 * - Make components Form and Input to incapsulate trivial form logic
 */

type FormInput = {
  username: string;
  password: string;
  confirm: string;
};

const Register: NextPage = () => {
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
  const [, executeRegister] = useRegisterMutation();

  async function onSubmit({ username, password }: FormInput) {
    const response = await executeRegister({ username, password });
    const errors = response.data?.register.errors;
    const user = response.data?.register.user;

    if (errors) {
      errors.forEach(({ field, message }) =>
        setError(field as keyof RegisterMutationVariables, {
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
        <FormControl isInvalid={Boolean(errors.username)}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            name="username"
            placeholder="Username"
            ref={register({
              required: "required",
              minLength: {
                value: 4,
                message: "should be at leats 4 characters",
              },
            })}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
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
        <Button
          mt={4}
          variantColor="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Register
        </Button>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
