import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '24h' } 
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } 
  );

  return { accessToken, refreshToken };
};
