import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

const ADD_LIKE = gql`
      mutation Mutation($postId: String) {
      addLike(postId: $postId) {
      username
      createdAt
      updatedAt
  }
}
`

const Home = ({ navigation }) => {

  const { loading, error, data } = useQuery(GET_POST)


  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.username}>{item.author.name}</Text>
            <Text style={styles.postTime}>Posted on {item.createdAt}</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>{item.content}</Text>
        <Text style={styles.postContent}>Tags: {item.tags.join(", ")}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("DetailPost", { postId: item._id })}>
          <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
        </TouchableOpacity>
        {/* Informasi lainnya seperti komentar, like, dll. */}
        <Text>Total Likes: {item.likes.length}</Text>
        <TouchableOpacity >
          <Text>Like</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.getPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 0,
    paddingTop: 24,
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8, // Mengurangi margin antar card
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postTime: {
    fontSize: 12,
    color: "#888",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  postList: {
    paddingBottom: 16,
    paddingHorizontal: 0, // Menghapus margin horizontal di samping
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red', // Ganti dengan warna yang diinginkan
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;