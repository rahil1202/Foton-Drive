import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userSchema.js';
import {
  sendOtpEmail,
  sendRegistrationSuccessEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
} from '../services/emailService.js';
import { generateTokens } from '../utils/tokenutils.js';

// Register User
export const register = async (req, res) => {
  let { name, phoneNumber, email, password } = req.body;

  if (!name || !phoneNumber || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email or phone number' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = Date.now() + 15 * 60 * 1000;

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      otp: hashedOtp,
      otpExpires,
    });

    await newUser.save();

    await sendOtpEmail(email, `${name}`, `${otp}`);

    return res.status(201).json({ message: 'Email sent. Please verify your OTP.' });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ message: 'Error registering user!', error: err.message || err });
  }
};

// Resend Registration OTP
export const resendRegistrationOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found, Please Register First' });
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(
      email,
      'Confirm Your Registration for The FMS Platform |  Rahil Vahora',
      `${otp}`
    );

    return res.status(201).json({ message: 'Email sent. Please verify your OTP.' });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ message: 'Error resending OTP!', error: err.message || err });
  }
};

// Confirm Registration with OTP
export const confirmRegistration = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Registration failed.' });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP. Registration failed.' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Send confirmation email
    await sendRegistrationSuccessEmail(
      email,
      'Registration Confirmed for The FMS Platform |  Rahil Vahora',
      'Your registration has been confirmed. You can now log in.'
    );

    return res.status(200).json({ message: 'Registration confirmed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user);

    // Set Refresh Token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      email: user.email,
      token: accessToken,
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Refresh access token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ message: 'Unauthorized : Missing Refresh Token' });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { accessToken, newRefreshToken } = generateTokens(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.clearCookie('refreshToken'); // Clear cookie on error
    res.status(403).json({ message: 'Invalid or expired Refresh Token', error: err.message });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging out', error: err.message });
  }
};

// Reset Password with OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail(
      email,
      'Reset Your Password for The FMS Platform |  Rahil Vahora',
      `${otp}`
    );

    return res.status(200).json({ message: 'Email sent. Please verify your OTP.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err });
  }
};

// Verify OTP for Password Reset
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    await sendResetPasswordSuccessEmail(
      email,
      'Password Changed Successfully for The One FMS Platform |  Rahil Vahora',
      'Your password has been successfully changed. If this was not you, please contact support immediately.'
    );

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err });
  }
};
