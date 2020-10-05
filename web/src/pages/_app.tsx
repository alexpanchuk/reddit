import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { AppProps } from "next/app";
import React from "react";
import { NavBar } from "../components";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import theme from "../theme";
import { createUrqlClient, isServer } from "../utils";

/**
 * @todo Move cheking auth to context
 */

function MyApp({ Component, pageProps }: AppProps) {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [, logout] = useLogoutMutation();

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <>
          <NavBar
            username={data?.me?.username}
            isLoading={fetching}
            logout={logout}
          />

          <Component {...pageProps} />
        </>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient)(MyApp);
