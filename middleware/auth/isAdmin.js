import jwt from 'jsonwebtoken';
export const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.role === 'admin') {
      const admin = {
        _id: decodedToken._id,
        email: decodedToken.email,
        role: decodedToken.role,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };
      req.admin = admin;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
export default isAdmin;
