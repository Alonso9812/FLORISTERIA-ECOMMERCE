import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'ljordialonso@gmail.com' },
    update: {},
    create: {
      email: 'ljordialonso@gmail.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  
  console.log('✅ Admin creado:', admin.email, '/ contraseña: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());