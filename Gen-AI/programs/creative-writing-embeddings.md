# Use word embeddings to create meaningful sentences for creative tasks. Retrieve similar words for a seed word. Create a sentence or story using these words as a starting point. Write a program that: Takes a seed word. Generates similar words. Constructs a short paragraph using these words.

### Python Code:

```python
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import nltk
from transformers import pipeline

# Download NLTK resources
nltk.download('punkt_tab')

def train_word2vec(corpus):
	tokens = word_tokenize(corpus.lower())
	model = Word2Vec([tokens], min_count=1, vector_size=100, window=5)
	return model
	
def generate_text_with_gpt2(prompt):
	generator = pipeline("text-generation", model="gpt2")
	generated_text = generator(prompt, max_length=100, truncation=True)
	return generated_text[0]['generated_text']
	
if __name__	== "__main__":
	corpus = "The law of physics governs everything in the universe. Newton's laws are fundamental."
	model = train_word2vec(corpus)
	seed_word = "law"
	similar_words = model.wv.most_similar(seed_word, topn=5)
	print("Similar words:", similar_words)
	enriched_prompt = f"Discuss the importance of Newton's laws, motion, and force in modern science."
	generated_text = generate_text_with_gpt2(enriched_prompt)
	print(generated_text)
```