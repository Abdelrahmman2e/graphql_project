
const { mergeSchemas } = require('@graphql-tools/schema');
const userSchema = require("./userSchema");
const postSchema = require("./postSchema");

module.exports = mergeSchemas({
  schemas: [userSchema, postSchema],
});
