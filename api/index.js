nano api/index.js

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Läs kunskapsbasen
const knowledgeBasePath = path.join(__dirname, "../public/blenco_knowledge_base.md");
const KNOWLEDGE_BASE = fs.readFileSync(knowledgeBasePath, "utf-8");

const client = new Anthropic();

const SYSTEM_PROMPT = `Du är en kundsupportagent för Blenco AB (Blenco Speedshop), en performance-motorsverkstad i Stockholm.

DIN ROLL:
- Du svarar på frågor om frakt, returer, villkor, workshop och produkter
- Du är vänlig, klar och hjälpsam
- Du ger korta, konkreta svar
- Du gör ALDRIG något upp

VIKTIGA REGLER:
1. SVARA ENDAST utifrån kunskapsbasen nedan. Hittar du inte svar där, säg "Jag vet inte, mejla info@blenco.se"
2. VÄGRA att ge tekniska råd om:
   - Motorbygge, tuning, hk-förluster
   - Maskinbearbetning (honing, borrning, reparation)
   - Diagnostik (varför motor maler, dålig kompression)
   - Speciallösningar eller custom-byggen
   - Priser på verkstadstjänster
   
   Svara då: "Det här kräver en teknisk bedömning. Mejla info@blenco.se"

3. ALDRIG:
   - Emojis eller humor
   - Länge svar
   - Hittat på information
   - Telefonummer (om inte de explicit frågar)

TONE: Varmt, klart, kort, konkret, professionellt.

KUNSKAPSBAS:
${KNOWLEDGE_BASE}`;

export default async function handler(req, res) {
  // Tillåt CORS
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
      return res.status(400).json({ error: "No question provided" });
    }

    console.log(`Question: "${question}"`);

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = message.content[0].type === "text" ? message.content[0].text : "Något gick fel. Mejla info@blenco.se";

    return res.status(200).json({
      answer: answer,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      answer: "Ett fel uppstod. Försök igen senare eller mejla info@blenco.se",
    });
  }
}
