# Social Media Agent System

An AI-powered agent system for TikTok influencer marketing and trend research. Built with Next.js, Prisma, and Gemini AI.

## Overview

This project demonstrates a multi-agent system that routes queries to specialized agents:
- **Database Search Agent**: Query influencers by tier, genre, location, and price
- **Trend Research Agent**: Research TikTok trends and content ideas
- **YouTube Video Finder Agent** (Student Challenge): Find YouTube videos on any topic

## Video Walkthrough

[Live Walkthrough Video](https://share.descript.com/view/23ai09Rp381)

## Prerequisites

- Node.js 20.x or higher
- Yarn or npm
- API Keys (see setup below)

## Quick Start

### 1. Clone and Install

```bash
# Install dependencies
yarn install
# or
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following keys:

```env
# Required: Get your Gemini API key
GEMINI_API_KEY=your_gemini_key_here

# Required: Get your SerpAPI key for trend research
SERP_API_KEY=your_serpapi_key_here

# Database URL (shared for students - read-only access)
DATABASE_URL="postgresql://neondb_owner:npg_Rt2Mena8ZVwA@ep-billowing-shape-a4a0p4zw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 3. Get API Keys

#### Gemini API Key (Required)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file as `GEMINI_API_KEY`

**Free Tier**: 60 requests per minute, sufficient for development and testing

#### SerpAPI Key (Required for Trend Research)
1. Go to [SerpAPI](https://serpapi.com/)
2. Sign up for a free account
3. Navigate to your [Dashboard](https://serpapi.com/manage-api-key)
4. Copy your API key and paste it in your `.env` file as `SERP_API_KEY`

**Free Tier**: 100 searches per month

### 4. Database Setup

**Option A: Use Shared Database (Recommended for Workshop)**

The `DATABASE_URL` provided above connects to a pre-seeded database with 1000 influencers.

Simply run:
```bash
npx prisma generate
```

This generates the Prisma Client with TypeScript types. No migration or seed needed!

**Option B: Create Your Own Database**

If you want your own Postgres instance:

1. **Create a Postgres Database** (options):
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - Local Postgres installation

2. **Update DATABASE_URL** in `.env` with your connection string

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Run Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the Database** (creates 1000 influencers):
   ```bash
   npx prisma db seed
   ```

### 5. Run the Development Server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── agents/
│   ├── executeAgent.ts          # Main router agent
│   ├── databaseSearchAgent.ts   # Database queries
│   ├── trendResearchAgent.ts    # Trend research
│   ├── videoFinderAgent.ts      # Student challenge (to implement)
│   └── agentTypes.ts            # Type definitions
├── libs/
│   ├── gemini.ts                # Gemini AI client
│   └── prisma.ts                # Database client
├── actions.ts                   # Server actions
└── page.tsx                     # Main UI

prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Seed script
```

## Using the Agents

### Example Queries

**Database Search**:
- "Find micro influencers in beauty"
- "Show me gaming influencers under $500"
- "I need nano tier influencers in Los Angeles"

**Trend Research**:
- "What are the latest TikTok dance trends?"
- "Trending fitness content ideas"
- "Popular hashtags for beauty campaigns"

## Student Challenge: YouTube Video Finder Agent

See [TODOS.md](./TODOS.md) for a guided challenge to build a new agent.

**What you'll build**: An agent that finds YouTube videos on any topic using SerpAPI and Gemini AI.

## Database Schema

The database includes:
- **1000 Influencers** with metadata (tier, genre, location)
- **5 Tiers**: nano, micro, mid, macro, mega
- **10 Genres**: pop, hiphop, rock, electronic, country, gaming, beauty, fitness, comedy, tech
- **Pricing data** for different content types

### View Database

```bash
# Open Prisma Studio to browse data
npx prisma studio
```

### Update Database Schema

If you make changes to `prisma/schema.prisma`:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration (if using your own DB)
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### "Invalid API Key" errors
- Double-check your `GEMINI_API_KEY` and `SERP_API_KEY` in `.env`
- Ensure there are no quotes around the keys
- Restart the dev server after changing `.env`

### "Can't reach database" errors
- Using shared DB: Check your internet connection
- Using own DB: Verify your `DATABASE_URL` is correct
- Run `npx prisma db push` to sync schema

### "No results found" errors
- Database Search: Make sure database is seeded (`npx prisma db seed`)
- Trend Research: Check SERP_API_KEY is valid
- Check console logs for detailed error messages

### Prisma Client errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

## Learn More

### Building Effective Agents
Read Anthropic's guide on agent design patterns:
[Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

Key concepts covered:
- Workflows vs Agents
- When to use agents
- Prompt engineering for agents
- Structured outputs
- Agent orchestration patterns

### Technology Stack
- [Next.js 16](https://nextjs.org/docs) - React framework
- [Prisma](https://www.prisma.io/docs) - Database ORM
- [Gemini AI](https://ai.google.dev/) - Language model
- [Zod](https://zod.dev/) - Schema validation
- [SerpAPI](https://serpapi.com/docs) - Search results API

## Contributing

This is an educational project. Feel free to:
- Add new agents
- Improve existing agents
- Enhance the UI
- Add more seed data

## License

MIT License - feel free to use this for learning and teaching!

---

## Want to Go Deeper?

If you enjoyed building this agent system and want to take your AI development skills to the next level, check out [Parsity's 30-Day AI Dev Cohort](https://parsity.io/AIDev).

**What you'll learn:**
- RAG (Retrieval-Augmented Generation) agents
- LLM operations and deployment
- Linear algebra fundamentals for ML
- Model fine-tuning techniques

**What you'll get:**
- Live support and office hours
- Build an amazing portfolio project or startup idea
- Learn from experienced AI engineers
- Join a community of web developers leveling up their AI skills

Perfect for web developers who want to become AI engineers.

---

**Built for learning about AI agents**
