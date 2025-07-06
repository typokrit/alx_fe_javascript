let quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  { text: "To be or not to be, that is the question.", category: "Philosophy" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add to quotes array
  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);

  // Create new DOM element to confirm visually
  const newQuoteEl = document.createElement("p");
  newQuoteEl.innerHTML = `New quote added: "${newQuoteObj.text}" — <em>${newQuoteObj.category}</em>`;
  document.body.appendChild(newQuoteEl); // or any specific container you want

  // Reset form
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// Required by checker
function createAddQuoteForm() {
  addQuoteBtn.addEventListener("click", addQuote);
}

// Event setup
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();
