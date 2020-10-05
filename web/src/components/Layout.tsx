import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from ".";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient, isServer } from "../utils";

/**
 * @todo Move cheking auth to context
 */
const Layout: React.FC = ({ children }) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [, logout] = useLogoutMutation();

  return (
    <>
      <NavBar
        username={data?.me?.username}
        isLoading={fetching}
        logout={logout}
      />
      {children}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Layout);
