# Social Media Agent System

An AI-powered agent system focused on safe influencer operations with a human-in-the-loop flow for destructive actions. Built with Next.js, Prisma, and Gemini AI.

## Overview

This project demonstrates an agent workflow for influencer management:

- **Database Search Agent**: Query influencers by tier, genre, location, and price
- **Human-in-the-Loop Deletion Flow**: Require explicit user confirmation before deleting influencers

## Video Walkthrough

[Live Walkthrough Video](https://share.descript.com/view/bLyg4DvdgXW)

## Prerequisites

- Node.js 20.x or higher
- Yarn or npm
- API Key (see setup below)

## Quick Start

### Automated Setup (Recommended)

Run the automated setup script:

```bash
./setup-from-scratch.sh
```

This will guide you through the entire setup process. Then verify everything works:

```bash
./verify-setup.sh
```

### Manual Setup

If you prefer to set up manually:

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

# Database URL (uses local SQLite database)
DATABASE_URL="file:./dev.db"
```

### 3. Get API Keys

#### Gemini API Key (Required)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file as `GEMINI_API_KEY`

**Free Tier**: 60 requests per minute, sufficient for development and testing

### 4. Database Setup

This project uses SQLite for a simple, local database setup. No external database service required!

1. **Generate Prisma Client**:

    ```bash
    npx prisma generate
    ```

2. **Create and seed the database** (creates 1000 influencers):
    ```bash
    npx prisma db push
    npx prisma db seed
    ```

That's it! The database file will be created at `prisma/dev.db`.

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

**Destructive Flow (Human-in-the-Loop)**:

- "Delete all micro influencers in Miami"
- "Remove beauty influencers under $200"
- "Clean up gaming influencers in Los Angeles"

## Student Challenge: Human-in-the-Loop Restore

Use the `human-in-loop-agent` version as the final reference implementation and use this repo state as the "needs fixing" starting point.

### The Problem

Right now, users can issue a destructive query and the system can delete influencers immediately. That is unsafe for real production usage.

### Who This Is For

- Developers learning practical AI agent safety patterns
- Teams building internal AI tools with database write actions
- Anyone who wants to add guardrails for destructive operations

### What You'll Build

You will implement a human confirmation step so destructive actions do not execute until a user explicitly approves deletion in the UI.

### Why It Matters

- Prevents accidental data loss
- Makes agent behavior auditable and predictable
- Teaches a core real-world AI safety workflow

### Implementation Guide

Follow the guided restore docs in order:

1. [Step 1: Backend safety behavior](./docs/human-in-loop-restore/01-databaseSearchAgent.md)
2. [Step 2: Frontend confirmation UI](./docs/human-in-loop-restore/02-page-confirmation-ui.md)
3. [Step 3: Manual verification checklist](./docs/human-in-loop-restore/00-order-of-operations.md)

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

- Double-check your `GEMINI_API_KEY` in `.env`
- Ensure there are no quotes around the keys
- Restart the dev server after changing `.env`

### "Can't reach database" errors

- Verify your `DATABASE_URL` in `.env` is set to `"file:./dev.db"`
- Run `npx prisma db push` to create/sync the database
- Make sure the prisma directory exists and is writable
- The database file will be created at `prisma/dev.db`

### "No results found" errors

- Database Search: Make sure database is seeded (`npx prisma db seed`)
- Check console logs for detailed error messages

### Prisma Client errors

```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (warning: deletes all data and reseeds)
npx prisma db push --force-reset
npx prisma db seed
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

### Human-in-the-Loop Pattern References

- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangChain: Human-in-the-loop patterns](https://python.langchain.com/docs/concepts/human_in_the_loop/)

### Technology Stack

- [Next.js 16](https://nextjs.org/docs) - React framework
- [Prisma](https://www.prisma.io/docs) - Database ORM
- [Gemini AI](https://ai.google.dev/) - Language model
- [Zod](https://zod.dev/) - Schema validation

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

If you enjoyed building this agent system and want to take your AI development skills to the next level, check out [Parsity's 30-Day AI Dev Cohort](https://parsity.io/ai-dev).

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
