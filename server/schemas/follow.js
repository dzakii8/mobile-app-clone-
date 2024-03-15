const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Mutation{
    follow(id: ID): Follow
  }
`;
const resolvers = {
  Mutation:{
    follow : async (_, args, contextValue) => {
      const {db, authentication} = contextValue
      const user = await authentication()
      // console.log(user);
      const follow = await db.collection('follows').insertOne({
        followingId: new ObjectId(args.id),
        followerId: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return {
        _id: follow.insertedId,
        followingId: args.id,
        followerId: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
  }
};

module.exports = { typeDefs, resolvers }