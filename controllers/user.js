import User from '../models/user.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const EXP = 7200; // 2 godziny

export const signinUser = async (req, res) => {
  const data = req.body;
  console.log('USER - SIGNIN', req.body);
  // const data = {
  //   email: 'postmaster@pralma.pl',
  //   password: 'abc?B2023',
  // };
  try {
    const oldUser = await User.findOne({ email: data.email });
    if (!oldUser) {
      return res.status(404).json({
        message: `Nie ma użytkownika o adresie email: \/${data.email}`,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      oldUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: 'Podane hasło jest nieprawidłowe' });
    }
    const token = jwt.sign(
      { email: oldUser.email, _id: oldUser._id, role: oldUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: EXP,
      }
    );
    res.status(200).json({
      _id: oldUser._id,
      email: oldUser.email,
      name: oldUser.name,
      lastName: oldUser.lastName,
      avatar: oldUser.avatar,
      role: oldUser.role,
      createdAt: oldUser.createdAt,
      updatedAt: oldUser.updatedAt,
      token: token,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const signupUser = async (req, res) => {
  const data = req.body;

  console.log('USER - SIGNUP', req.body);
  try {
    const oldUser = await User.findOne({ email: data.email });
    if (oldUser) {
      return res.status(400).json({
        message: `Użytkownika o adresie email: \/${data.email} już istnieje`,
      });
    }
    if (data.password !== data.confirmedPassword) {
      return res.status(400).json({
        message: `Hasło \/${data.password}\/ różni sie od potwierdzenia hasła: \/${data.confirmedPassword} `,
      });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUserData = new User({
      avatar: data.avatar,
      email: data.email,
      password: hashedPassword,
      name: data.name,
      lastName: data.lastName,
      role: data.role,
    });
    const newUser = await newUserData.save();
    const token = jwt.sign(
      { email: newUser.email, _id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: EXP,
      }
    );
    res.status(200).json({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      token: token,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
