//     //Funktion för att hämta Songs data från Strapi CMS
async function getTitlesStrapi() {
    //URL till Strapi-API Songs
    let url = "http://localhost:1337/api/Podcasts";

    //Hämtar JSON från API och konverterar det till JS objekt
    let stringResponse = await fetch(url);
    let myObject = await stringResponse.json();
    
    //Skriv ut Data
    let output = ""; 

    //Checkar om det är ett eller flera objekt som hämtas
    //Kan undvikas genom flera funktioner; en för alla och en för unik
    if (Array.isArray(myObject.data)){     //<-------------

        //Skapar en ForEach loop för varje element i Data-arrayen
        myObject.data.forEach((element) => {

            //Gör en pekare till attribut objektet
            let attr = element.attributes;
        
            for (x in attr) {
                console.log(x + ": " + attr[x]);
            }
        
        //Skriver Output string
        //document.write(`Namn: ${attr.Song}`);
        output += `<div>Title: ${attr.Description}</div>`;
});

} else {
    //Gör en pekare till attribut objektet
    let obj = myObject.data.attributes;
    for (x in obj) {
        console.log( x + ": " + obj[x]);
    }
}
//Skriver ut Output string till div-element
document.getElementById("titlesFetched").innerHTML = output;
}

// ---------------- Function getToken() -----------------------
//Funktion för att skapa ny data
async function getToken(){
    // 1. Göra ett inloggningsförsök för att få en Token returnerad
    // 2. Samla data och skapa ett objekt av dessa
    // 3. Skicka iväg JSON till API
    const urlUser = "http://localhost:1337/api/auth/local";
    // const urlPodcasts = "http://localhost:1337/api/Podcasts";

    //Hämta värden från inputfält
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    const userObject = {
        identifier: user,
        password: pass,
    };

    //Anropar API med inloggningsdata
    let userResponse = await fetch(urlUser,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userObject})
        });
        let userJson = await userResponse.json();

        if (userJson.jwt) postData(userJson.jwt);

        //Ta ut Token från Objekt
        const userToken = userJson.jwt;

// ---------------- Function postData() -----------------------
async function postData(token){

const urlPodcasts = "http://localhost:1337/api/Podcasts";

//Hämtar data från fält
const title = document.getElementById("Title").value;
const description = document.getElementById("Artist").value;
const date = document.getElementById("Album").value;
const episode = document.getElementById("Album").value;
const length = document.getElementById("Album").value;

//Skapa ett objekt med data inkluderat
    let podcastObject = {
        data : {
            title: title,
            description: description,
            date: date,
            episode: episode,
            length: length,
        },
    };

    //Anropar API med podcastObject
    let songResponse = await fetch(urlPodcasts,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(podcastObject),
        });
        let songJson = await songResponse.json();
        console.log(songJson);
}
}



