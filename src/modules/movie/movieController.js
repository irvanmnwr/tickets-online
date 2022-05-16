const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
// --
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");
// --
module.exports = {
  getAllMovie: async (request, response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, sort, name, releaseDate } = request.query;
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
      if (!releaseDate) {
        releaseDate = "";
      }
      page = Number(page);
      limit = Number(limit);
      name = `%${name}%`;
      const offset = page * limit - limit;

      const allData = await movieModel.getCountMovie();
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        sort,
        name,
        releaseDate
      );
      const totalData = result.length;
      const totalPage = Math.ceil(allData / limit);
      const pageInfo = {
        page,
        totalData,
        totalPage,
      };
      // Proses Menyimpan data ke redis
      redis.setEx(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

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
      const image = `${request.file.filename}.${
        request.file.mimetype.split("/")[1]
      }`;
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = request.body;
      const setData = {
        name,
        category,
        image,
        releaseDate,
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
      const result = await movieModel.getMovieById(id);
      if (request.file) {
        cloudinary.uploader.destroy(`${result[0].image.split(".")[0]}`);
      }
      let image = null;
      if (request.file) {
        image = `${request.file.filename}.${
          request.file.mimetype.split("/")[1]
        }`;
      }

      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = request.body;
      const setData = {
        name,
        category,
        image,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const newResult = await movieModel.updateMovie(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        newResult
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
      if (result[0].image) {
        cloudinary.uploader.destroy(`${result[0].image.split(".")[0]}`);
      }

      await movieModel.deleteMovie(id);
      return helperWrapper.response(response, 200, `${id} has deleted !`, null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
