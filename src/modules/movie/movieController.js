const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
// --
const movieModel = require("./movieModel");
// --
module.exports = {
  getHello: async (request, response) => {
    try {
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, sort, name } = request.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 3;
      }
      if (!sort) {
        sort = `id`;
      }
      if (!name) {
        name = "";
      }
      page = Number(page);
      limit = Number(limit);
      name = `%${name}%`;
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(
        limit,
        offset,
        sort,
        name
      );
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalData,
        totalPage,
      };

      const result = await movieModel.getAllMovie(limit, offset, sort, name);
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      // proses untuk menyimpan data ke redist
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

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
  createMovie: async (request, response) => {
    try {
      const { name, category, relaseDate, cast, director, duration, synopsis } =
        request.body;
      const setData = {
        name,
        category,
        relaseDate,
        cast,
        director,
        duration,
        synopsis,
        // image: request.file ? request.file.filename
      };
      const result = await movieModel.createMovie(setData);
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
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, category, relaseDate, cast, director, duration, synopsis } =
        request.body;
      const setData = {
        name,
        category,
        relaseDate,
        cast,
        director,
        duration,
        synopsis,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); // property
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovie(id, setData);
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
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      await movieModel.deleteMovie(id);
      return helperWrapper.response(response, 200, `${id} has deleted !`, null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
