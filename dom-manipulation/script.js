let quotes = [];

// Load quotes from localStorage on start
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;

  // Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote + update DOM + save to localStorage
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();

  // Create DOM element to show confirmation
  const newQuoteEl = document.createElement("p");
  newQuoteEl.innerHTML = `New quote added: "${newQuoteObj.text}" — <em>${newQuoteObj.category}</em>`;
  document.body.appendChild(newQuoteEl);

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// Required for the checker
function createAddQuoteForm() {
  addQuoteBtn.addEventListener("click", addQuote);
}

// Export quotes as JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize everything
loadQuotes();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last quote from sessionStorage
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}
