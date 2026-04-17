import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const organizationSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  reportingYear: z.number().int().optional(),
});

// GET /api/organizations
router.get('/', async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany();
    res.json({ organizations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// GET /api/organizations/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.params.id as string },
    });
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// POST /api/organizations
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = organizationSchema.parse(req.body);
    const org = await prisma.organization.create({
      data: validatedData,
    });
    res.status(201).json(org);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

export default router;
