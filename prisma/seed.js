// Script de seed: inserta usuarios de prueba en la base de datos usando Prisma
const { PrismaClient } = require('../generated/prisma'); // Prisma client te permite hablar con la base de datos
const prisma = new PrismaClient();

async function main() {
  // Creación de usuarios de demostración
  // const users = [
    // { name: 'Usuario 1', email: 'usuario1@ejemplo.com' },
    // { name: 'Usuario 2', email: 'usuario2@ejemplo.com' },
    // { name: 'Usuario 3', email: 'usuario3@ejemplo.com' }
  // ];

  // for (const user of users) {
    // await prisma.user.create({
      // data: user
    // });
  // }

  // console.log('Usuarios de demostración creados con éxito');

  await prisma.user.deleteMany()
}

main() // ejecuta el script
  .catch(e => console.error(e)) // si hay error lo muestra
  .finally(async () => await prisma.$disconnect()); // y cuando termine se desconecta