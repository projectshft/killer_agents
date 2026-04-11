# SQL Agent Assignment

Build an agent that translates natural language queries into database queries using Prisma.

## What You're Building

A database search agent that:
1. Takes natural language: "Find fitness influencers in LA under $500"
2. Extracts structured parameters using an LLM
3. Builds a Prisma query
4. Returns formatted results

```
"Show me micro tier gaming creators"
            │
            ▼
    ┌───────────────┐
    │  LLM Extract  │
    │  Parameters   │
    └───────────────┘
            │
            ▼
    tier: "micro"
    genre: "gaming"
            │
            ▼
    ┌───────────────┐
    │ Build Prisma  │
    │    Query      │
    └───────────────┘
            │
            ▼
    prisma.influencer.findMany({
      where: {
        metadata: {
          tier: { name: "micro" },
          primaryGenre: { name: "gaming" }
        }
      }
    })
```

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Setup

Create a `.env` file:

```env
# Required: Gemini API key
GEMINI_API_KEY=your_key_here

# Database (shared read-only for this assignment)
DATABASE_URL="postgresql://neondb_owner:npg_Rt2Mena8ZVwA@ep-billowing-shape-a4a0p4zw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy to your `.env` file

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Your Task

Complete the `databaseSearchAgent` in `app/agents/databaseSearchAgent.ts`.

### TODO 1: Define the Schema

Define what parameters the LLM should extract:

```typescript
const sqlSchema = z.object({
  price: z.number().optional().nullable(),
  tier: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});
```

### TODO 2: Build WHERE Clause

Convert extracted parameters to a Prisma WHERE clause:

```typescript
const constructWhereClause = (sqlProps: SqlProps) => {
  const whereClause: Prisma.InfluencerWhereInput = {};

  if (sqlProps.genre) {
    whereClause.metadata = {
      primaryGenre: { name: sqlProps.genre }
    };
  }

  // Add more conditions...

  return whereClause;
};
```

### TODO 3: Implement the Agent

1. Get available genres from DB (for LLM context)
2. Create a prompt asking Gemini to extract parameters
3. Call Gemini with structured output
4. Build WHERE clause from response
5. Query database
6. Format results

## Test Queries

Try these when your implementation is complete:

- "Find fitness influencers in LA"
- "Show me micro tier creators under $500"
- "I need gaming influencers"
- "Beauty creators in New York"

## Database Schema

```
Influencer
├── name
├── metadata (InfluencerMetadata)
│   ├── location
│   ├── primaryGenre → Genre (name)
│   └── tier → Tier (name: nano/micro/mid/macro/mega)
└── prices (InfluencerPrice[])
    └── priceCents
```

Browse the data:
```bash
npx prisma studio
```

## Why This Matters: SQL vs Vector Search

This assignment teaches you when traditional database queries beat vector search.

| Use SQL When | Use Vectors When |
|--------------|------------------|
| Known schema with exact fields | Unstructured text (docs, articles) |
| Exact filters (price < 500) | Semantic similarity ("angry customers") |
| Aggregations (COUNT, AVG) | Fuzzy matching ("refund" → "return policy") |
| Sorting/pagination | When you don't know exact terms |

**Key insight**: For structured data with known schemas, SQL is faster, cheaper, and more precise than vector search.

## SQL Injection: Why Prisma is Safe

With Prisma, you never concatenate user input into SQL strings:

```typescript
// ❌ DANGEROUS - raw SQL
const query = `SELECT * FROM users WHERE name = '${userInput}'`;

// ✅ SAFE - Prisma parameterized queries
const users = await prisma.user.findMany({
  where: { name: userInput }
});
```

Prisma sends the query structure and values separately—user input is always treated as data, never as SQL code.

## Troubleshooting

**"Invalid API Key"**: Check your `GEMINI_API_KEY` in `.env`

**"Can't reach database"**: The shared DB requires internet connection

**No results**: Check your WHERE clause logic matches the schema

**Prisma errors**: Run `npx prisma generate` to regenerate the client

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Gemini AI Documentation](https://ai.google.dev/)
- [Zod Schema Validation](https://zod.dev/)
