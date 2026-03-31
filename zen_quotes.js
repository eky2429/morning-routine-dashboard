const api_url = "https://api.allorigins.win/get?url=https://zenquotes.io/api/quotes";

let loading_quote_text = "Loading quote...";

let quotes = [];

let loaded = false;

export async function loadQuotes(){
    if (loaded) return;

    const response = await fetch(api_url);
    var data = await response.json();
    quotes = JSON.parse(data.contents);
    // console.log(quotes);
    loaded = true;
}

export function getRandomQuote() {
    if (quotes.length === 0) {
        return null; // or fallback message
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    return ('"' + quote['q'] + '" - ' + quote['a']);
}