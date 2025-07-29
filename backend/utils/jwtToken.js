const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // ✅ Production Cookie Options (for Render)
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,         // 🔐 Required for HTTPS (Render)
    sameSite: "None",     // 🔐 Allow cross-origin cookie
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;

