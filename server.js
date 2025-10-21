const express = require("express");
const cors = require("cors");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection");
require("dotenv").config({ path: "./config.env" });
const User = require("./models/userModel");

dbConnection();

const schema = buildSchema(`
  type User{
  name:String!,
  email:String!,
  }

  input userInput{
  name:String!,
  email:String!,
  password:String!
  }

  type Query{
  test:String
  getUsers:[User]
  }



  type Mutation{
  createUser(input:userInput):User
  }

  `);

const userQueries = {
  test: () => "Success",
  getUsers: async () => {
    const users = await User.find();
    return users;
  },
};

const userMutations = {
  createUser: async ({ input }) => {
    const { name, email, password } = input;
    const newUser = await User.create({ name, email, password });
    return {
      name,
      email,
    };
  },
};

const resolvers = {
  ...userQueries,
  ...userMutations,
};

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());

app.use(
  "/graphql",
  createHandler({ schema, rootValue: resolvers, graphiql: true })
);

app.get("/graphiql", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>GraphiQL</title>
        <link href="https://cdn.jsdelivr.net/npm/graphiql@1.4.7/graphiql.min.css" rel="stylesheet" />
        <style>
          body, html {
            height: 100%;
            margin: 0;
            overflow: hidden;
          }
          #graphiql {
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="graphiql">Loading...</div>

        <!-- ✅ React -->
        <script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>
        <!-- ✅ ReactDOM -->
        <script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script>
        <!-- ✅ GraphiQL -->
        <script src="https://cdn.jsdelivr.net/npm/graphiql@1.4.7/graphiql.min.js"></script>

        <!-- ✅ Init GraphiQL -->
        <script>
          const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
          ReactDOM.render(
            React.createElement(GraphiQL, { fetcher }),
            document.getElementById('graphiql'),
          );
        </script>
      </body>
    </html>
  `);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
