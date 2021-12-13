const multer = require("multer");


// upload(req, res, function (err){
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//   }
  
//     // Everything went fine.
//   })

//verify extension name
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG or PNG"), false);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
