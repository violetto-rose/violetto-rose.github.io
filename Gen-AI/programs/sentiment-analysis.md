# Use a pre-trained Hugging Face model to analyze sentiment in text. Assume a real-world application, Load the sentiment analysis pipeline. Analyze the sentiment by giving sentences to input.

### Python Code:

```python
from transformers import pipeline

# Sentiment analysis pipeline with a specified model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

# Analyze sentiment
sentence = "I love working with Python for AI development!"

result = sentiment_analyzer(sentence)

print(result)
```