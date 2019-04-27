const bcrypt = require('bcryptjs');
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
};
