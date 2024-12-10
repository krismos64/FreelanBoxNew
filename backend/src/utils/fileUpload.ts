import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { AppError } from './appError';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new AppError('Type de fichier non autorisé', 400);
    }

    if (file.size > MAX_SIZE) {
      throw new AppError('Fichier trop volumineux', 400);
    }

    const hash = createHash('md5')
      .update(file.originalname + Date.now())
      .digest('hex');
    
    const extension = file.originalname.split('.').pop();
    const filename = `${hash}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    await writeFile(filepath, file.buffer);

    return `/uploads/${filename}`;
  } catch (error) {
    throw new AppError('Erreur lors du téléchargement du fichier', 500);
  }
};