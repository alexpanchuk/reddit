import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import React from "react";
import { Layout } from "../components";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default MyApp;
