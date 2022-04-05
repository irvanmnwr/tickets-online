const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const userModel = require("../user/userModel");
const emails = require("../../helpers/email");
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

        const templateEmail = {
          from: "admin",
          to: result.email,
          subject: "verification your email",
          html: `<p>click link below</p> 
          <p>localhost:3001/auth/verification/${token}`,
        };

        const newResult = await emails.sendEmail(templateEmail);
        return helperWrapper.response(
          response,
          200,
          "success create account",
          newResult
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
};
