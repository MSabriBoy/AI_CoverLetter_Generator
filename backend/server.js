import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

console.log(process.env.GEMINI_API_KEY ? "KEY LOADED" : "NO KEY");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Root route serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/api/generate", async (req, res) => {
  const { name, role, company, skills } = req.body;

 const prompt = `
Write a complete, polished, ready-to-send professional cover letter.

Rules:
- Do NOT include any placeholders like [Your Name], [Date], [Address], [Portfolio], etc.
- Do NOT include header sections.
- Do NOT ask the user to edit anything.
- Output final copy-paste ready text only.
- Keep it professional, confident, concise.

Candidate Name: ${name}
Job Role: ${role}
Company Name: ${company}
Key Skills: ${skills.join(", ")}

End with the candidate name as signature.
`;

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );
if (!response.ok) {
  const errText = await response.text();
  console.error("Gemini HTTP Error:", response.status);
  console.error(errText);
  return res.status(500).json({ error: "Gemini API request failed" });
}


    const data = await response.json();
console.log("RAW GEMINI RESPONSE:");
console.log(JSON.stringify(data, null, 2));
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ coverLetter: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
