const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
    console.log("UPLOADS destination");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm fayllar yuklash mumkin!"), false);
  }
};

const fileExtentionFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext))
    return cb(
      new Error("Faqat .jpg, .jpeg, .png, .svg fayllar yuklash mumkin!"),
      false
    );

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    fileFilter(req, file, (err, fileAllowed) => {
      if (err) return cb(err);
      fileExtentionFilter(req, file, cb);
    });
  },
  limits: {
    fileSize: 1024 * 1024 * 7,
  },
});

module.exports = upload;
