import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed iniciado...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@floristeria.com' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@floristeria.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin creado: admin@floristeria.com / admin123');
  } else {
    console.log('ℹ️ Admin ya existe');
  }

  console.log('🎉 Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });