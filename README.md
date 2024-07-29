## Getting Started

AI powered chat.
![img.png](img.png)

### Setup

Create an account and get an API key on:
 - [OpenAI](https://openai.com)
 - [Mistral](https://console.mistral.ai)
 - [Anthropic](https://console.anthropic.com)

Create an account on [Supabase](https://supabase.com) to get API keys - optional (only if you want to use supabase)

Rename `.env.example` to `.env.local` and add missing keys

### Ollama - https://ollama.com/

Download ollama client on you machine and following models:
- llama3.1:latest - https://ollama.com/library/llama3.1
- llama3:latest - https://ollama.com/library/llama3:latest
- phi3:3.8b - https://ollama.com/library/phi3
- gemma2:latest - https://ollama.com/library/gemma:latest
- nomic-embed-text:latest - https://ollama.com/library/nomic-embed-text:latest

### Docker

Run docker-compose to start `pgvector` database

1. Start `pg-vector` DB container
```bash
docker-compose -f db-compose.yaml up
```

2. Create DB tables 
```bash
npm run drizzle:migrate
```

3. Add embeddings for documents (src/documents)
```bash
npm run embed
```

### Starting development server:

```bash
npm install

npm run dev
```

### Supabase

[Supabase CLI docs](https://supabase.com/docs/reference/cli/global-flags)

Steps:

1. Install supabase CLI on your machine
2. Execute following commands

```shell
supabase init
supabase login
supabase link --project-ref <project-ref>
```

If you have issues with connecting to Docker this will help - (https://eshlox.net/2023/02/26/supabase-cli-cannot-connect-to-the-docker-daemon/)

[To create next migration](https://supabase.com/docs/reference/cli/supabase-migration-new)