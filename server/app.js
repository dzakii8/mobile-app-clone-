if (process.env.NODE_ENV !== 'production') {
 require('dotenv').config() 
}

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const {typeDefs:typeDefsUser, resolvers:resolversUser} = require('./schemas/user')
const {typeDefs:typeDefsPost, resolvers:resolversPost} = require('./schemas/post')
const {typeDefs:typeDefsFollow, resolvers:resolversFollow} = require('./schemas/follow');
const client = require('./config/configMongoDB');
const { GraphQLError } = require('graphql');
const { verifyToken } = require('./helpers/jwt');


const server = new ApolloServer({
  typeDefs: [typeDefsUser,typeDefsPost,typeDefsFollow],
  resolvers: [resolversUser,resolversPost,resolversFollow],
  introspection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
(async () => {
  const db = client.db('hck65')
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 3000 },
    context : async ({req,res})=>{
      return {
        db,
        authentication: async ()=>{
          const accessToken = req.headers.authorization
          if (!accessToken) {
            throw new GraphQLError("invalid token", {
              extensions : { code : "UNAUTHENTICATION" }
            })
          }
          const [bearer, token] = accessToken.split(" ")
          if (!bearer) {
            throw new GraphQLError("invalid token", {
              extensions : { code : "UNAUTHENTICATION" }
            })
          }
          const decoded = verifyToken(token)
          const userFound = await db.collection('users').findOne({username : decoded.username})
          if (!userFound) {
            throw new GraphQLError("belum login", {
              extensions : { code : "UNAUTHENTICATION"}
            })
          }
          return {
            _id: userFound._id,
            username: userFound.username,
          }
        },
        
      }
    }
  });
  console.log(`🚀  Server ready at: ${url}`);
})()
