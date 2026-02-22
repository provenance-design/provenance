# Provenance — Complete Build Guide

Everything you need to go from nothing to a live site with 200+ entries.

There are two things you've downloaded:
- **provenance-site** — the website itself (Next.js project)
- **provenance-pipeline** — the content generator (Python scripts)

They live in separate folders. The pipeline generates entries, you paste them into the site.

---

## PHASE 1: Get the site running locally

### Step 1: Install Node.js

You need Node.js to run the website. Check if you already have it:

```
node --version
```

If that gives you a version number (v18 or higher), skip ahead. If not:
- Go to https://nodejs.org
- Download the LTS version (green button)
- Install it (just click through the defaults)

### Step 2: Set up the site folder

Put the `provenance-site` folder somewhere sensible on your machine. Your Desktop is fine for now:

```
~/Desktop/provenance-site/
```

### Step 3: Install dependencies

Open Terminal (Mac) or Command Prompt (Windows). Navigate to the folder:

```bash
cd ~/Desktop/provenance-site
npm install
```

This downloads React, Next.js, etc. Takes about 30 seconds. You'll see a `node_modules` folder appear — that's normal, don't touch it.

### Step 4: Run it locally

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`

You should see Provenance with the 16 seed entries. Click around. Check the connections work. This is your site running on your own machine.

Press `Ctrl + C` in the terminal to stop it.

---

## PHASE 2: Deploy to the internet (free)

### Step 5: Create a GitHub account (if you don't have one)

Go to https://github.com and sign up. Free.

### Step 6: Install Git

Check if you have it:
```
git --version
```

If not:
- **Mac**: Open Terminal and type `xcode-select --install`
- **Windows**: Download from https://git-scm.com

### Step 7: Create a GitHub repository

1. Go to https://github.com/new
2. Name it `provenance` (or whatever you want)
3. Keep it **Public** (Vercel free tier needs this, or use Private with a Vercel account)
4. Don't tick any of the checkboxes (no README, no .gitignore — we have our own)
5. Click "Create repository"

### Step 8: Push your site to GitHub

In Terminal, from inside the `provenance-site` folder:

```bash
git init
git add .
git commit -m "initial provenance site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/provenance.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Step 9: Deploy on Vercel

1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Import your `provenance` repository from GitHub
4. Leave all settings as defaults — Vercel auto-detects Next.js
5. Click "Deploy"

Wait about 60 seconds. Vercel gives you a URL like `provenance-abc123.vercel.app`.

**That's it. Your site is live.**

Every time you push changes to GitHub, Vercel automatically rebuilds and redeploys.

### Step 10 (optional): Custom domain

If you want `provenance.yourdomain.com`:
1. In Vercel dashboard → your project → Settings → Domains
2. Add your domain
3. Vercel tells you what DNS records to add
4. Update your DNS (at your domain registrar)
5. Wait 5–30 minutes for propagation

---

## PHASE 3: Generate content with the pipeline

### Step 11: Install Python dependencies

You need Python 3.8+. Check:
```
python3 --version
```

If not installed: https://www.python.org/downloads/

Put the `provenance-pipeline` folder next to your site folder:
```
~/Desktop/provenance-site/        ← the website
~/Desktop/provenance-pipeline/    ← the content generator
```

Install the Python packages:
```bash
cd ~/Desktop/provenance-pipeline
pip install anthropic requests python-dotenv rich
```

### Step 12: Get your API keys

**Anthropic API key** (for Claude to write entries):
1. Go to https://console.anthropic.com
2. Create an account
3. Add credit ($5 is plenty for 200+ entries)
4. Go to API Keys → Create Key
5. Copy the key (starts with `sk-ant-`)

**Cooper Hewitt access token** (for searching their collection):
1. Go to https://collection.cooperhewitt.org/api/
2. Register for an account
3. Create an "application" (just give it a name like "Provenance")
4. Copy your access token

### Step 13: Configure the pipeline

```bash
cd ~/Desktop/provenance-pipeline
cp .env.example .env
```

