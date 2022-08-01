const multer = require("multer");
const moment = require("moment");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../import_export_database`);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `import-database-${moment().format('YYYY-MM-DD_hh.mm')}`);
  },
});

let uploadFile = multer({storage: storage, fileFilter: excelFilter});
module.exports = uploadFile;
