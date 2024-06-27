const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const { JWT_SECRET } = require('../config');

// signup

router.post('/signup',  async (req, res) => {
  const { fullName, password, email, profileImg } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'One or more mandatory fields are empty' });
  }

  try {
    const userInDB = await User.findOne( {email: email});
    if (userInDB) {
      return res.status(404).json({ error: 'User with this email is already registered' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword});
    await newUser.save();
    console.log(newUser)

  // Generate JWT token and user information
    const payload = { userId: newUser._id };
    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    const userInfo = { fullName: newUser.fullName, email: newUser.email };

    console.log("sucessfully ");
    res.status(201).json({ result: { token: jwtToken, user: userInfo } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving user to the database' });
  }
});

//login authentication
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
      return res.status(400).json({ error: "One or more mandatory fields are empty" });
  }
  User.findOne({ email: email })
      .then((userInDB) => {
          if (!userInDB) {
              return res.status(401).json({ error: "Invalid Credentials" });
          }
          bcryptjs.compare(password, userInDB.password)
              .then((didMatch) => {
                  if (didMatch) {
                      const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                      const userInfo = { "_id": userInDB._id, "email": userInDB.email, "fullName": userInDB.fullName };
                      res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                  } else {
                      return res.status(401).json({ error: "Invalid Credentials" });
                  }
              }).catch((err) => {
                  console.log(err);
              })
      })
      .catch((err) => {
          console.log(err);
      })
});

module.exports = router;



                                                                                                                                                                                                                                                                                                                                             
