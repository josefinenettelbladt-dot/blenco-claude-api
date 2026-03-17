import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let KB = "Kunskapsbasen kunde inte läsas.";
try {
  const kbPath = path.join(__dirname, "../public/blenco_knowledge_base.md");
  const data = fs.readFileSync(kbPath, "utf-8");
  KB = data.substring(0, 5000);
} catch (e) {
  console.error("KB error:", e.message);
}

const client = new Anthropic();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "No question" });
    }

    const msg = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 600,
      system: `Du är Blencos kundsupport. Svara FRÅN kunskapsbasen:\n${KB}`,
      messages: [{ role: "user", content: question }]
    });

    const answer = msg.content[0].type === "text" ? msg.content[0].text : "Error";
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("API Error:", error.message);
    return res.status(500).json({ answer: `Error: ${error.message}` });
  }
}
