const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
