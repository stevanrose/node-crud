const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/person', async (req, res) => {
    const person = await prisma.person.create({
        data: req.body
    })
    res.json(person);
});

app.get('/person', async (req, res) => {
    const totalRecords = await prisma.person.count();
    var pagination = { skip: parseInt(req.query.skip), take: parseInt(req.query.take), totalRecords, totalRecords };

    const results = await prisma.person.findMany({
        skip: pagination.skip,
        take: pagination.take,
    });

    var response = { results: results, pagination: pagination };
    res.json(response);
});

const port = process.env.PORT || "3000";

app.listen(port, () => {
    console.log(`Server Running at ${port} 🚀`);
});
