# Deployment Guide

This guide covers deploying the Virtual Diagnostic Simulator using GitHub Actions.

## Prerequisites

- GitHub repository set up
- Node.js 20+ installed locally (for testing)
- Ollama running locally (for development)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Setup Steps:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Get Vercel Credentials**
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token
   - Go to your project settings to get:
     - Organization ID
     - Project ID

3. **Add GitHub Secrets**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your organization ID
     - `VERCEL_PROJECT_ID`: Your project ID

4. **Deploy**
   - Push to `main` or `master` branch
   - The workflow will automatically deploy

#### Environment Variables in Vercel:

Add these in Vercel Dashboard → Project Settings → Environment Variables:
- `OLLAMA_URL`: Your Ollama server URL (if using remote Ollama)
- `OLLAMA_MODEL`: Model name (default: llama3)

**Note**: For production, you'll need to set up Ollama on a server or use a cloud service.

### Option 2: Docker Deployment

Deploy using Docker containers.

#### Setup Steps:

1. **Get Docker Hub Credentials**
   - Create account at [hub.docker.com](https://hub.docker.com)
   - Create an access token

2. **Add GitHub Secrets**
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

3. **Deploy**
   - Push to `main`/`master` or create a version tag (e.g., `v1.0.0`)
   - Workflow will build and push Docker image

4. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e OLLAMA_URL=http://your-ollama-server:11434 \
     -e OLLAMA_MODEL=llama3 \
     your-username/virtual-diagnostic-simulator
   ```

### Option 3: Static Site (GitHub Pages)

For static export (limited functionality - no API routes).

#### Setup Steps:

1. **Configure Next.js for Static Export**
   - Update `next.config.js` to include `output: 'export'`
   - Note: This disables API routes, so Ollama features won't work

2. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Select source: GitHub Actions

3. **Deploy**
   - Push to `main`/`master`
   - Workflow will deploy to GitHub Pages

## Environment Variables

### Required for Production

- `OLLAMA_URL`: URL of your Ollama server (e.g., `http://your-server:11434`)
- `OLLAMA_MODEL`: Model name (e.g., `llama3`, `mistral`)

### Optional

- `NODE_ENV`: Set to `production` for production builds
- `NEXT_PUBLIC_*`: Any public environment variables

## CI/CD Workflows

### Continuous Integration (`ci.yml`)
- Runs on every push/PR
- Lints code
- Type checks
- Builds application
- Ensures code quality before merge

### Test Workflow (`test.yml`)
- Runs tests and validations
- Ensures build succeeds

### Deployment Workflows
- `deploy-vercel.yml`: Production deployments
- `deploy-preview.yml`: PR preview deployments
- `deploy-static.yml`: Static site deployments
- `docker-build.yml`: Docker image builds

## Local Testing

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build

# Start production server
npm start
```

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Ensure all dependencies are installed
- Check for TypeScript errors

### Deployment Fails
- Verify secrets are set correctly
- Check workflow logs in GitHub Actions
- Ensure environment variables are set

### Ollama Connection Issues
- Ensure Ollama is running and accessible
- Check `OLLAMA_URL` environment variable
- Verify model is pulled: `ollama pull llama3`

## Production Considerations

1. **Ollama Server**: For production, you'll need Ollama running on a server
   - Consider using a VPS or cloud instance
   - Or use a managed Ollama service

2. **Environment Variables**: Set all required variables in your deployment platform

3. **Security**: Never commit API keys or secrets to the repository

4. **Performance**: Consider:
   - Enabling Next.js caching
   - Using a CDN for static assets
   - Optimizing images

## Support

For issues or questions:
- Check GitHub Actions logs
- Review workflow files in `.github/workflows/`
- Consult Next.js deployment documentation

