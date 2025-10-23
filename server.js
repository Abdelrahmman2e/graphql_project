const express = require("express");

const { createHandler } = require("graphql-http/lib/use/express");
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection");
require("dotenv").config({ path: "./config.env" });

const schema = require("./graphql/schemas/schema");
const { userQueries, userMutations } = require("./graphql/resolvers/user");
const { postQueries, postMutations } = require("./graphql/resolvers/post");

dbConnection();
/**
 * update post
 * delete post
 * get post
 * comment => post
 * when get post get comments(content only)
 */

const resolvers = {
  ...userQueries,
  ...userMutations,
  ...postQueries,
  ...postMutations,
};

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use(cors());

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
  console.log(`Server app listening on: http://localhost:${port}/graphiql`);
});
