# Blenco AB - Claude RAG API för Voiceflow

Detta är en Node.js-backend som integrerar Claude AI med Voiceflow. Den söker i Blencos kunskapsbas och svarar intelligenta svar på kundfrågorna.

---

## 🚀 SNABBSTART (5 MINUTER)

### STEG 1: Förbered på GitHub

1. Skapa en ny mapp lokalt:
   ```bash
   mkdir blenco-claude-api
   cd blenco-claude-api
   ```

2. Kopiera dessa filer in i mappen:
   - `api/blenco_api.js`
   - `package.json`
   - `.env.example` (döp om till `.env.local`)
   - `public/blenco_knowledge_base.md`

3. Skapa en Git-repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. Push till GitHub:
   - Gå till github.com, skapa ett nytt repo "blenco-claude-api"
   - Kopiera push-kommandona och kör dem

---

### STEG 2: Deploy på Vercel (Easiest way!)

1. **Gå till Vercel.com**
   - Logga in med GitHub-konto

2. **Klicka "New Project"**

3. **Välj ditt GitHub-repo "blenco-claude-api"**

4. **Vercel ber om Environment Variables - LÄGG IN DESSA:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxx...` (Din Claude API-nyckel)

5. **Klicka "Deploy"**

6. **VÄNTA!** Vercel deployer din kod. Efter ~1 minut får du en URL som ser ut så här:
   ```
   https://blenco-claude-api.vercel.app
   ```

   **SPARA DENNA URL!** Du behöver den för Voiceflow.

---

### STEG 3: Testa API:et

Öppna Postman eller använd curl för att testa:

```bash
curl -X POST https://blenco-claude-api.vercel.app/api/blenco_api \
  -H "Content-Type: application/json" \
  -d '{"question": "Vilka länder skickar ni till?"}'
```

Du bör få svar från Claude!

---

### STEG 4: Koppla Voiceflow till API:et

I Voiceflow:

1. **Skapa ett nytt block:** "Call Custom Code" eller "Webhook"

2. **Sätt URL:**
   ```
   https://blenco-claude-api.vercel.app/api/blenco_api
   ```

3. **Metod:** POST

4. **Headers:**
   ```
   Content-Type: application/json
   ```

5. **Body (request):**
   ```json
   {
     "question": "{{ user.message }}"
   }
   ```

6. **Response (spara svaret):**
   ```
   {{ response.body.answer }}
   ```

7. **Testa!** Ställ en fråga i Voiceflow - Claude ska söka och svara!

---

## 📋 FILSTRUKTUR

```
blenco-claude-api/
├── api/
│   └── blenco_api.js           ← Huvudkoden (Claude + RAG)
├── public/
│   └── blenco_knowledge_base.md ← Din kunskapsbas
├── package.json                 ← Vilka bibliotek som behövs
├── .env.example                 ← Miljövariabel-template
└── README.md                    ← Du läser denna nu!
```

---

## 🔑 VAR LÄGGER JAG MIN CLAUDE API-NYCKEL?

### Lokalt (för testning):
1. Döp `.env.example` till `.env.local`
2. Fyll i din nyckel:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx...
   ```

### På Vercel (för produktion - REKOMMENDERAT):
1. Gå till Vercel Project Settings
2. Gå till "Environment Variables"
3. Lägg till:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxx...`
4. Klicka "Save"

**VIKTIGT:** Din API-nyckel sparas aldrig i kod! Vercel hanterar den säkert.

---

## ❓ VANLIGA FRÅGOR

**F: Kostar det något?**
S: Nej! Vercel är gratis för denna användning. Claude API kostar pengar, men det är billigt (några kronor per månad för denna chatbot).

**F: Hur ofta uppdateras kunskapsbasen?**
S: Du uppdaterar `public/blenco_knowledge_base.md` lokalt, committar till GitHub, och Vercel deployer automatiskt (eller du clicker "Redeploy").

**F: Vad om något går fel?**
S: Kontrollera Vercels logs:
- Gå till Vercel Dashboard
- Klicka på ditt projekt
- Gå till "Deployments" och sen "Logs"

**F: Kan jag ändra systemprompten?**
S: Ja! Redigera `SYSTEM_PROMPT` i `api/blenco_api.js` och deploy igen.

---

## 🛠️ TEKNING

- **Voiceflow** = Gränssnitt (chat-appen)
- **Vercel** = Server (var din kod kör)
- **Claude API** = AI-motorn (söker och svarar)
- **blenco_knowledge_base.md** = Din information

---

## 📞 SUPPORT

Om något inte funkar:
1. Kontrollera Vercel logs
2. Verifiera att Claude API-nyckeln är korrekt inställd
3. Testa API:et med curl-kommandot ovan
4. Mejla info@blenco.se eller kontakta din utvecklare

---

**Lycka till med din Blenco chatbot!** 🚀
