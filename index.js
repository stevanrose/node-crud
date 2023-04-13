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

app.get("/person", async (req, res) => {
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
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
});

app.get("/person/:email", async (req, res) => {
  const email = req.params.email;
  console.log("params: ", req.params);

  console.log("email: ", email);
  try {
    const result = await prisma.person.findUniqueOrThrow({
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json(result);
  } catch (e) {
    if (e.code === PrismaError.RecordsNotFound) {
      res.status(404).json({
        message: `Person not found with email: ${email}`,
      });
    } else {
      res.status(e.code).json({ message: e.message });
    }
  }
});

const port = process.env.PORT || "3059";

app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});