Open `.env` in any text editor and paste in your keys:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
COOPERHEWITT_TOKEN=your-token-here
```

Save the file.

### Step 14: Search for objects

```bash
python pipeline.py search "Charles Eames"
```

This queries both Cooper Hewitt and V&A, shows you what it finds. You select which objects to keep. Try a few searches:

```bash
python pipeline.py search "Alvar Aalto"
python pipeline.py search "Ray Eames"
python pipeline.py search "Isamu Noguchi"
python pipeline.py search "Memphis Group" --source vam
python pipeline.py search "Bauhaus" --limit 10
```

Selected objects are saved to `output/search_results.json`.

### Step 15: Generate entries

```bash
python pipeline.py generate
```

This sends each object's metadata to Claude, which writes the description, significance, connections, and keywords in Provenance's curatorial voice. It knows about the 16 seed entries and argues connections between new and existing objects.

Takes about 2–3 seconds per entry. You'll see a cost estimate before it starts.

Generated entries go to `output/generated_entries.json`.

### Step 16: Review entries

```bash
python pipeline.py review
```

This shows you each entry one at a time. For each one:
- **[a] Accept** — looks good, keep it
- **[e] Edit** — change a field (wrong discipline, weak significance, etc.)
- **[r] Reject** — skip it
- **[g] Regenerate** — send back to Claude with notes ("make the connections sharper")

Approved entries go to `output/reviewed_entries.json`.

### Step 17: Export and add to the site

```bash
python pipeline.py export
```

This creates `output/archive_data.jsx`. Open that file — it's a JavaScript array of entries.

Now open `provenance-site/app/data/archive.js` and paste the new entries at the bottom of the ARCHIVE array, where the comment says:

```javascript
// NEW ENTRIES — paste pipeline output below this line
```

### Step 18: Push to deploy

```bash
cd ~/Desktop/provenance-site
git add .
git commit -m "add 20 new entries"
git push
```

Vercel automatically rebuilds. Your live site updates within 60 seconds.

---

## PHASE 4: Growing the archive

Repeat Steps 14–18 as many times as you want. Each batch:

1. Search for new designers/movements
2. Generate entries (Claude argues connections to everything already in the archive)
3. Review and approve
4. Paste into the site data file
5. Push to GitHub → auto-deploys

The more entries you add, the richer the connection network becomes. Claude sees the full archive each time and argues new lateral connections.

### Suggested search strategy

Build outward from the seed entries. The 16 seeds cluster around Italian design, German functionalism, and British graphics. Next batches might be:

**Scandinavian modernism**: Aalto, Jacobsen, Wegner, Panton
**American mid-century**: Eames, Noguchi, Girard, Saarinen
**Japanese design**: Yanagi, Isozaki, Kuramata, Muji
**British postwar**: Race, Day, Conran, Hepworth
**Contemporary**: Hadid, Ive, Starck (expanded), Bouroullec, Grcic
**Graphic/Typography**: Müller-Brockmann, Crouwel, Carson, Emigre, Sagmeister
**Architecture**: Mies, Corbusier, Kahn, Ando, Chipperfield

Each search costs nothing. Only generation costs money (about 1–2p per entry).

---

## Quick reference

| What | Where |
|------|-------|
| Site folder | `~/Desktop/provenance-site/` |
| Pipeline folder | `~/Desktop/provenance-pipeline/` |
| Entry data file | `provenance-site/app/data/archive.js` |
| Pipeline output | `provenance-pipeline/output/archive_data.jsx` |
| Run site locally | `cd provenance-site && npm run dev` |
| Deploy changes | `cd provenance-site && git add . && git commit -m "msg" && git push` |
| Search objects | `cd provenance-pipeline && python pipeline.py search "query"` |
| Generate entries | `cd provenance-pipeline && python pipeline.py generate` |
| Review entries | `cd provenance-pipeline && python pipeline.py review` |
| Export to site | `cd provenance-pipeline && python pipeline.py export` |

---

## Costs

| Item | Cost |
|------|------|
| Vercel hosting | Free (hobby tier) |
| GitHub | Free |
| Cooper Hewitt API | Free |
| V&A API | Free |
| Wikipedia images | Free |
| Node.js / Python | Free |
| Anthropic API (one-off) | ~£3–5 for 200 entries |
| Custom domain (optional) | ~£10/year |

**Total ongoing cost: £0**
