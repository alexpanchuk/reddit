import { NextPage } from "next";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { useMutation } from "urql";

/**
 * @todo
 * - Make components Form and Input to incapsulate trivial form logic
 * - Move out Mutation constants to particular folder
 */

type FormInput = {
  username: string;
  password1: string;
  password2: string;
};

const Register: NextPage = () => {
  const { handleSubmit, errors, register, formState, watch } = useForm<
    FormInput
  >({
    defaultValues: { username: "", password1: "", password2: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const REGISTER_MUTATION = `
    mutation Register($username: String!, $password: String!) {
      register(data: { username: $username, password: $password }) {
        errors {
          field
          message
        }
        user {
          id
          username
          createdAt
          updatedAt
        }
      }
    }
  `;
  const [{ fetching }, API_register] = useMutation(REGISTER_MUTATION);

  async function onSubmit({ username, password1: password }: FormInput) {
    await API_register({ username, password });
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
        <FormControl isInvalid={Boolean(errors.password1)} mt={3}>
          <FormLabel htmlFor="password1">Password</FormLabel>
          <Input
            name="password1"
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
            {errors.password1 && errors.password1.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Password */}

        {/* Confirm */}
        <FormControl isInvalid={Boolean(errors.password2)} mt={3}>
          <FormLabel htmlFor="password2">Confirm</FormLabel>
          <Input
            name="password2"
            placeholder="Confirm password"
            type="password"
            ref={register({
              required: "required",
              validate: (value) =>
                value === watch("password1") || "passwords does not match",
            })}
          />
          <FormErrorMessage>
            {errors.password2 && errors.password2.message}
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

export default Register;
