import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/categories - Listar categorías
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// POST /api/categories - Crear categoría (solo admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

export default router;