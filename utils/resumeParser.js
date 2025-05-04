const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text || "";
}

async function extractTextFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

module.exports = {
  extractTextFromPDF,
  extractTextFromDocx,
};
