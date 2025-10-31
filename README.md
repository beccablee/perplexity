# Perplexity

By Rebecca Lee

Welcome! This mini perplexity dupe is a React Next.js web application.

## Setup

Use the package manager [npm](https://npmjs.com).

```bash
# Install dependencies
npm ci
# Start local server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## An Overview

In this application you can explore the following functionality:

- Type and submit a query of any sorts
- Display top web results on the topic
- Displays top image results
- AI response powered by Groq
- Direct citations

Things to Observe in Code

- Search results show up in a simple expanded 5-column grid with site favicon
- Route /api/ask handles search + AI answers
- React Query for caching and fetching
- The hooks webSearch and answerWithCitations logic lives in lib
- Data is in a simple in-memory global state

Thanks for visiting <3

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
