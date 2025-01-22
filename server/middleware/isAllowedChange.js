const isAllowedChange = (req, res, next) => {
  const { role, isAllowedChange } = req.user;

  if (role === "teacher" && isAllowedChange) {
    next();
  } else {
    res
      .status(403)
      .json({
        message: "Forbidden: You do not have permission to make changes.",
      });
  }
};

module.exports = isAllowedChange;
