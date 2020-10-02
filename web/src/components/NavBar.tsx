import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";

interface Props {
  username?: string;
  isLoading: boolean;
  logout: () => void;
}

export const NavBar: React.FC<Props> = ({ username, isLoading, logout }) => {
  return (
    <Flex bg="tan" p={4}>
      <NextLink href="/">
        <Link>Home</Link>
      </NextLink>

      <Box ml="auto">
        {username ? (
          <>
            {username}
            {/* @findout: why onClick={logout} doesn't work */}
            <Button variant="link" onClick={() => logout()} ml={4}>
              Logout
            </Button>
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
