import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_super_secret_key';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer for evidence files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const metricSchema = z.object({
  scope3Category: z.string().min(1),
  activityValue: z.number().positive(),
  activityUnit: z.string().min(1),
  reportingPeriod: z.string().min(1),
  notes: z.string().optional(),
});

const submissionSchema = z.object({
  tokenHash: z.string().min(1),
  metrics: z.array(metricSchema).min(1),
});

interface SupplierJwtPayload {
  supplierId: string;
  orgId: string;
}

// POST /api/supplier/submit
// Accepts multipart/form-data. 'evidence' holds the files, 'tokenHash' and 'metrics' are fields.
router.post('/submit', upload.array('evidence', 5), async (req: Request, res: Response) => {
  try {
    // In multipart/form-data, arrays/objects are often sent as JSON strings
    let parsedMetrics = req.body.metrics;
    if (typeof parsedMetrics === 'string') {
      try {
        parsedMetrics = JSON.parse(parsedMetrics);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON format for metrics field' });
      }
    }

    // 1. Validate Payload Shape
    const validatedData = submissionSchema.parse({
      tokenHash: req.body.tokenHash,
      metrics: parsedMetrics
    });

    // 2. Decode & Verify Token
    let decoded: SupplierJwtPayload;
    try {
      decoded = jwt.verify(validatedData.tokenHash, JWT_SECRET) as SupplierJwtPayload;
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token hash' });
    }

    // 3. Verify Supplier Exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: decoded.supplierId }
    });

    if (!supplier || supplier.organizationId !== decoded.orgId) {
      return res.status(403).json({ error: 'Unauthorized supplier identity' });
    }

    // 4. Handle Evidence Files (if any)
    const files = req.files as Express.Multer.File[];
    let combinedNotesAppendedWithFiles = '';
    if (files && files.length > 0) {
      const fileNames = files.map(f => f.filename).join(', ');
      combinedNotesAppendedWithFiles = ` [Evidence Files Attached: ${fileNames}]`;
    }

    // 5. Insert Metrics via Transaction
    const submissions = await prisma.$transaction(
      validatedData.metrics.map(metric => 
        prisma.supplierSubmission.create({
          data: {
            supplierId: decoded.supplierId,
            organizationId: decoded.orgId,
            scope3Category: metric.scope3Category,
            activityValue: metric.activityValue,
            activityUnit: metric.activityUnit,
            reportingPeriod: metric.reportingPeriod,
            notes: metric.notes ? metric.notes + combinedNotesAppendedWithFiles : combinedNotesAppendedWithFiles.trim(),
            status: 'SUBMITTED',
            dataQualityScore: null,
          }
        })
      )
    );

    res.status(201).json({ 
      message: 'Successfully recorded submissions and evidence', 
      count: submissions.length,
      filesUploaded: files ? files.length : 0
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to process supplier submission' });
  }
});

export default router;
