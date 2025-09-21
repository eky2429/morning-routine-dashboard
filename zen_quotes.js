const api_url ="https://zenquotes.io/api/quotes";

async function getapi(url){
    const response = await fetch(url);
    var data = await response.json();
    console.log(data);

    //Adds quote to h3 element
    document.getElementById("quote").innerHTML = '"' + data[0]['q'] + '" - ' + data[0]['a'];
}

getapi(api_url);