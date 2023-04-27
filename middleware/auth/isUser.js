import jwt from 'jsonwebtoken';
export const isUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role === 'user') {
      const user = {
        _id: decodedToken._id,
        email: decodedToken.email,
        role: decodedToken.role,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default isUser;
