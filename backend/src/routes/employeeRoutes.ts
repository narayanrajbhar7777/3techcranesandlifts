import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getEmployeeDetails, getAllEmployees, createEmployee, getEmployeeFormConfigs, toggleEmployeeStatus, deleteEmployee, updateEmployee } from '../controllers/employeeController';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/config', getEmployeeFormConfigs);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeDetails);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.patch('/:id/status', toggleEmployeeStatus);
router.delete('/:id', deleteEmployee);

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the path and metadata so frontend can save it
  res.json({ 
    url: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size
  });
});

export default router;
