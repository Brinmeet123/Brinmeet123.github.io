# Virtual Diagnostic Simulator

A Next.js-based medical training simulator that allows students to practice clinical reasoning by interviewing AI patients, performing examinations, ordering tests, and making diagnoses in a safe, fictional environment.

## Features

- **AI-Powered Patient Interactions**: Chat with AI patients that respond naturally to your questions
- **Physical Examination**: Review different body systems and gather findings
- **Diagnostic Testing**: Order tests and view results
- **Clinical Reasoning Practice**: Formulate differential diagnoses and receive detailed feedback
- **Educational Assessment**: Get comprehensive feedback on your performance

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Ollama (local LLM - no API key needed!)
- **Deployment**: Ready for Vercel or similar platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Ollama installed and running locally

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

5. (Optional) Create a `.env.local` file to customize Ollama settings:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- If you see "Cannot connect to Ollama": Make sure Ollama is running with `ollama serve`
- If you see "model not found": Pull the model with `ollama pull llama3` (or your chosen model)
- If you see connection errors: Check that Ollama is running on `http://localhost:11434`

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

## Important Disclaimer

**This website is for educational purposes only. All patients and scenarios are fictional. The site does not provide medical advice, diagnosis, or treatment. If you have health concerns, please see a licensed healthcare professional.**

## License

This project is for educational use only.

