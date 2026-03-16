// Blenco AB - Claude RAG API för Voiceflow
// Denna kod tog emot frågor från Voiceflow, söker i kunskapsbasen via Claude, och returnerar svar

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Läs kunskapsbasen från fil
const knowledgeBasePath = path.join(process.cwd(), "public", "blenco_knowledge_base.md");
const KNOWLEDGE_BASE = fs.readFileSync(knowledgeBasePath, "utf-8");

// Initiera Anthropic-klienten
const client = new Anthropic();

// SYSTEMMEDDELANDE - Detta styr hur Claude beter sig
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

// Exportera en async funktion för Vercel
export default async function handler(req, res) {
  // Bara POST tillåtet
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Hämta frågan från Voiceflow
    const { question, user_id } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    console.log(`[${new Date().toISOString()}] Fråga från Voiceflow: "${question}"`);

    // Skicka fråga till Claude med kunskapsbasen
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

    // Extrahera svaret
    const answer = message.content[0].type === "text" ? message.content[0].text : "Något gick fel. Mejla info@blenco.se";

    console.log(`[${new Date().toISOString()}] Svar från Claude: "${answer.substring(0, 100)}..."`);

    // Returnera svaret till Voiceflow
    return res.status(200).json({
      answer: answer,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: error.message || "Something went wrong",
      answer: "Ett fel uppstod. Försök igen senare eller mejla info@blenco.se",
    });
  }
}
