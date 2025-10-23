const { buildSchema } = require("graphql");

module.exports= buildSchema(`
     type Post{
    title:String!,
    content:String!,
    user:User
    }
    
    type User{
    name:String!,
    email:String!,
    token:String,
    posts:[Post]
    }

    input userInput{
    name:String,
    email:String,
    password:String
    }

    type Query{
     getUsers:[User]
     getUserById(id:ID!):User
    }

    type Mutation{
    createUser(input:userInput):User
    login(email:String!,password:String!):String
    deleteUser(id:ID!):String
    }
`);

