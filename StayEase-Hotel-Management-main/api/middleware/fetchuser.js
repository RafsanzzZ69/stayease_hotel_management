// const JWT_SECRET = "this_is_secret"; // Ensure this is set in your environment variables

// import jwt from "jsonwebtoken";

// const fetchUser = (req, res, next) => {
//   // Get token from header
//   const token = req.header("auth-token");

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   try {
//     const data = jwt.verify(token, JWT_SECRET);
//     req.user = data; // { userId, email }
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// export default fetchUser;



import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "this_is_secret";

const fetchUser = (req, res, next) => {
  // Get token from header
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    // data now contains { userId, email, role }
    req.user = {
      userId: data.userId,
      email: data.email,
      role: data.role,
      name: data.name,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default fetchUser;
