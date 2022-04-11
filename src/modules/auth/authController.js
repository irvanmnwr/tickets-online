const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const userModel = require("../user/userModel");
const redis = require("../../config/redis");
const mail = require("../../helpers/mail");
// --
module.exports = {
  register: async (request, response) => {
    try {
      // encrypt pass in node js
      // email tidak boleh sama
      const { firstName, lastName, email, noTelp, password } = request.body;
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
        id: uuidv4(),
        firstName,
        lastName,
        email,
        noTelp,
        password: await bcrypt.hashSync(password, salt),
      };
      const result = await authModel.register(setData);

      if (result) {
        const cek = await authModel.getUserByEmail(result.email);
        const token = jwt.sign(
          {
            id: cek[0].id,
          },
          "RAHASIA",
          {
            expiresIn: "24h",
          }
        );

        const setSendEmail = {
          to: result.email,
          subject: "Email Verification !",
          name: result.firstName,
          template: "verificationEmail.html",
          buttonUrl: `https://project-tickets-online.herokuapp.com/auth/verification/${token}`,
        };
        mail.sendMail(setSendEmail);

        return helperWrapper.response(
          response,
          200,
          "success create account",
          setSendEmail
        );
      }
      return helperWrapper.response(response, 400, "Register Failed", null);
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

      if (cekUser[0].status === "0") {
        return helperWrapper.response(
          response,
          404,
          "Account not actived",
          null
        );
      }

      bcrypt.compare(password, cekUser[0].password).then((doMatch) => {
        if (doMatch) {
          const payLoad = cekUser[0];
          delete payLoad.password;

          const token = jwt.sign({ ...payLoad }, "RAHASIA", {
            expiresIn: "2h",
          });
          const refreshToken = jwt.sign({ ...payLoad }, "RAHASIABARU", {
            expiresIn: "24h",
          });
          return helperWrapper.response(response, 200, "success login", {
            id: payLoad.id,
            token,
            refreshToken,
          });
        }
        return helperWrapper.response(response, 400, "Wrong password", null);
      });

      // prosesJWT
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        // eslint-disable-next-line no-param-reassign
        delete result.iat;
        // eslint-disable-next-line no-param-reassign
        delete result.exp;
        const token = jwt.sign({ result }, "RAHASIA", {
          expiresIn: "2h",
        });
        const newRefreshToken = jwt.sign({ result }, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "success login", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  verification: async (request, response) => {
    try {
      const { id } = request.params;
      jwt.verify(id, "RAHASIA", async (error, result) => {
        if (!error) {
          request.decodeToken = result;

          const newId = result.id;
          const setData = {
            status: "1",
            // updateAt: new Date(Date.now()),
          };
          await userModel.updateProfile(newId, setData);
          return helperWrapper.response(
            response,
            200,
            "account activated",
            null
          );
        }
        return helperWrapper.response(response, 403, "activation failed", null);
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
