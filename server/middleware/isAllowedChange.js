const isAllowedChange = (req, res, next) => {
  const { role, isAllowedChanges } = req.user;
  if (role === "teacher" && isAllowedChanges) {
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
