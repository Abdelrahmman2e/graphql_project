const Post = require("../../models/postModel");
const { auth } = require("../auth");
exports.postQueries = {
  getPosts: async () => {
    const posts = await Post.find().populate({
      path: "user",
      select: "name",
    });

    return posts;
  },

  getMyPosts: async ({ token }) => {
    const user = await auth(token);
    if (!user) throw new Error(`No user for found this ${decoded.userId}`);
    console.log(user);
    const posts = await Post.find({ user: user._id }).populate({
      path: "user",
      select: "name email",
    });

    return posts;
  },
};

exports.postMutations = {
  createPost: async ({ title, content, token }) => {
    const user = await auth(token);
    if (!user) throw new Error(`No user for this ${decoded.userId}`);

    const post = await Post.create({ title, content, user: user._id });
    return "Post is created ..:)";
  },
};
