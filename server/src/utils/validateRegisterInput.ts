import { FieldError, RegisterInput } from "./../resolvers/user";

export function validateRegisterInput({
  username,
  password,
  email,
}: RegisterInput): [FieldError] | null {
  if (username.length < 4) {
    return [
      {
        field: "username",
        message: `Username should be at least 4 characters`,
      },
    ];
  }

  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: `Not valid email`,
      },
    ];
  }

  if (password.length < 8) {
    return [
      {
        field: "password",
        message: `Password should be at least 8 characters`,
      },
    ];
  }

  return null;
}
