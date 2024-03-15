const { ObjectId } = require("mongodb");
const client = require("../config/configMongoDB");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");
const { signToken } = require("../helpers/jwt");
const collectionName = "Users"

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID
    name: String
    username: String!
    email: String! #uniq #emailFormat
    password: String! #min length 5
  }
  type UserDetail {
    _id: ID
    name: String
    username: String!
    email: String! #uniq #emailFormat
    password: String! #min length 5
    followingUser: [User]
    followerUser: [User]
  }
  input NewUser {
    name: String
    username: String!
    email: String! #uniq #emailFormat
    password: String! #min length 5
  }
  type Token {
    accessToken: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    search(search:String): [User]
    getUserById(id: String): UserDetail
  }
  type Mutation {
    register(newUser: NewUser): User
    login(username:String, password:String): Token
  }
`;
const resolvers = {
  Query: {
    getUserById: async (_, args, contextValue) => {
      const {authentication} = contextValue
      const auth = await authentication()
      const { db } = contextValue
      const {id} = args
      const user = await db.collection('users').aggregate(
        [
          {
            '$match': {
              '_id': new ObjectId(auth._id)
            }
          }, {
            '$lookup': {
              'from': 'follows', 
              'localField': '_id', 
              'foreignField': 'followerId', 
              'as': 'followingUser'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'followingUser.followerId', 
              'foreignField': '_id', 
              'as': 'followingUser'
            }
          }, {
            '$lookup': {
              'from': 'follows', 
              'localField': '_id', 
              'foreignField': 'followingId', 
              'as': 'followerUser'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'followerUser.followerId', 
              'foreignField': '_id', 
              'as': 'followerUser'
            }
          }
        ]
      ).toArray()
      // const util = require('util')
      // console.log(util.inspect(user, {showHidden: false, depth: null, colors: true}))
      return user[0] 
    },

    search: async (_, args, contextValue) => {
      const { authentication } = contextValue
      await authentication()
      const { search } = args
      const { db } = contextValue
      let users = []
      const searchQuery = new RegExp(search, 'i')
      users = await db.collection('users').find({ username: { '$regex': searchQuery } }).toArray()
      if (!users.length) {
        users = await db.collection('users').find({ name: { '$regex': searchQuery } }).toArray()
      }
      return users
    },

  },
  Mutation: {
    register: async (_, args, contextValue) => {
      // console.log(args.newUser);
      const { newUser } = args
      console.log(newUser);
      const { db } = contextValue
      const users = await db.collection('users')

      let insertedUser = await users.insertOne({
        ...newUser,
        password: hashPassword(newUser.password)
      })
      return {
        ...newUser,
        _id: insertedUser.insertedId
      }
    },
    login: async (_, args, contextValue) => {
      const { db } = contextValue
      const { username, password } = args
      try {
        const userFound = await db.collection('users').findOne({ username })
        if (!userFound) {
          throw new GraphQLError('user not found', {
            extensions: { code: "UNAUTHENTICATED" }
          })
        }
        const passwordCheck = comparePassword(password, userFound.password)
        if (!passwordCheck) {
          throw new GraphQLError('wrong password', {
            extensions: { code: "UNAUTHENTICATED" }
          })
        }
        const accessToken = signToken({
          _id: userFound._id,
          email: userFound.email,
          username: userFound.username
        })
        return { accessToken }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports = { typeDefs, resolvers }