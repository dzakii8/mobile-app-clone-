import { useContext, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as SecureStore from "expo-secure-store"
import { gql, useMutation } from "@apollo/client";
import { LoginContext } from "../../context/loginContext";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value)
}

const LOGIN = gql`
mutation Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    accessToken
  }
}
`

export default function Login({ navigation }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { setIsLogin } = useContext(LoginContext)

  const [handleLogin, { data, loading, error }] = useMutation(LOGIN)

  function handleOnSubmit() {
    handleLogin({
      variables: {
        username,
        password
      },
      onCompleted: async (data) => {
        // console.log(data);
        await setIsLogin(data?.login?.accessToken)
        await save("accessToken", data?.login?.accessToken)
      },
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
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
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="#BEBEBE"
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleOnSubmit}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.signupView}>
        <Text style={styles.signupText}>New to LinkedIn?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupButton}>Join now</Text>
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  loginButton: {
    width: 100,
    backgroundColor: "#0073B2",
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    color: "#99A4AE",
    fontSize: 16,
  },
  signupButton: {
    color: "#0073B2",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
});