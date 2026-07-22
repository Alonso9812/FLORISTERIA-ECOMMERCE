import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - Crear orden
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, recipientName, recipientPhone, address, city, message, deliveryDate } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total: parseFloat(total),
        recipientName,
        recipientPhone,
        address,
        city,
        message,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price)
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// GET /api/orders - Obtener órdenes del usuario
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

export default router;