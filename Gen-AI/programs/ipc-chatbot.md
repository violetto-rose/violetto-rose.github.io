# Build a chatbot for the Indian Penal Code. We'll start by downloading the official Indian Penal Code document, and then we'll create a chatbot that can interact with it. Users will be able to ask questions about the Indian Penal Code and have a conversation with it.

This code allows us to interact with an IPC PDF document. We can extract text from it and easily look up specific sections right from the console. Here’s how it all works:

1. **Extracting Text**: We’re using the **fitz** library to read the contents of the IPC PDF. The `extract` function goes through each page of the PDF and pulls out the text, so we have all the information we need right at our fingertips.
2. **Searching Sections**: When we want to find a specific section, we can use the `search` function. This function looks through the extracted text to find lines that match our query, and it does so in a case-insensitive way—so we don’t have to worry about how we type our search terms.
3. **Chatbot Interface**: The `chatbot` function creates a simple interactive interface. Users can ask questions about the IPC, and it responds by providing the relevant text from the document. This makes it super easy to find the information we need without scrolling through pages of legal text.
4. **Exit Option**: The program keeps running, allowing us to ask as many questions as we want. When we’re done, we can just type “exit,” and the program will close.

> Get the IPC PDF document [here](https://drive.google.com/file/d/1e09QDtNREkvcDg3YFR74h7tyZmGMoo7n/view?usp=drivesdk).

---

### Python Code:

```python
import fitz # PyMuPDF

# Step 1: Extract Text from IPC PDF using PyMuPDF
def extract(file):  
	text = ""  
	with fitz.open(file) as pdf:  
		for page in pdf:  
			text += page.get_text() # Extract text from each page  
	return text

# Step 2: Search for Relevant Sections in IPC
def search(query, ipc):  
	query = query.lower()  
	lines = ipc.split("\n")  
	results = [line for line in lines if query in line.lower()]  
	return results if results else ["No relevant section found."]

# Step 3: Main Chatbot Function
def chatbot():  
	print("Loading IPC document...")  
	ipc = extract("IPC.pdf")  
	while True:  
		query = input("Ask a question about the IPC (type 'exit' to quit): ")  
		if query.lower() == "exit":  
			print("Goodbye!")  
			break
	    results = search(query, ipc)  
	    print("\n".join(results))  
	    print("-" * 50)  

# Start the chatbot
chatbot()
```
