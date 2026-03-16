# 🚀 BLENCO CLAUDE API - SNABB SETUP GUIDE

## VETA MED DIG
Din Claude API-nyckel: `sk-ant-xxxxx...` (Du sa att du redan har den!)

---

## STEG 1: LADDA NED FILERNA
Från Claude, ladda ner dessa filer:
- `README.md` ← Läs denna först!
- `api/blenco_api.js` ← Huvudkoden
- `package.json` ← Bibliotek
- `.env.example` ← Mall för miljövariabler
- `public/blenco_knowledge_base.md` ← Din kunskapsbas

Skapa denna mappstruktur lokalt:
```
blenco-claude-api/
├── api/
│   └── blenco_api.js
├── public/
│   └── blenco_knowledge_base.md
├── package.json
├── .env.example
└── README.md
```

---

## STEG 2: SKAPA GITHUB-REPO

1. Gå till **github.com**
2. Klicka **"New repository"**
3. Namn: `blenco-claude-api`
4. Välj **"Public"** (enklare för Vercel)
5. Klicka **"Create repository"**
6. Följ instruktionerna för att push:a dina filer

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-USERNAME/blenco-claude-api.git
git push -u origin main
```

---

## STEG 3: DEPLOY PÅ VERCEL ⭐

### 3a. Logga in på Vercel
1. Gå till **vercel.com**
2. Klicka **"Sign Up"** eller **"Log In"**
3. Välj **"Continue with GitHub"**

### 3b. Importera projekt
1. Klicka **"New Project"**
2. Hitta ditt GitHub-repo `blenco-claude-api`
3. Klicka **"Import"**

### 3c. Sätt miljövariabler (VIKTIG!)
1. Du ser en form för "Environment Variables"
2. Lägg till dessa värdena:

   **Name:** `ANTHROPIC_API_KEY`  
   **Value:** `sk-ant-xxxxx...` (Din Claude API-nyckel)

3. Klicka **"Deploy"**

### 3d. Vänta på deployment
- Vercel bygger och deployer
- Efter ~1 minut får du en URL:
  ```
  https://blenco-claude-api.vercel.app
  ```
- **SPARA DENNA URL!** Du behöver den för Voiceflow

---

## STEG 4: TESTA API:ET

Öppna Postman eller kör i Terminal:

```bash
curl -X POST https://blenco-claude-api.vercel.app/api/blenco_api \
  -H "Content-Type: application/json" \
  -d '{"question": "Vilka länder skickar ni till?"}'
```

**Du bör få svar från Claude!**

---

## STEG 5: KOPPLA VOICEFLOW

I din Voiceflow-agent:

1. **Skapa ett nytt block**
   - Välj "Call Custom Code" eller "Webhook"
   - Namn: "Fråga Claude"

2. **Konfiguration:**
   - **URL:** `https://blenco-claude-api.vercel.app/api/blenco_api`
   - **Method:** `POST`
   - **Headers:**
     ```
     Content-Type: application/json
     ```
   - **Body:**
     ```json
     {
       "question": "{{ user.message }}"
     }
     ```

3. **Spara respons:**
   - Säg åt Voiceflow att spara `{{ response.body.answer }}`
   - Visa detta svar till användaren

4. **Testa i Voiceflow!**
   - Ställ en fråga: "Vilka länder skickar ni till?"
   - Claude söker i kunskapsbasen
   - Svaret visas i chatten

---

## ✅ DU ÄR KLAR!

Din Voiceflow-agent använder nu Claude + RAG-sökning automatiskt!

- ✅ Inga manuella snippets behövas
- ✅ Uppdateringar av kunskapsbasen är enkla
- ✅ Claude söker automatiskt i dokumenten
- ✅ ALDRIG hittat på information

---

## 🐛 OM NÅGOT GÅR FEL

### Vercel visar error?
1. Gå till **Vercel Dashboard**
2. Klicka ditt projekt
3. Gå till **"Deployments"**
4. Klicka på senaste deployment
5. Se **"Logs"** för vad som gick fel

### API svarar inte?
1. Kontrollera att `ANTHROPIC_API_KEY` är rätt inställd på Vercel
2. Testa med curl-kommandot ovan
3. Kontrollera att kunskapsbasen är i `public/`

### Voiceflow får inget svar?
1. Verifiera webhook-URL:en är korrekt
2. Kontrollera att `question`-fältet är rätt mappat
3. Testa URL:en manuellt med curl

---

## 📞 BEHÖVER DU HJÄLP?

- **Claude-koden funkar inte?** → Kolla Vercel logs
- **API-nyckeln?** → Gå till https://console.anthropic.com
- **Voiceflow-integration?** → Se steg 5 ovan
- **Annat?** → Mejla info@blenco.se

---

**LYCKA TILL! 🚀**
