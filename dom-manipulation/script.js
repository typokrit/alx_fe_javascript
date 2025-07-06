let quotes = [];

// Server URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

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

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

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

function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const lastFilter = localStorage.getItem("lastSelectedCategory");
  if (lastFilter && (lastFilter === "all" || categories.includes(lastFilter))) {
    categoryFilter.value = lastFilter;
  } else {
    categoryFilter.value = "all";
  }
}

function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
}

async function postQuoteToServer(quoteObj) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quoteObj.category,
        body: quoteObj.text,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

async function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();
  populateCategories();

  await postQuoteToServer(newQuoteObj);

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");
}

function createAddQuoteForm() {
  addQuoteBtn.addEventListener("click", addQuote);
}

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

const notificationContainer = document.createElement("div");
notificationContainer.style.position = "fixed";
notificationContainer.style.top = "0";
notificationContainer.style.left = "0";
notificationContainer.style.right = "0";
notificationContainer.style.backgroundColor = "#fffae6";
notificationContainer.style.color = "#333";
notificationContainer.style.padding = "10px";
notificationContainer.style.textAlign = "center";
notificationContainer.style.display = "none";
notificationContainer.style.zIndex = "1000";
document.body.prepend(notificationContainer);

function showNotification(message, actionText, actionCallback) {
  notificationContainer.textContent = "";
  const msgSpan = document.createElement("span");
  msgSpan.textContent = message;
  notificationContainer.appendChild(msgSpan);

  if (actionText && actionCallback) {
    const actionBtn = document.createElement("button");
    actionBtn.textContent = actionText;
    actionBtn.style.marginLeft = "10px";
    actionBtn.onclick = () => {
      actionCallback();
      hideNotification();
    };
    notificationContainer.appendChild(actionBtn);
  }

  notificationContainer.style.display = "block";
}

function hideNotification() {
  notificationContainer.style.display = "none";
}

function quotesAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].text !== arr2[i].text ||
      arr1[i].category !== arr2[i].category
    ) {
      return false;
    }
  }
  return true;
}

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  if (!response.ok) throw new Error("Failed to fetch server data");
  const serverData = await response.json();
  return serverData.map((item) => ({
    text: item.body,
    category: item.title,
  }));
}

async function syncQuotes() {
  // renamed function here
  try {
    const serverQuotes = await fetchQuotesFromServer();

    if (!quotesAreEqual(quotes, serverQuotes)) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      showRandomQuote();

      showNotification("Quotes updated from server.", "Refresh Now", () => {
        showRandomQuote();
      });
    }
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// Init
loadQuotes();
populateCategories();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

categoryFilter.addEventListener("change", filterQuotes);

setInterval(syncQuotes, 30000);
syncQuotes();
