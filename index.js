const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");
const { PrismaError } = require("prisma-error-enum");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/person", async (req, res) => {
  try {
    const person = await prisma.person.create({
      data: req.body,
    });
    console.log("SUCCESS: ", person);
    res.status(201).json(person);
  } catch (e) {
    console.log("ERROR: ", JSON.stringify(e));
    if (e.code === PrismaError.UniqueConstraintViolation) {
      res.status(409).json({
        message: `Person already exists with this email: ${req.body.email}`,
      });
    } else {
      res.status(e.code).json({ message: e.message });
    }
  }
});

app.post("/person/v2", async (req, res, next) => {
  try {
    const person = await prisma.person.create({
      data: req.body,
    });
    res.status(201).json(person);
  } catch (error) {
    next(error);
  }
});

app.get("/person", async (req, res, next) => {
  try {
    const totalRecords = await prisma.person.count();
    var pagination = {
      skip: parseInt(req.query.skip),
      take: parseInt(req.query.take),
      totalRecords,
      totalRecords,
    };

    const results = await prisma.person.findMany({
      skip: pagination.skip,
      take: pagination.take,
    });

    var response = { results: results, pagination: pagination };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/person/:email", async (req, res, next) => {
  try {
    const result = await prisma.person.findUniqueOrThrow({
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    error.meta = { email: req.params.email };
    next(error);
  }
});

function errorHandler(error, req, res, next) {
  let status = 500;
  let message = `Internal server error`;

  if (error.code === PrismaError.UniqueConstraintViolation) {
    status = 409;
    message = `Person already exists with this email: ${req.body.email}`;
  }

  if (error.code === PrismaError.RecordsNotFound) {
    status = 404;
    message = `Person not found with email: ${error.meta.email}`;
  }

  res.status(status).json({ message: message });
}

app.use(errorHandler);

const port = process.env.PORT || "3059";

app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});
