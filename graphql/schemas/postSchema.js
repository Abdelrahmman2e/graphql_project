const { buildSchema } = require("graphql");

module.exports = buildSchema(`
     type User{
    name:String!,
    email:String!,
    token:String,
    posts:[Post]
    }
    type Post{
    title:String!,
    content:String!,
    user:User
    }

    type Query{
    getPosts:[Post]
    getMyPosts(token:String!):[Post!]!
    }

     type Mutation{
     createPost(title:String!,content:String!,token:String!):String
    }
     
`);
