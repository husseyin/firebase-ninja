const path = require("path");

// dışarı aktarmayı sağladık ve dosya yollarını tanımladık
// artık yapılan her değişiklik kaydı bundle.js içerisine işlenecek
// değişiklik kaydının tetiklenmesi için package.js içine
// "build":"webpack" komutu eklendi
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
};
