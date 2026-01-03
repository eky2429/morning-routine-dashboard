const api_url = "https://api.allorigins.win/get?url=https://zenquotes.io/api/quotes";

async function getapi(url){
    const response = await fetch(url);
    var data = await response.json();
    var quotes = JSON.parse(data.contents);
    console.log(quotes);

    //Adds quote to h3 element
    document.getElementById("quote").innerHTML = '"' + quotes[0]['q'] + '" - ' + quotes[0]['a'];
}

getapi(api_url);