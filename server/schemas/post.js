const { ObjectId } = require("mongodb");
const redis = require("../config/redisConfig");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Comments {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Likes {
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Post {
    _id: ID
    content: String!
    tags: [String!]!
    imgUrl: String
    authorId: ID!
    author: User
    comments: [Comments]
    likes: [Likes]
    totalLikes: Int
    createdAt: String
    updatedAt: String
  }

  input NewPost {
    content: String!
    tags: [String!]!
    imgUrl: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getPosts: [Post]
    getPostById(postId:String): Post
  }
  type Mutation {
    addPost(newPost: NewPost): Post
    addComment(content: String,postId:String): Comments
    addLike(postId:String): Likes
  }
`;
const resolvers = {
  Query: {
    getPosts: async (_, __, contentValue) => {
      const { db, authentication } = contentValue
      // const user = await authentication()
      await redis.flushall()
      const userRedis = await redis.get("posts")
      if (userRedis) {
        return JSON.parse(userRedis)
      }
      const posts = await db.collection('posts').aggregate(
        [
          {
            '$lookup': {
              'from': 'users', 
              'localField': 'authorId', 
              'foreignField': '_id', 
              'as': 'author'
            }
          }, {
            '$unwind': {
              'path': '$author', 
              'preserveNullAndEmptyArrays': true
            }
          }
        ]
      ).toArray()
      posts.map((el) => {
        el.totalLikes = el.likes.length
      })
      await redis.set("posts", JSON.stringify(posts))
      // console.log(posts);
      return posts
    },
    getPostById: async (_, args, contentValue) => {
      const { db, authentication } = contentValue
      const user = await authentication()
      const posts = await db.collection('posts').aggregate(
        [
          {
            '$match': {
              '_id': new ObjectId(args.postId)
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'authorId', 
              'foreignField': '_id', 
              'as': 'author'
            }
          }, {
            '$unwind': {
              'path': '$author', 
              'preserveNullAndEmptyArrays': true
            }
          }
        ]
      ).toArray()
      return posts[0]
    },
  },
  Mutation: {
    addPost: async (_, args, contentValue) => {
      const { db, authentication } = contentValue
      const user = await authentication()
      const { newPost } = args
      const post = await db.collection('posts').insertOne({
        ...newPost,
        authorId: user._id,
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await redis.del("posts")
      return {
        ...newPost,
        _id: post.insertedId,
        authorId: user._id,
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    addComment: async (_, args, contentValue) => {
      const { db, authentication } = contentValue
      const user = await authentication()
      const { content, postId } = args
      const comment = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, {
        $push: {
          comments: {
            content,
            username: user.username,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
      })

      return {
        content,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    addLike: async (_, args, contentValue) => {
      const { db, authentication } = contentValue
      const user = await authentication()
      const { postId } = args
      const post = await db.collection('posts').findOne(
        { _id: new ObjectId(postId), 'likes.username': user.username }
      )
      if (!post) {
        const Like = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, {
          $push: {
            likes: {
              username: user.username,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        })
        return {
          username: user.username,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        console.log('sudah ada');
      }
    }
  },
};

module.exports = { typeDefs, resolvers }