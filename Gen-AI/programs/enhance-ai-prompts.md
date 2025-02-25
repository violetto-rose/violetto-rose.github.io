# Use word embeddings to improve prompts for Generative AI model. Retrieve similar words using word embeddings. Use the similar words to enrich a Gen-AI prompt. Use the AI model to generate responses for the original and enriched prompts. Compare the outputs in terms of detail and relevance.

### Python Code:

```python
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import nltk
from transformers import pipeline

# Download necessary NLTK resources
nltk.download('punkt')

# Sample corpus (you can load your own domain-specific text)
corpus = "The law of physics governs everything in the universe. Newton's laws are fundamental."

# Tokenize the text
tokens = word_tokenize(corpus.lower())

# Train a Word2Vec model
model = Word2Vec([tokens], min_count=1, vector_size=100, window=5)

# Define a pre-trained language model (GPT-2 via Hugging Face)
generator = pipeline("text-generation", model="gpt2")

# Example prompt improvement using similar words
seed_word = "law"

similar_words = model.wv.most_similar(seed_word, topn=10) # Get more similar words

# Filter out irrelevant words such as common stopwords, punctuation, or tokens like "'s"
stopwords = {'the', 'of', 'and', 'in', 'to', 'a', 'is', 'for', 'on', 'that', 'are', 'with', '.', ',', "'s", 'it', 'as'}
filtered_words = [word for word, _ in similar_words if word not in stopwords]

# Use the first 3 valid words for the enriched prompt
if len(filtered_words) >= 3:
	enriched_prompt = f"Discuss the importance of {filtered_words[0]}, {filtered_words[1]}, and {filtered_words[2]} in modern science."
else:
	enriched_prompt = f"Discuss the importance of {', '.join(filtered_words)} in modern science."

# Generate text based on the enriched prompt
generated_text = generator(enriched_prompt, max_length=100, num_return_sequences=1, truncation=True)

# Print the generated text
print(generated_text[0]['generated_text'])
```