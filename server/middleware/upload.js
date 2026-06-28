const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Only PDF or Word documents are allowed'));
  },
});

// In-memory upload for small branding assets (logos, barcodes) — stored as base64
// directly in the database instead of on disk, since the local filesystem does not
// persist across Hostinger redeploys (uploaded files in server/uploads get wiped).
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed'));
  },
});

const toDataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

module.exports = upload;
module.exports.uploadResume = uploadResume;
module.exports.uploadMemory = uploadMemory;
module.exports.toDataUri = toDataUri;
