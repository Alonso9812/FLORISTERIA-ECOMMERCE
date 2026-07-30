import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/stats/dashboard - Estadísticas generales
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Ventas de hoy
    const todaySales = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfDay }
      },
      _sum: { total: true },
      _count: true
    });

    // Ventas de la semana
    const weekSales = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfWeek }
      },
      _sum: { total: true },
      _count: true
    });

    // Ventas del mes
    const monthSales = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfMonth }
      },
      _sum: { total: true },
      _count: true
    });

    // Total de órdenes
    const totalOrders = await prisma.order.count();
    
    // Total de productos
    const totalProducts = await prisma.product.count();
    
    // Total de usuarios
    const totalUsers = await prisma.user.count();

    // Productos más vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    // Obtener nombres de productos
    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, image: true }
        });
        return {
          name: product?.name || 'Producto desconocido',
          quantity: item._sum.quantity,
          image: product?.image
        };
      })
    );

    // Ventas por día (últimos 7 días)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const daySales = await prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: start, lt: end }
        },
        _sum: { total: true }
      });
      
      last7Days.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        amount: daySales._sum.total || 0
      });
    }

    // Órdenes por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({
      today: {
        sales: todaySales._sum.total || 0,
        orders: todaySales._count
      },
      week: {
        sales: weekSales._sum.total || 0,
        orders: weekSales._count
      },
      month: {
        sales: monthSales._sum.total || 0,
        orders: monthSales._count
      },
      totals: {
        orders: totalOrders,
        products: totalProducts,
        users: totalUsers
      },
      topProducts: topProductsWithNames,
      last7Days,
      ordersByStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;