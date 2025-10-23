const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const { signToken } = require("../auth");
const bcrypt = require("bcrypt");

exports.userQueries = {
  getUsers: async () => {
    const users = await User.find();
    return users;
  },

  getUserById: async ({ id }) => {
    const user = await User.findById(id).populate("posts");
    if (!user) throw new Error(`No user found for this id: ${id}`);
    return user;
  },
};

exports.userMutations = {
  createUser: async ({ input }) => {
    const { name, email, password } = input;
    const newUser = await User.create({ name, email, password });
    const token = await signToken(newUser);

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
  deleteUser: async ({ id }) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error(`No user found for this ${id}`);
    await Post.deleteMany({ user: user._id });
    return " user deleted successfully";
  },
};
