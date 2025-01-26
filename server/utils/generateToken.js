const jwt = require('jsonwebtoken');

const generateToken = (res, user) => {
  const payload = {
    user: user,
  };

  // Generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',  // The token expires in 1 day
  });

  // Set JWT token as HttpOnly cookie
  res.cookie('access_token', token, {
    sameSite: 'none',    // Use 'none' when deploying (cross-origin cookies)
    // sameSite: 'lax',   // Use 'lax' during development for local cookies
    path: '/',
    expires: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),  // Token expiry of 1 day (matching JWT expiry)
    httpOnly: true,      // Prevents JavaScript from accessing the cookie
    secure: true,        // Use 'secure: true' when deploying (only send over HTTPS)
  });
};

module.exports = generateToken;
