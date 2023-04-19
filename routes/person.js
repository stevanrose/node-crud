const express = require("express");
const router = express.Router();
const Validator = require("../middlewares/Validator");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", Validator("personSchema"), async (req, res, next) => {
  try {
    const person = await prisma.person.create({
      data: req.body,
    });
    res.status(201).json(person);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
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

router.get("/:email", async (req, res, next) => {
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

module.exports = router;
