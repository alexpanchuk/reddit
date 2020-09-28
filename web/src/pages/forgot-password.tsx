import {
  Box,
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
  ForgotPasswordMutationVariables,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils";

const ForgorPassword: NextPage = () => {
  const { handleSubmit, errors, register, formState } = useForm<
    ForgotPasswordMutationVariables
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const [forgotRespone, ForgotPassword] = useForgotPasswordMutation();

  async function onSubmit({ email }: ForgotPasswordMutationVariables) {
    await ForgotPassword({ email });
  }

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <FormControl isInvalid={Boolean(errors.email)} mt={3}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            name="email"
            placeholder="Email"
            ref={register({
              required: "required",
              minLength: {
                value: 6,
                message: "should be at least 6 characters",
              },
              validate: (value) => value.includes("@") || "should contains @",
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        {/* /Email */}

        <Button
          mt={4}
          variantColor="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Submit
        </Button>

        <Button mt={4} ml={2} onClick={() => router.back()}>
          Back
        </Button>

        <Box mt={2} fontWeight="bold">
          {forgotRespone.data?.forgotPassword === true &&
            "Link for changing password has sent to your email"}{" "}
        </Box>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgorPassword);
