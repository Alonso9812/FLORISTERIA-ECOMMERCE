import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️ Actualizando imágenes de categorías...');

  await prisma.category.update({
    where: { slug: 'lirios' },
    data: {
      image: 'https://m.media-amazon.com/images/I/81+pUq4QAxL._AC_UF894,1000_QL80_.jpg'
    }
  });
  console.log('✅ Lirios actualizado');

  await prisma.category.update({
    where: { slug: 'orquideas' },
    data: {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFidpbZi_br6BWgfZQiLKFEmUOhqRGjtRPASyVGMfmfDw5QNWsryGzGKI4&s=10'
    }
  });
  console.log('✅ Orquídeas actualizado');

  console.log('🎉 Imágenes actualizadas sin borrar datos');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());