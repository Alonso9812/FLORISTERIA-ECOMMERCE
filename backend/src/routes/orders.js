import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';
import { sendEmail, orderConfirmationTemplate, newOrderAdminTemplate } from '../utils/email.js';

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
      include: { 
        items: { 
          include: { product: true } 
        },
        user: true
      }
    });

    // Enviar email de confirmación al cliente
    try {
      await sendEmail({
        to: req.user.email,
        subject: `🌸 Confirmación de Pedido #${order.id}`,
        html: orderConfirmationTemplate(order, order.items)
      });
      console.log('✅ Email de confirmación enviado al cliente');
    } catch (emailError) {
      console.error('❌ Error enviando email al cliente:', emailError);
    }

    // Enviar notificación al admin
    try {
      await sendEmail({
        to: 'admin@floristeria.com',
        subject: `📦 Nuevo Pedido #${order.id} - $${parseFloat(total).toFixed(2)}`,
        html: newOrderAdminTemplate(order, order.items)
      });
      console.log('✅ Email de notificación enviado al admin');
    } catch (emailError) {
      console.error('❌ Error enviando email al admin:', emailError);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// GET /api/orders - Obtener órdenes del usuario (o todas si es admin)
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.userId };
    
    const orders = await prisma.order.findMany({
      where,
      include: { 
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// GET /api/orders/:id - Obtener una orden específica
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true, phone: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Solo admin o el dueño puede ver
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

// PUT /api/orders/:id/status - Actualizar estado (solo admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: true
      }
    });

    // Notificar al cliente del cambio de estado
    try {
      const statusLabels = {
        PAID: 'Pagado',
        PROCESSING: 'En preparación',
        SHIPPED: 'En camino',
        DELIVERED: 'Entregado',
        CANCELLED: 'Cancelado'
      };

      await sendEmail({
        to: order.user.email,
        subject: `🌸 Actualización de Pedido #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e11d48;">Actualización de tu Pedido #${order.id}</h2>
            <p>Hola ${order.recipientName},</p>
            <p>Tu pedido ha sido actualizado:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; font-weight: bold; color: #e11d48; margin: 0;">
                ${statusLabels[status] || status}
              </p>
            </div>
            <p>Gracias por confiar en nosotros.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error enviando email de actualización:', emailError);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});

export default router;