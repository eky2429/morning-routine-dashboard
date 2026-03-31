import { loadQuotes, getRandomQuote } from './zen_quotes.js';

// Function to display a new random quote in the header
export function displayNewQuote() {    
    const quote = getRandomQuote();

    if (!quote) {
        document.getElementById('quote').textContent = "Loading...";
        return;
    }
    document.getElementById('quote').textContent = quote;
}

// Function to initialize quotes on page load
export async function initQuotes() {
    await loadQuotes(); // ✅ wait until quotes are ready

    displayNewQuote(); // now safe to use
}
