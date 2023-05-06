const express = require("express");
const createHttpError = require("http-errors");
const { PrismaError } = require("prisma-error-enum");
const app = express();

const personRouter = require("./routes/person");
const e = require("express");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/person", personRouter);

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || `Internal server error`;

  if (err.code === PrismaError.UniqueConstraintViolation) {
    status = 409;
    message = `Person already exists with this email: ${req.body.email}`;
  }

  if (err.code === PrismaError.RecordsNotFound) {
    status = 404;
    if (err.meta.hasOwnProperty("email")) {
      message = `Person not found with email: ${err.meta.email}`;
    } else if (err.meta.hasOwnProperty("cause")) {
      message = err.meta.cause;
    } else {
      message = `Record does not exist`;
    }
  }

  res.status(status).json({
    error: {
      status: status,
      message: message,
    },
  });
});

const port = process.env.PORT || 3059;
app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});
