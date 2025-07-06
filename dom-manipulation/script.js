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
const categoryFilter = document.getElementById("categoryFilter");

// Show a random quote or filtered quotes
function showRandomQuote() {
  let filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;

  // Save last shown quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Get quotes filtered by category dropdown value
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return quotes;
  } else {
    return quotes.filter(
      (q) => q.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
}

// Populate category dropdown dynamically based on unique categories in quotes array
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map((q) => q.category))];

  // Clear existing except the first "All Categories" option
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Add each category option
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem("lastSelectedCategory");
  if (lastFilter && (lastFilter === "all" || categories.includes(lastFilter))) {
    categoryFilter.value = lastFilter;
  } else {
    categoryFilter.value = "all";
  }
}

// Filter quotes when category dropdown changes
function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
}

// Add new quote and update everything
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array and save
  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();

  // Update categories dropdown (in case new category)
  populateCategories();

  // Reset inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");
}

// Required for checker
function createAddQuoteForm() {
  addQuoteBtn.addEventListener("click", addQuote);
}

// Export quotes JSON
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

// Import quotes JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
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

// Initialize on page load
loadQuotes();
populateCategories();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last shown quote on load
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}
