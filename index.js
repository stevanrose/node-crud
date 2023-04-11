const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/person", async (req, res) => {
  try {
    const person = await prisma.person.create({
      data: req.body,
    });
    res.status(201).json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || "3059";

app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});
