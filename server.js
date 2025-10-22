const express = require("express");
const cors = require("cors");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbConnection = require("./config/dbConnection");
require("dotenv").config({ path: "./config.env" });
const User = require("./models/userModel");

const signToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

dbConnection();

const schema = buildSchema(`
  type User{
  name:String!,
  email:String!,
  token:String
  }

  input userInput{
  name:String!,
  email:String!,
  password:String!
  }

  input userLoginInput{
  email:String!,
  password:String!
  }

  type Query{
  test:String
  getUsers:[User]
  
  }



  type Mutation{
  createUser(input:userInput):User
  login(email:String!,password:String!):String
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
    const token = await signToken(newUser);
    console.log(token);
    return {
      name,
      email,
      token,
    };
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new Error(`Invalid credentials`);

    const token = signToken(user);

    return token;
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
