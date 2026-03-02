const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const doc = new PDFDocument({ margin: 50, size: "A4" });
const outputPath = path.join(__dirname, "..", "public", "resume.pdf");
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const dark = "#1a1a1a";
const gray = "#4a4a4a";
const lightGray = "#6b6b6b";
const accent = "#3b82f6";

// Helper for section titles
function sectionTitle(text) {
  doc.fontSize(12).fillColor(accent).font("Helvetica-Bold").text(text, { continued: false });
  doc.moveDown(0.3);
}

// Header
doc.fontSize(28).fillColor(dark).font("Helvetica-Bold").text("Ahed Al-Khalaf", { align: "center" });
doc.fontSize(12).fillColor(gray).font("Helvetica").text("Junior Software Engineer | Damascus, Syria", { align: "center" });
doc.moveDown(0.5);

// Contact
doc.fontSize(10).fillColor(lightGray).font("Helvetica").text("reach.ahed@gmail.com  |  linkedin.com/in/ahddev  |  github.com/ahddev", { align: "center" });
doc.moveDown(1.5);

// Summary
sectionTitle("SUMMARY");
doc.fontSize(10).fillColor(gray).font("Helvetica").text(
  "Junior software engineer with 12+ months of experience building real-world web applications with React and Next.js. Shipped 3 production projects used by actual users and businesses. Passionate about clean code, modern UI/UX, and continuous learning. Next goal: build larger-scale applications and join a professional team.",
  { align: "justify", lineGap: 2 }
);
doc.moveDown(1);

// Skills
sectionTitle("SKILLS");
doc.fontSize(10).fillColor(gray).font("Helvetica").text(
  "React • Next.js • TypeScript • Tailwind CSS • Node.js • Supabase • Git • Vercel • shadcn/ui • GSAP",
  { align: "left" }
);
doc.moveDown(1);

// Projects
sectionTitle("PROJECTS");

const projects = [
  {
    name: "NQSH",
    desc: "3D printing shop website — live at nqsh-3d.com",
  },
  {
    name: "Labak",
    desc: "Free delivery dental tools store for dentists — live at labak-sy.com",
  },
  {
    name: "Razio Store",
    desc: "Laptop catalog website — archived at razio.store",
  },
];

projects.forEach((p) => {
  doc.fontSize(10).fillColor(dark).font("Helvetica-Bold").text(p.name);
  doc.fontSize(10).fillColor(gray).font("Helvetica").text(p.desc, { indent: 10 });
  doc.moveDown(0.5);
});

doc.moveDown(0.5);

// Tech & Tools
sectionTitle("TECH & TOOLS");
doc.fontSize(10).fillColor(gray).font("Helvetica").text(
  "React & Next.js • Vercel deployment • Supabase Backend-as-a-Service • Tailwind CSS v4 & shadcn/ui • GSAP animations • Modern UI/UX design principles",
  { align: "justify", lineGap: 2 }
);

doc.end();

stream.on("finish", () => {
  console.log(`Resume saved to ${outputPath}`);
});
