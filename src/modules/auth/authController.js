const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
// --
module.exports = {
  register: async (request, response) => {
    try {
      // encrypt pass in node js
      // email tidak boleh sama
      const { firstName, email, password } = request.body;
      const salt = bcrypt.genSaltSync(10);
      const cekUser = await authModel.getUserByEmail(email);
      //   1. jika email tidak ada did alam database
      if (cekUser.length > 0) {
        return helperWrapper.response(
          response,
          404,
          "Email already registed",
          null
        );
      }

      const setData = {
        firstName,
        lastName: "munawir",
        email,
        noTelp: "08123213",
        password: await bcrypt.hashSync(password, salt),
      };
      const result = await authModel.register(setData);
      return helperWrapper.response(response, 200, "success", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      const cekUser = await authModel.getUserByEmail(email);
      //   1. jika email tidak ada did alam database
      if (cekUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registed",
          null
        );
      }

      bcrypt.compare(password, cekUser[0].password).then((doMatch) => {
        if (doMatch) {
          const payLoad = cekUser[0];
          delete payLoad.password;

          const token = jwt.sign({ ...payLoad }, "RAHASIA", {
            expiresIn: "24h",
          });
          return helperWrapper.response(response, 200, "success login", {
            id: payLoad.id,
            token,
          });
        }
        return helperWrapper.response(response, 400, "Wrong password", null);
      });

      // prosesJWT
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
