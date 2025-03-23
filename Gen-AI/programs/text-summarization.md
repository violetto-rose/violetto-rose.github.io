# Summarize long texts using a pre-trained summarization model using Hugging face model. Load the summarization pipeline. Take a passage as input and obtain the summarized text.

### Python Code:

```python
from transformers import pipeline

# Summarization pipeline with a specific model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Long text to summarize
long_text = """
The Indian Penal Code (IPC) is a comprehensive criminal code which covers all aspects of criminal law in India.
The IPC was drafted in 1860 and has been amended numerous times over the years.
It covers crimes such as theft, murder, defamation, and other offenses.
It also outlines the procedures for criminal trials, evidence, and punishment.
The IPC serves as the backbone of the criminal justice system in India.
"""

# Adjust max_length based on input length to avoid warnings
input_length = len(long_text.split())
max_len = min(input_length, 100)

# Summarize the text with adjusted max_length and min_length
summary = summarizer(long_text, max_length=max_len, min_length=50, do_sample=False)

# Output the summary
print(summary[0]['summary_text'])
```