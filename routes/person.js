const express = require("express");
const router = express.Router();
const Validator = require("../middlewares/Validator");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

router.delete("/:id", async (req, res, next) => {
  try {
    const person = await prisma.person.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(204);
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

router.post("/", Validator("personPostSchema"), async (req, res, next) => {
  try {
    const person = await prisma.person.create({
      data: req.body,
    });
    res.status(201).json(person);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", Validator("personPutSchema"), async (req, res, next) => {
  try {
    const person = await prisma.person.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        firstName: req.body.firstName || undefined,
        lastName: req.body.lastName || undefined,
        gender: req.body.gender || undefined,
        dateOfBirth: req.body.dayeOfBirth || undefined,
        email: req.body.email || undefined,
        phoneNumber: req.body.phoneNumber || undefined,
      },
    });

    res.status(200).json(person);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
