import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// In a real app, this should be in .env. We use a fallback for hackathon MVP.
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_super_secret_key';

// POST /api/internal/suppliers/:id/invite
router.post('/:id/invite', async (req: Request, res: Response) => {
  try {
    const supplierId = req.params.id as string;

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Generate JWT containing supplierId and organizationId
    const token = jwt.sign(
      { 
        supplierId: supplier.id, 
        orgId: supplier.organizationId 
      }, 
      JWT_SECRET, 
      { expiresIn: '30d' } // Links valid for 30 days
    );

    // Provide the hash back to the internal user to send to the supplier
    res.json({ 
      supplierName: supplier.name,
      tokenHash: token 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate supplier invite' });
  }
});

export default router;
