import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import *   as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import client from './config/ngrokConfig';
// import { AuthContext } from './context/loginContext';
import AuthContext from './context/loginContext';
import StackNavigator from './src/components/stackNavigator';
import { useContext } from 'react';

export default function App() {
  return (
    <AuthContext>
      <ApolloProvider client={client}>
        <StackNavigator/>
      </ApolloProvider>
    </AuthContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
