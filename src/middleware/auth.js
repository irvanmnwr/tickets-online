const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");
const redis = require("../config/redis");

module.exports = {
  // eslint-disable-next-line consistent-return
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        response,
        403,
        "Your token is destroyed please login again",
        null
      );
    }

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (!error) {
        request.decodeToken = result;
        return next();
      }
      return helperWrapper.response(response, 403, "please login first", null);
    });
  },
  // eslint-disable-next-line consistent-return
  isAdmin: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (!error) {
        request.decodeToken = result;
        if (result.role === "1") {
          return next();
        }
        return helperWrapper.response(response, 403, "you're not admin", null);
      }
      return helperWrapper.response(response, 403, "please login first", null);
    });
  },
};
