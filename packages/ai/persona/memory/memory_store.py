import faiss
import numpy as np
from typing import List, Tuple, Optional
from datetime import datetime
from uuid import UUID
import json
import os
from math import exp

from utils.queries import get_vector_embedding

from persona.memory.concept_node import ConceptNode


class MemoryManager:
    def __init__(self, embedding_dim: int):
        self.embedding_dim = embedding_dim
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.memories: List[ConceptNode] = []
        self.id_to_index: dict[UUID, int] = {}

    def add_memory(self, memory: ConceptNode) -> None:
        """Add a memory and index its embedding."""
        embedding_np = np.array(memory.embedding, dtype=np.float32).reshape(1, -1)

        self.index.add(embedding_np)
        self.id_to_index[memory.id] = len(self.memories)
        self.memories.append(memory)

    def get_memory_by_id(self, memory_id: UUID) -> Optional[ConceptNode]:
        idx = self.id_to_index.get(memory_id)
        if idx is not None:
            return self.memories[idx]
        return None

    def retrieve_memories(
        self,
        subject: str,
        query: str,
        top_k: float = 5
    ) -> List[ConceptNode]:
        recency_weight = 0.5
        relevance_weight = 3
        importance_weight = 2    

        query_embedding = get_vector_embedding(query)

        query = np.array(query_embedding, dtype=np.float32)
        now = datetime.utcnow()

        results = []

        for mem in self.memories:
            if mem.subject != subject:
                continue

            # --- Relevance: cosine similarity (converted to [0, 1])
            mem_emb = np.array(mem.embedding, dtype=np.float32)
            cosine_sim = float(np.dot(query, mem_emb) / (np.linalg.norm(query) * np.linalg.norm(mem_emb)))
            relevance = (cosine_sim + 1) / 2

            # --- Recency: exponential decay based on time since last accessed
            seconds_since_access = (now - mem.last_accessed).total_seconds()
            recency = exp(-seconds_since_access / 3600.0)  # decay over 1 hour

            # --- Importance: assumed to be in [0, 1]
            importance = mem.importance

            # --- Combined score
            score = (
                relevance_weight * relevance +
                recency_weight * recency +
                importance_weight * importance
            )

            results.append((mem, score))

        results.sort(key=lambda x: x[1], reverse=True)

        return results[:top_k]

    def search_memories(
        self,
        query_embedding: List[float],
        k: int = 5
    ) -> List[Tuple[ConceptNode, float]]:
        """Retrieve the top-k most relevant memories by vector similarity."""
        if len(self.memories) == 0:
            return []

        query_np = np.array(query_embedding, dtype=np.float32).reshape(1, -1)
        distances, indices = self.index.search(query_np, k)

        results = []
        for i, dist in zip(indices[0], distances[0]):
            if i == -1:
                continue
            memory = self.memories[i]
            memory.last_accessed = datetime.utcnow()
            results.append((memory, dist))

        return results

    def save_to_disk(self, path: str) -> None:
        """Serialize memories to disk as JSON."""
        os.makedirs(path, exist_ok=True)
        with open(os.path.join(path, "memories.json"), "w") as f:
            json.dump([m.model_dump() for m in self.memories], f, default=str)

        faiss.write_index(self.index, os.path.join(path, "faiss.index"))

    def load_from_disk(self, path: str) -> None:
        """Load memories and FAISS index from disk."""
        memories_path = os.path.join(path, "memories.json")
        index_path = os.path.join(path, "faiss.index")

        if not os.path.exists(memories_path):
            return

        with open(memories_path, "r") as f:
            data = json.load(f)
            for i, entry in enumerate(data):
                memory = ConceptNode(**entry)
                self.memories.append(memory)
                self.id_to_index[memory.id] = i

        if os.path.exists(index_path):
            self.index = faiss.read_index(index_path)
        else:
            # Rebuild FAISS index if missing
            embeddings = np.array([m.embedding for m in self.memories], dtype=np.float32)
            if len(embeddings) > 0:
                self.index.add(embeddings)
