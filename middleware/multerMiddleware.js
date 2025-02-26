import multer from "multer"
import {v4 as uuidv4} from "uuid"
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from "path";

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const newfileName = uuidv4() + path.extname(file.originalname);
      cb(null, newfileName )
    }
  })


  // File Filter for Validations (Allow only Images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and JPG formats are allowed"), false);
  }
  cb(null, true);
};

// multer Upload Middleware
export const upload = multer({
  storage:storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
