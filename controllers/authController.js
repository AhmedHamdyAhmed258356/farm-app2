const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authUser = async (req, res) => {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
          console.log('Missing email or password');
          return res.status(400).json({ message: 'Please enter email and password' });
    }
    let user = await User.findOne({ where: { email } });

    if (!user) {
          const usersCount = await User.count();
          user = await User.create({
                  email,
                  password,
                  name: email.split('@')[0],
                  role: usersCount === 0 ? 'admin' : 'worker'
          });
    }

    if (await user.matchPassword(password)) {
          res.json({
                  id: user.id,
                  _id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  token: generateToken(user.id),
          });
    } else {
          res.status(401).json({ message: 'Incorrect password' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
          return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
          name,
          email,
          password,
          role: role || 'worker',
    });

    if (user) {
          res.status(201).json({
                  id: user.id,
                  _id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
          });
    } else {
          res.status(400).json({ message: 'Invalid data' });
    }
};

module.exports = { authUser, registerUser };
