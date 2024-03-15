import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register({ navigation }) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

const ADD_USER = gql`
mutation Register($newUser: NewUser) {
  register(newUser: $newUser) {
    _id
    name
    username
    email
    password
  }
}
`
const [handleRegister, { data, loading, error }] = useMutation(ADD_USER)

const handleOnSubmit = () => {
  handleRegister({
    variables: {
        newUser: {
          username,
          password,
          name,
          email
      }
    },
    onCompleted: (data) => {
      navigation.navigate("Login")
    },
  })
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join LinkedIn</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name"
          placeholderTextColor="#BEBEBE"
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#BEBEBE"
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#BEBEBE"
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#BEBEBE"
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleOnSubmit}>
        <Text style={styles.registerButtonText}>Join now</Text>
      </TouchableOpacity>
      <View style={styles.loginView}>
        <Text style={styles.loginText}>Already on LinkedIn?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#0073B2",
    marginBottom: 24,
  },
  inputView: {
    width: 300,
    backgroundColor: "#F3F6F8",
    borderRadius: 8,
    height: 56,
    marginBottom: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputText: {
    height: 50,
    color: "#000000",
    fontSize: 16,
  },
  registerButton: {
    width: 100,
    backgroundColor: "#0073B2",
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#99A4AE",
    fontSize: 16,
  },
  loginButton: {
    color: "#0073B2",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
