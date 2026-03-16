# Virtual Diagnostic Simulator

A Next.js-based medical training simulator that allows students to practice clinical reasoning by interviewing AI patients, performing examinations, ordering tests, and making diagnoses in a safe, fictional environment.

## Features

- **AI-Powered Patient Interactions**: Chat with AI patients that respond naturally to your questions
- **Physical Examination**: Review different body systems and gather findings
- **Diagnostic Testing**: Order tests and view results
- **Clinical Reasoning Practice**: Formulate differential diagnoses and receive detailed feedback
- **Educational Assessment**: Get comprehensive feedback on your performance
- **Demo Mode**: Run without Ollama using realistic mock responses for public deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Ollama (local LLM - no API key needed!)
- **Deployment**: Ready for Vercel or similar platforms

## Live Demo

🚀 **[Try the Live Demo](https://brinmeet123.github.io/)** (coming soon)

The hosted demo uses **Demo Mode** with realistic mock responses, so it works without requiring Ollama. For the full AI-powered experience with dynamic patient responses, run the app locally with Ollama.

---

## Getting Started

### Prerequisites

- **Node.js 20+** and npm 9+ (specified in `package.json` engines)
- Ollama installed and running locally (optional - see Demo Mode below)

### Installation

1. Install Ollama (if not already installed):
   - Visit https://ollama.ai and download for your OS
   - Or install via: `curl -fsSL https://ollama.ai/install.sh | sh`

2. Pull the model you want to use:
```bash
ollama pull llama3
# or any other model like: ollama pull mistral, ollama pull llama2, etc.
```

3. Start Ollama (if not already running):
```bash
ollama serve
```

4. Install dependencies:
```bash
npm install
```

5. (Optional) Create a `.env.local` file to customize settings:
```env
# For Ollama (local AI mode)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# For Demo Mode (works without Ollama - use for public deployment)
DEMO_MODE=true
```

> **Environment Variables Reference:**
> - `DEMO_MODE` (optional): Set to `true` to use mock responses without Ollama. Required for public deployment.
> - `OLLAMA_URL` (optional): Ollama API URL. Default: `http://localhost:11434`
> - `OLLAMA_MODEL` (optional): Ollama model name. Default: `llama3`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Mode vs Local Mode

**Demo Mode** (`DEMO_MODE=true`):
- ✅ Works without Ollama - perfect for public deployment
- ✅ Uses realistic mock responses for patient interactions
- ✅ All UI features work (history, exam, tests, diagnosis, debrief)
- ⚠️ Responses are pre-generated, not dynamically AI-powered
- 📝 **Use this for**: GitHub Pages, Vercel public deployments, demos

**Local Mode** (default, requires Ollama):
- ✅ Full AI-powered patient interactions using Ollama
- ✅ Dynamic, contextual responses based on scenario instructions
- ✅ AI-generated educational assessments
- ⚠️ Requires Ollama running locally
- 📝 **Use this for**: Local development, learning, full AI experience

### Testing Ollama Connection

**Option 1: Using the test endpoint (recommended)**
1. Make sure Ollama is running (`ollama serve`)
2. Make sure your dev server is running (`npm run dev`)
3. Open your browser and go to: [http://localhost:3000/api/test-key](http://localhost:3000/api/test-key)
4. You should see a JSON response with `"success": true` if Ollama is working

**Option 2: Using curl in terminal**
```bash
curl http://localhost:3000/api/test-key
```

**Option 3: Test directly in a scenario**
1. Go to [http://localhost:3000/scenarios](http://localhost:3000/scenarios)
2. Click on a scenario
3. Try asking the patient a question in the chat
4. If you get an error, check that Ollama is running

**Common Issues:**
- If you see "Cannot connect to Ollama": 
  - Make sure Ollama is running with `ollama serve`, OR
  - Set `DEMO_MODE=true` in `.env.local` to use mock responses
- If you see "model not found": Pull the model with `ollama pull llama3` (or your chosen model)
- If you see connection errors: Check that Ollama is running on `http://localhost:11434`, or enable Demo Mode

## Project Structure

```
project-root/
  app/
    layout.tsx              # Root layout with Navbar and Footer
    page.tsx                # Landing page
    about/
      page.tsx              # About page with disclaimer
    scenarios/
      page.tsx              # Scenario list
      [id]/
        page.tsx            # Scenario player
    api/
      patient-chat/
        route.ts            # POST: AI responds as patient
      assess/
        route.ts            # POST: AI assessment
  components/
    Navbar.tsx
    Footer.tsx
    ScenarioCard.tsx
    ScenarioList.tsx
    ScenarioPlayer.tsx
    DoctorPatientScene.tsx
    ChatPanel.tsx
    PhysicalExamPanel.tsx
    TestsPanel.tsx
    DiagnosisPanel.tsx
    SummaryPanel.tsx
  data/
    scenarios.ts            # Scenario data and types
  styles/
    globals.css
```

## Adding New Scenarios

Edit `data/scenarios.ts` and add new scenario objects to the `scenarios` array. Each scenario includes:

- Patient persona and background
- AI instructions for patient behavior
- Physical exam findings
- Available diagnostic tests
- Diagnosis options
- Teaching points

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy with Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Brinmeet123/Brinmeet123.github.io&env=DEMO_MODE&envDescription=Set%20to%20true%20to%20use%20mock%20responses%20without%20Ollama&envLink=https://github.com/Brinmeet123/Brinmeet123.github.io%23environment-variables)

**One-Click Deploy:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub repository
3. Configure environment variables (see below)
4. Deploy!

**Manual Vercel Setup:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Set environment variables in Vercel dashboard

**Required Environment Variables for Vercel:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEMO_MODE` | **Yes** (for public) | `false` | Set to `true` to use mock responses (no Ollama needed) |
| `OLLAMA_URL` | No | `http://localhost:11434` | Ollama API URL (only if not using DEMO_MODE) |
| `OLLAMA_MODEL` | No | `llama3` | Ollama model name (only if not using DEMO_MODE) |

**Recommended Vercel Settings:**
- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)
- **Node.js Version:** 20.x (specified in package.json)

**For Public Deployment:**
```env
DEMO_MODE=true
```

**For Full AI Mode (requires Ollama accessible from Vercel):**
```env
DEMO_MODE=false
OLLAMA_URL=https://your-ollama-instance.com
OLLAMA_MODEL=llama3
```

> ⚠️ **Note:** Ollama typically runs locally. For Vercel deployment, use `DEMO_MODE=true` unless you have a remote Ollama instance accessible from the internet.

### Other Deployment Options

This project includes GitHub Actions workflows for automated deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

1. **Docker**: 
   - Use the included Dockerfile and GitHub Actions workflow
   - Set `DEMO_MODE=true` environment variable in Docker for public deployment

2. **Static Export**: 
   - Deploy as a static site (note: API routes won't work)
   - Good for GitHub Pages, but limited functionality
   - Set `NEXT_OUTPUT=export` environment variable

**⚠️ Important for Public Deployment:**
- Set `DEMO_MODE=true` environment variable to enable mock responses
- This allows the app to work without Ollama in production
- The hosted demo uses Demo Mode so it works publicly without requiring users to install Ollama

### GitHub Actions Workflows:

- `ci.yml`: Continuous Integration (lint, type check, build)
- `deploy-vercel.yml`: Deploy to Vercel production
- `deploy-preview.yml`: Preview deployments for PRs
- `docker-build.yml`: Build and push Docker images
- `test.yml`: Run tests and validations

See `.github/workflows/README.md` for more details.

## Important Disclaimer

**This website is for educational purposes only. All patients and scenarios are fictional. The site does not provide medical advice, diagnosis, or treatment. If you have health concerns, please see a licensed healthcare professional.**

## License

This project is for educational use only.

