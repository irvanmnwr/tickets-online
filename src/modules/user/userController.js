const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
// --
const userModel = require("./userModel");
// --
module.exports = {
  getUserById: async (request, response) => {
    try {
      const { id } = request.decodeToken;
      const result = await userModel.getUserById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.decodeToken;
      const { firstName, lastName, noTelp, email } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await userModel.updateProfile(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const { id } = request.decodeToken;
      const cekuser = await userModel.getUserById(id);
      const { oldPassword, newPassword } = request.body;

      //   eslint-disable-next-line consistent-return
      bcrypt.compare(oldPassword, cekuser[0].password).then(async (doMatch) => {
        if (doMatch) {
          const data = {
            password: await bcrypt.hashSync(newPassword, salt),
          };
          await userModel.updateProfile(id, data);

          return helperWrapper.response(
            response,
            200,
            "password has changed",
            null
          );
        }
      });
      return helperWrapper.response(
        response,
        400,
        "oldPassword is wrong",
        null
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
