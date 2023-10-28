const multer = require("multer");
const { diskStorage } = require("multer");
const { join, dirname } = require("path");
const { fileURLToPath } = require("url");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = diskStorage({
  destination: function (req, file, callback) {
    const uploadDir = join(__dirname, "../public/image");
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");

module.exports = upload;
