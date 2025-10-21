const express = require("express");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const schema = buildSchema(`
  type Query{
  Hello :String
  }
  `);

const resolvers = {
  Hello: () => "Hello from server GraphQL",
};

const app = express();

app.use("/graphql", createHandler({schema, rootValue:resolvers}));

const port = 3000;
app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
