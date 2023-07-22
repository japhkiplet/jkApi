import jwt from 'jsonwebtoken'

 export const auth = (req, res, next) => {
  const token = req.header("x-user-token");
  if (!token)
    return res.status(401).send("Access denied. Not authenticated...");
  try {
    const jwtSecretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecretKey);

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid auth token...");
  }
};

// For User Profile
 export const isUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.username === req.params.username || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorized...");
    }
  });
};

// For Admin
 export const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorized...");
    }
  });
};

