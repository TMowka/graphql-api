const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transformUser } = require('../../helpers/transformers');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput: { email, password } }) => {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    user = await newUser.save();

    return transformUser(user);
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      throw new Error('Password is incorrect');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      'secret-key-string',
      {
        expiresIn: '1h',
      },
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
