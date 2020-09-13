import { Box, Link, Flex } from "@chakra-ui/core";
import NextLink from "next/link";

interface Props {
  username?: string;
  isLoading: boolean;
}

export const NavBar: React.FC<Props> = ({ username, isLoading }) => {
  return (
    <Flex bg="tan" p={4}>
      <NextLink href="/">
        <Link>Home</Link>
      </NextLink>

      <Box ml="auto">
        {username ? (
          <>
            {username}
            <Link ml={4}>Logout</Link>
          </>
        ) : !isLoading ? (
          <>
            <NextLink href="/login">
              <Link>Login</Link>
            </NextLink>
            <NextLink href="/register">
              <Link ml={4}>Register</Link>
            </NextLink>
          </>
        ) : null}
      </Box>
    </Flex>
  );
};
