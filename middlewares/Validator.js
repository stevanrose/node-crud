const createHttpError = require("http-errors");
const Validators = require("../validators");

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`'${validator}' validator does not exist`);
  }
  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(
        req.body,
        options
      );
      req.body = validated;
      next();
    } catch (error) {
      if (error.isJoi) {
        const extractedErrors = [];
        error.details.map((err) => {
          extractedErrors.push({
            message: err.message,
          });
        });
        res.status(422).json({
          status: 422,
          message: "Invalid request",
          errors: extractedErrors,
        });
        return;
      }
      next(createHttpError(500));
    }
  };
};
