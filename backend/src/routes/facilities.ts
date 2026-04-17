import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const facilitySchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1),
  location: z.string().optional(),
  type: z.string().optional(),
});

// GET /api/facilities
router.get('/', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;
    
    const whereClause = organizationId 
      ? { organizationId: String(organizationId) } 
      : {};

    const facilities = await prisma.facility.findMany({
      where: whereClause,
    });
    res.json({ facilities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// POST /api/facilities
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = facilitySchema.parse(req.body);
    
    // Ensure org exists
    const org = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId }
    });
    
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const facility = await prisma.facility.create({
      data: validatedData,
    });
    res.status(201).json(facility);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create facility' });
  }
});

export default router;
