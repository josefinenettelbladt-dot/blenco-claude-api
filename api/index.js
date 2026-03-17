import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let KNOWLEDGE_BASE = "";
try {
  const kbPath = path.join(__dirname, "../public/blenco_knowledge_base.md");
  KNOWLEDGE_BASE = fs.readFileSync(kbPath, "utf-8");
} catch (e) {
  console.error("Knowledge base error:", e.message);
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
      max_tokens: 800,
      system: `Du är Blencos kundsupport. Svara ENDAST från kunskapsbasen nedan. Kort och hjälpsamt. KUNSKAPSBAS:\n${KNOWLEDGE_BASE}`,
      messages: [{ role: "user", content: question }]
    });

    const answer = msg.content[0].type === "text" ? msg.content[0].text : "Error";
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ answer: "Ett fel uppstod." });
  }
}
