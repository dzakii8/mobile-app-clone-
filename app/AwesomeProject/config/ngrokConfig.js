import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import * as SecureStore from 'expo-secure-store'

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'https://a2ec-118-99-110-101.ngrok-free.app',
})

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key)
  return result
}

const authLink = setContext(async(_,{headers})=>{
  const token = await getValueFor('accessToken')

  return {
    headers: {
      ...headers,
      authorization: token? `Bearer ${token}` : ""
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client

