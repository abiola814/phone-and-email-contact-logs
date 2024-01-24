const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  const authHeader = await req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = await authHeader.split(" ")[1];
  }

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
  console.log(token);
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
