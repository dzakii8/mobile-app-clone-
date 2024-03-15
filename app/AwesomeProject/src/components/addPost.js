import { gql, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoginContext } from "../../context/loginContext";

export default function AddPost({ navigation }) {
  const [tags, setTags] = useState("")
  const [imgUrl, setImgUrl] = useState("")
  const [content, setContent] = useState("")

  useEffect(()=>{
    setTags('');
    setImgUrl('');
    setContent('');
  },[navigation])

  const { isLogin } = useContext(LoginContext)
  // const pa

  const ADD_POST = gql`
  mutation AddPost($newPost: NewPost) {
  addPost(newPost: $newPost) {
    _id
    content
    tags
    imgUrl
  }
}
`
const GET_POST = gql`
query Query {
  getPosts {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      _id
      name
      username
      email
      password
    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    totalLikes
    createdAt
    updatedAt
  }
}
`
  const [handleAddPost, { data, loading, error }] = useMutation(ADD_POST)

  const handleOnSubmit = () => {
    handleAddPost({
      variables: {
        newPost: {
          tags,
          imgUrl,
          content
        }
      },
      refetchQueries: [GET_POST],
      onCompleted: (data) => {
        navigation.navigate("Home")
      },
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Post</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Tags"
          placeholderTextColor="#BEBEBE"
          onChangeText={setTags}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Image URL"
          placeholderTextColor="#BEBEBE"
          onChangeText={setImgUrl}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Content"
          placeholderTextColor="#BEBEBE"
          onChangeText={setContent}
        />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleOnSubmit}>
        <Text style={styles.registerButtonText}>Add</Text>
      </TouchableOpacity>
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
