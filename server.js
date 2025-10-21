const express = require("express");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");
const users = [
  { id: "1", name: "Abdo" },
  { id: "2", name: "Ahmed" },
];

const schema = buildSchema(`
  type User{
  id:String,
  name:String
  }
  type Query{
  getUsers :[User]
  getUserById(id:String):User
  }

  type Mutation{
  createUser(id:String,name:String):User
  }

  `);

const userQueries = {
  Hello: () => "Hello from server GraphQL",
  getUsers: () => users,
  getUserById: (args) => users.find((user) => user.id === args.id),
};
const userMutations = {
  createUser: ({ id, name }) => {
    const newUser = { id, name };
    users.push(newUser);
    return newUser;
  },
};
const resolvers = {
  ...userQueries,
  ...userMutations,
};
const app = express();

app.use("/graphql", createHandler({ schema, rootValue: resolvers }));

const port = 3000;
app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
