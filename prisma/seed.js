const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { faker } = require('@faker-js/faker');

async function main() {

    for (let i = 0; i < 100; i++) {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const gender = faker.name.gender();
        const dateOfBirth = faker.date.birthdate()
        const email = faker.internet.email(firstName, lastName)
        const phoneNumber = faker.phone.number();

        const person = await prisma.person.upsert({
            where: { email: email },
            update: {},
            create: {
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                dateOfBirth: dateOfBirth,
                email: email,
                phoneNumber: phoneNumber,
            },
        })
        console.log(person)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

