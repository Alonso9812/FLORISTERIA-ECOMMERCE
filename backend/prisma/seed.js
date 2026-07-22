import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ========== LIMPIAR DATOS EXISTENTES ==========
  console.log('🧹 Limpiando datos existentes...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Datos limpiados');

  // ========== CREAR CATEGORÍAS ==========
  console.log('📂 Creando categorías...');
  await prisma.category.createMany({
    data: [
      { name: 'Rosas', slug: 'rosas', image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400' },
      { name: 'Girasoles', slug: 'girasoles', image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=400' },
      { name: 'Lirios', slug: 'lirios', image: 'https://images.unsplash.com/photo-1589539118272-c28cb396a1c6?w=400' },
      { name: 'Orquídeas', slug: 'orquideas', image: 'https://images.unsplash.com/photo-1566928400-4b1a9c5e8e1e?w=400' },
      { name: 'Arreglos', slug: 'arreglos', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400' },
      { name: 'Cajas de Flores', slug: 'cajas', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400' },
      { name: 'Tulipanes', slug: 'tulipanes', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400' },
      { name: 'Flores Secas', slug: 'flores-secas', image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400' },
    ],
  });
  console.log('✅ 8 categorías creadas');

  // ========== OBTENER IDs ==========
  const rosas = await prisma.category.findUnique({ where: { slug: 'rosas' } });
  const girasoles = await prisma.category.findUnique({ where: { slug: 'girasoles' } });
  const lirios = await prisma.category.findUnique({ where: { slug: 'lirios' } });
  const orquideas = await prisma.category.findUnique({ where: { slug: 'orquideas' } });
  const arreglos = await prisma.category.findUnique({ where: { slug: 'arreglos' } });
  const cajas = await prisma.category.findUnique({ where: { slug: 'cajas' } });
  const tulipanes = await prisma.category.findUnique({ where: { slug: 'tulipanes' } });
  const floresSecas = await prisma.category.findUnique({ where: { slug: 'flores-secas' } });

  // ========== CREAR PRODUCTOS ==========
  console.log('🌸 Creando productos...');
  await prisma.product.createMany({
    data: [
      {
        name: 'Ramo de 6 Rosas Rojas',
        slug: 'ramo-6-rosas-rojas',
        description: 'El detalle clásico. Seis rosas rojas frescas, papel kraft y lazo.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=600',
        stock: 30,
        featured: true,
        categoryId: rosas.id,
      },
      {
        name: 'Ramo de 12 Rosas Rojas Premium',
        slug: 'ramo-12-rosas-rojas',
        description: 'Doce rosas rojas premium importadas, envueltas a mano.',
        price: 24.99,
        oldPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600',
        stock: 50,
        featured: true,
        categoryId: rosas.id,
      },
      {
        name: 'Ramo de 24 Rosas Rojas',
        slug: 'ramo-24-rosas-rojas',
        description: 'Ramo grande de rosas rojas premium, ideal para aniversarios.',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600',
        stock: 20,
        featured: true,
        categoryId: rosas.id,
      },
      {
        name: 'Ramo de 50 Rosas Rojas Romántico',
        slug: 'ramo-50-rosas-romanticas',
        description: 'Cincuenta rosas rojas premium para un gesto definitivo.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600',
        stock: 10,
        featured: true,
        categoryId: rosas.id,
      },
      {
        name: 'Rosas Rosadas Premium',
        slug: 'rosas-rosadas-premium',
        description: 'Doce rosas rosadas de tono pastel, perfectas para el Día de la Madre.',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1490750967868-88aa2f6eb0d2?w=600',
        stock: 25,
        featured: false,
        categoryId: rosas.id,
      },
      {
        name: 'Ramo de 10 Girasoles',
        slug: 'ramo-10-girasoles',
        description: 'Diez girasoles frescos. Símbolo de alegría.',
        price: 23.99,
        image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600',
        stock: 25,
        featured: true,
        categoryId: girasoles.id,
      },
      {
        name: 'Ramo de 5 Girasoles Mini',
        slug: 'ramo-5-girasoles-mini',
        description: 'Cinco girasoles en presentación compacta, ideal para un detalle rápido.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600',
        stock: 35,
        featured: false,
        categoryId: girasoles.id,
      },
      {
        name: 'Ramo de 8 Lirios Orientales',
        slug: 'ramo-8-lirios-orientales',
        description: 'Ocho varas de lirios blancos con fragancia distintiva.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1589539118272-c28cb396a1c6?w=600',
        stock: 18,
        featured: true,
        categoryId: lirios.id,
      },
      {
        name: 'Lirios Rosados Elegantes',
        slug: 'lirios-rosados-elegantes',
        description: 'Lirios rosados en presentación elegante, perfectos para arreglos sofisticados.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1589539118272-c28cb396a1c6?w=600',
        stock: 15,
        featured: false,
        categoryId: lirios.id,
      },
      {
        name: 'Orquídea Phalaenopsis en Maceta',
        slug: 'orquidea-phalaenopsis-maceta',
        description: 'Orquídea Phalaenopsis en maceta decorativa. Florece entre 2 y 3 meses.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1566928400-4b1a9c5e8e1e?w=600',
        stock: 12,
        featured: true,
        categoryId: orquideas.id,
      },
      {
        name: 'Orquídea Blanca Premium',
        slug: 'orquidea-blanca-premium',
        description: 'Orquídea blanca de doble tallo en maceta de cerámica. Elegancia pura.',
        price: 49.99,
        oldPrice: 59.99,
        image: 'https://images.unsplash.com/photo-1566928400-4b1a9c5e8e1e?w=600',
        stock: 8,
        featured: true,
        categoryId: orquideas.id,
      },
      {
        name: 'Arreglo Floral Clásico Primavera',
        slug: 'arreglo-clasico-primavera',
        description: 'Arreglo en base decorativa con flores mixtas.',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600',
        stock: 15,
        featured: true,
        categoryId: arreglos.id,
      },
      {
        name: 'Arreglo Elegante Gala',
        slug: 'arreglo-elegante-gala',
        description: 'Diseño premium con rosas, hortensias y follaje de lujo.',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600',
        stock: 10,
        featured: true,
        categoryId: arreglos.id,
      },
      {
        name: 'Ramo de Flores Mixto del Día',
        slug: 'ramo-flores-mixto-dia',
        description: 'Ramo signature con flores frescas de temporada seleccionadas por nuestras floristas.',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600',
        stock: 40,
        featured: false,
        categoryId: arreglos.id,
      },
      {
        name: 'Arreglo de Condolencias Blanco',
        slug: 'arreglo-condolencias-blanco',
        description: 'Arreglo blanco con lirios, rosas blancas y crisantemos. Respeto y paz.',
        price: 32.99,
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600',
        stock: 12,
        featured: false,
        categoryId: arreglos.id,
      },
      {
        name: 'Caja de Rosas Love Box',
        slug: 'caja-rosas-love-box',
        description: 'Dieciséis rosas rojas en flower box hidratado.',
        price: 38.99,
        oldPrice: 44.99,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600',
        stock: 18,
        featured: true,
        categoryId: cajas.id,
      },
      {
        name: 'Caja de Rosas Premium Negra',
        slug: 'caja-rosas-premium-negra',
        description: 'Veinticuatro rosas rojas en caja negra de lujo. El regalo definitivo.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600',
        stock: 10,
        featured: true,
        categoryId: cajas.id,
      },
      {
        name: 'Ramo de 20 Tulipanes Holandeses',
        slug: 'ramo-20-tulipanes-holandeses',
        description: 'Veinte tulipanes holandeses en color a elección.',
        price: 42.99,
        image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600',
        stock: 15,
        featured: true,
        categoryId: tulipanes.id,
      },
      {
        name: 'Tulipanes Mixtos de Temporada',
        slug: 'tulipanes-mixtos-temporada',
        description: 'Quince tulipanes en colores mixtos de temporada.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600',
        stock: 20,
        featured: false,
        categoryId: tulipanes.id,
      },
      {
        name: 'Arreglo de Flores Secas Naturalia',
        slug: 'arreglo-flores-secas-naturalia',
        description: 'Combinación de pampas grass, trigo, lavanda y eucalipto preservado.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600',
        stock: 20,
        featured: true,
        categoryId: floresSecas.id,
      },
      {
        name: 'Rosa Preservada en Cúpula',
        slug: 'rosa-preservada-cupula',
        description: 'Rosa preservada en cúpula de cristal. Dura hasta tres años sin agua.',
        price: 27.99,
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600',
        stock: 25,
        featured: false,
        categoryId: floresSecas.id,
      },
    ],
  });
  console.log('✅ 20 productos creados');

  // ========== USUARIO ADMIN ==========
  console.log('👤 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@floristeria.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✅ Usuario admin: admin@floristeria.com / admin123');

  // ========== USUARIO CLIENTE ==========
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      email: 'cliente@ejemplo.com',
      password: userPassword,
      name: 'Cliente de Prueba',
      phone: '+506 8888-8888',
      role: 'USER',
    },
  });
  console.log('✅ Usuario cliente: cliente@ejemplo.com / user123');

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });