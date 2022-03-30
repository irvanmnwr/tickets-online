const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
// --
module.exports = {
  register: async (request, response) => {
    try {
      // encrypt pass in node js
      // email tidak boleh sama
      const { firstName, email, password } = request.body;
      const setData = {
        firstName,
        email,
        password,
      };
      const result = await authModel.register(setData);
      return helperWrapper.response(response, 400, "success", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
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
      // 2. jika password ketika di cocokkan salah
      if (password !== cekUser[0].password) {
        return helperWrapper.response(response, 400, "Wrong password", null);
      }

      // prosesJWT
      const payLoad = cekUser[0];
      delete payLoad.password;

      const token = jwt.sign({ ...payLoad }, "RAHASIA", { expiresIn: "24h" });
      return helperWrapper.response(response, 200, "success login", {
        id: payLoad.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
