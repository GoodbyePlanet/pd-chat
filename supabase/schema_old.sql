create extension vector;

create table documents (
   id bigserial primary key,
   title text,
   content text,
   embedding vector(1536)
);

create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  content text,
  similarity float
)
language sql stable
as $$
select
    documents.id,
    documents.title,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
from documents
where 1 - (documents.embedding <=> query_embedding) > match_threshold
order by similarity desc
    limit match_count;
$$;

create index on documents using ivfflat (embedding vector_cosine_ops)
    with
    (lists = 100);