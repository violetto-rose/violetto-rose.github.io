# Use word embeddings to improve prompts for Generative AI model. Retrieve similar words using word embeddings. Use the similar words to enrich a Gen-AI prompt. Use the AI model to generate responses for the original and enriched prompts. Compare the outputs in terms of detail and relevance.

### Python Code:

```python
from gensim.downloader import load
import torch
from transformers import pipeline

# Load pre-trained word embeddings (GloVe)
embedding_model = load("glove-wiki-gigaword-50")  # GloVe model with 50 dimensions
torch.manual_seed(42)

# Define contextually relevant word enrichment
def enrich_prompt(original_prompt):
  enriched_prompt = ""  # Start with the original prompt
  words = original_prompt.split()  # Split the prompt into words
  
  for word in words:
    similar_words = embedding_model.most_similar(word, topn=3)
    enriched_words = []
    
    for similar_word, _ in similar_words:
      enriched_words.append(similar_word)
      
    enriched_prompt += " " + " ".join(enriched_words)
  return enriched_prompt

# Example prompt to be enriched
original_prompt = "lung cancer"
enriched_prompt = enrich_prompt(original_prompt)

# Display the results
print("Original Prompt:", original_prompt)
print("Enriched Prompt:", enriched_prompt)

text_generator = pipeline("text-generation", model="gpt2", tokenizer="gpt2")

original_response = text_generator(
    original_prompt,
    max_length=200,
    num_return_sequences=1,
    no_repeat_ngram_size=2,
    top_p=0.95,
    temperature=0.7)
print("Prompt response\n", original_response[0]["generated_text"])

enriched_response = text_generator(
    enriched_prompt,
    max_length=200,
    num_return_sequences=1,
    no_repeat_ngram_size=2,
    top_p=0.95,
    temperature=0.7)
print("Enriched prompt response\n", enriched_response[0]["generated_text"])
```