const createTokenUser = (user) => {
  return {
    first_name: user.first_name,
    email: user.email,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
