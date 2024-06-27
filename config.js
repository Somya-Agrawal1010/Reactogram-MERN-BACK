require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/reactogram",
  JWT_SECRET: process.env.JWT_SECRET || "hfdghsgfffffffffgghhhhhhhhdgd"
}

