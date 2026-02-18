import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for audio/video
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|mp3|wav|webm|m4a|ogg/;
        const mimetype = /image|audio/.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Erreur: Images ou Audio seulement!"));
    }
});

router.post('/', upload.single('photo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }
        // Construct URL based on host
        let protocol = req.protocol;
        const host = req.get('host');

        // Trust proxy protocol if available (localtunnel uses this)
        if (req.headers['x-forwarded-proto']) {
            protocol = req.headers['x-forwarded-proto'] as string;
        }

        const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({ url: fullUrl, filename: req.file.filename });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement' });
    }
});

export default router;
