import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

const URI_DEV = "http://localhost:4466";
const URI_PROD = "http://localhost:4466";
const target_uri = process.env.NODE_ENV === "production" ? URI_PROD : URI_DEV;

const httpLink = createHttpLink({
  uri: target_uri,
  credentials: "include", // sends cookies
  fetchOptions: {
    mode: "cors"
  }
});

const authLink = (cookies: any) => {
  return setContext((_, { headers }) => {
    const token = cookies["token"];
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });
};

export const client = (cookies: any) => {
  return new ApolloClient({
    link: authLink(cookies).concat(httpLink),
    cache: new InMemoryCache()
  });
};
