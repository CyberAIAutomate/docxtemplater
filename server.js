const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
const upload = multer({ dest: "uploads/" });

app.post("/generate", (req, res) => {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, "template.docx"), "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(req.body);
    const buf = doc.toBuffer();
    res.setHeader("Content-Disposition", "attachment; filename=output.docx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Docx API on port ${PORT}`));
