import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

const DetailPage = () => {

  const route = useRoute();
  const postId = route.params?.postId;
  // console.log(postId);

  const GET_POST_BYID = gql`
  query GetPostById($postId: String) {
  getPostById(postId: $postId) {
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

  const { loading, error, data } = useQuery(GET_POST_BYID, {
    variables: { postId }, // Menyertakan variabel postId ke dalam query
  });

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentUsername}>by {item.username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{data?.getPostById?.content}</Text>
        <Text style={styles.postContent}>Tags: {data?.getPostById?.tags.join(', ')}</Text>
        <Image source={{ uri: data?.getPostById?.imgUrl }} style={styles.postImage} />
      </View>
      <FlatList
        data={data?.getPostById?.comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 12,
    color: '#888',
  },
});

export default DetailPage;
