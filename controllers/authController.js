const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authUser = async (req, res) => {
  console.log('Login attempt received:', req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
  }
  let user = await User.findOne({ where: { username } });

  // If user doesn't exist, create them as admin (for the father's convenience)
  if (!user) {
    const usersCount = await User.count();
    user = await User.create({
      username,
      password,
      name: username,
      role: usersCount === 0 ? 'admin' : 'worker' // First user is always admin
    });
  }

  if (await user.matchPassword(password)) {
    res.json({
      id: user.id,
      _id: user.id, // For frontend compatibility
      name: user.name,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
  }
};

const registerUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  const userExists = await User.findOne({ where: { username } });
  if (userExists) {
    return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
  }

  const user = await User.create({
    name,
    username,
    password,
    role: role || 'worker',
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      _id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'بيانات غير صحيحة' });
  }
};

module.exports = { authUser, registerUser };
