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
  const { handleSubmit, errors, register, formState, watch } = useForm<
    FormInput
  >({
    defaultValues: { username: "", password: "" },
  });

  const password = watch("password");

  function validateUsername(value: string) {
    return value.trim().length < 4 ? "should be at least 4 characters" : true;
  }

  function validatePassword(value: string) {
    return value.trim().length < 8 ? "should be at least 8 characters" : true;
  }

  function validateConfirm(value: string) {
    return value === password ? true : "passwords does not match";
  }

  async function onSubmit(values: FormInput) {
    const delay = (ms: number) =>
      new Promise((res, rej) => {
        setTimeout(res, ms);
      });

    await delay(2000);
    console.log(values.username, values.password);
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
              validate: validateUsername,
              required: "required",
            })}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Usename */}

        {/* Password */}
        <FormControl isInvalid={Boolean(errors.password)} mt={3}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            name="password"
            placeholder="Password"
            type="password"
            ref={register({
              validate: validatePassword,
              required: "required",
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
              validate: validateConfirm,
              required: "required",
            })}
          />
          <FormErrorMessage>
            {errors.confirm && errors.confirm.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Password */}
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
