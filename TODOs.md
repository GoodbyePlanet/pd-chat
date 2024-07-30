## TODO
- [ ] Create docker-compose for running pd-chat locally (database, ...)
- [ ] Improve error handling
- [ ] Deploy chat somewhere - check digital ocean or fly.io, check how to deploy ollama models
- [ ] Instead of figuring out where to deploy ollama consider using perplexity of https://console.groq.com/docs/models
- [ ] Find a way to initialize chosen chat once instead of initializing it on every request for a new question. So if chosen model is same we don't want to initialize LLMChat again. Only initialize LLMChat if a different model is chosen.
- [ ] UI:
    - [ ] Use react-textarea-autosize for question
    - [ ] Move input for question on the bottom
    - [ ] Create similar UI like every other chat - message is displayed on the right side, answer bellow it on the left
    - [ ] Add sidebar, PD chat logo, logout button
    - [ ] Add list of chat history
- [ ] Make RAG more generic (to work with uploaded doc (PDF for start))
- [ ] Use [Langchain](https://www.langchain.com/) for RAG
- [ ] Think about how to separate PD chat about PD docs and chat about anything else
- [ ] UI: Add option to upload PDF document
- [ ] Add an option to have Named Entity Recognition (NER)


### DONE ✓
- [x] Add server logging
- [x] Fix OpenAI, and use "text-embedding-3-small" embedding model
- [x] Use PostgreSQL/pgvector database
- [x] Create `db-compose.yaml` and add pgvector database
- [x] Fix ``12 vulnerabilities (2 low, 8 moderate, 2 high)``
- [x] Extend ollama to use more than one model - https://ollama.com/library
- [x] Add Mistral AI https://console.mistral.ai/billing/
- [x] Improve those freaking enums and different types
- [x] Improve README.md
- [x] Check if you can use RAG API https://github.com/danny-avila/rag_api/tree/main with custom UI - Not much fun, better to
  create our own RAG