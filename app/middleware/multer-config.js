//on importe multer pour facilité la gestion de requête http vers notre API
const multer = require("multer");

//le dictionnaire des mime types
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//on crée un objet de configuration pour multer
//on utilise une fonction de multer qui s'appel diskStorage
const storage = multer.diskStorage({
  //la destination explique a multer on enregistrer le fichier
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //explique a multer quel nom de fichier utilisé afin d'avoir un fichier unique
  filename: (req, file, callback) => {
    //on crée son nom avant l'extension
    //on supprime les espaces possible dans les noms de fichier avec la méthode split
    //qui remplace les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    //on applique une extension au fichier
    //le mime_type: jpg, jpeg, png
    //on crée une extension qui reprends notre dictionnaire
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//verify extension name
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG or PNG"), false);
  }
};

//on exporte notre middleware multer complètement configurer
//on appel la méthode multer, a laquelle on passe notre objet storage, on applique la méthode single pour dire que c'est des fichiers unique
//et on explique a multer qu'il s'agit de fichier image uniquement
module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);
