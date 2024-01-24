const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const oneHour = 1000 * 60 * 60;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: oneHour,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachJwtToResponse = ({ user }) => {
  const token = createJWT({ payload: user });

  const oneHour = 1000 * 60 * 60;
  const longerExp = 1000 * 60 * 60 * 24 * 7;

  // Create an access token JWT with a one-day expiration
  const accessTokenJWT = createJWT({ payload: { user } });

  // // Create a refresh token JWT with a 30-day expiration
  // const refreshTokenJWT = createJWT({
  //   payload: { user },
  //   expiresIn: longerExp,
  // });

  // Return an object containing the access and refresh JWTs
  const tokens = { accessToken: accessTokenJWT };
  return tokens;
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay),
  //   secure: process.env.NODE_ENV === "production",
  //   signed: true,
  // });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachJwtToResponse,
};
