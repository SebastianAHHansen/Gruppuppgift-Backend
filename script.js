//Funktion för att hämta Songs data från Strapi CMS
async function getSongsStrapi() {
        //URL till Strapi-API Songs
        let url = "http://localhost:1337/api/Songs/";
    
        //Hämtar JSON från API och konverterar det till JS objekt
        let stringResponse = await fetch(url);
        let myObject = await stringResponse.json();
        
        //Skriv ut Data
        let output = "<table>"; 
    
        //Checkar om det är ett eller flera objekt som hämtas
        //Kan undvikas genom flera funktioner; en för alla och en för unik
        if (Array.isArray(myObject.data)) {
            //Anropa generateRow för att skapa en Header rad
            output += generateRow(myObject.data[0].attributes, null, true);

            //Skapar en ForEach loop för varje element i Data-arrayen
            myObject.data.forEach((element) => {

                //Gör en pekare till attribut objektet
                let obj = element.attributes;
            
            //Skriver Output string
            output += generateRow(obj, element.id, false);
    });

    } else {
        //Gör en pekare till attribut objektet
        let obj = myObject.data.attributes;

            //Skapa en Header rad
            output += generateRow(obj, null, true);
            output += generateRow(obj, myObject.data.id, false);
        }
        //Avsluta Table tag
        output += "</table>"

    //Skriver ut Output string till div-element
    document.getElementById("titlesFetched").innerHTML = output;
}

//Function GetToken()
async function getToken(){
        //Validate usernamn, password & validateSongs
        let valid = true;
        
        if (!validateLogin() ) valid = false;
        // if ( !validateSongs() ) valid = false;

        if (!valid) return null;

        const urlUser = "http://localhost:1337/api/auth/local";

        //Hämta värden från inputfält
        const user = document.getElementById("user").value;
        const pass = document.getElementById("pass").value;

        const userObject = {
            identifier: user,
            password: pass,
        };

        //Anropar API med inloggningsdata - inkluderar Method & Headers
        let userResponse = await fetch(urlUser,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...userObject})
            });

        let userJson = await userResponse.json();

        if (userJson.jwt) await postData(userJson.jwt);
        else {
            let errMessage = userJson.error.message;
            document.getElementById("userError").innerText = errMessage;
            return null;
        }
}

//Function postData()
async function postData(){
    let token = await getToken();
    if (!token) return;
    alert("Hello");

    const urlSongs = "http://localhost:1337/api/Songs/";

    //Hämtar data från fält
    const artist = document.getElementById("artist").value;
    const song = document.getElementById("song").value;
    const genre = document.getElementById("genre").value;
    const album = document.getElementById("album").value;
    const duration = document.getElementById("duration").value;

    //Skapa ett objekt med data inkluderat
        let titleObject = {
            data : {
                Artist: artist,
                Song: song,
                Genre: genre,
                Album: album,
                Duration: duration
            }
        };

        //Anropar API med titleObject
        let titleResponse = await fetch(urlSongs,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(titleObject),
            });

            let songJson = await titleResponse.json();
            console.log(songJson);
}

//Funktioner för Validering
function userValidate(comp){
    let valid = true;

    if (comp.value.length == 0) {
        //Misslyckad validering
        valid = false;
    }

    if (!valid) {
        document.getElementById("userError").innerText ="Enter a valid Username!";
        return false;
    } else {
        document.getElementById("userError").innerText = "";
        return true;
    }
}

//Validering av Password Input
function passValidate(comp){
    let valid = true;

    if (comp.value.length <= 5) {
        //Misslyckad validering
        valid = false;
    }

    if (!valid) {
        document.getElementById("passwordError").innerText = "Password must be at least 6 charcters long!";
        return false;
    } else {
        document.getElementById("passwordError").innerText = "";
        return true;
    }
}

function validateLogin(){
    let valid = true;

    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }
    return false;
}

//Validering av artistinput
function artistValidate(comp) {
    let valid = true;

    if (comp.value.length == 0) {
        valid = false;
        document.getElementById("artistError").innerText = "You have to fill in the input!";
    }

    //Om värdet är ett nummer 
    if ( !isNaN( comp.value ) && comp.value.length != 0 ) {
        valid = false;
        document.getElementById("artistError").innerText = "Could not be a number.";
    }
    if (valid) {
        document.getElementById("artistError").innerText = "";
    }
    return valid;
}

//Validering av Songs
function validateSongs() {
    let valid = true;

    //Validate artistValidate
    if ( !artistValidate(document.getElementById("artist")) ){
        valid = false;
    }
    //Skapa funktioner för samtliga fält

    return valid;
}

//Genererat tabellrad med det inkluderade värder. Skapar TH 
function generateRow(obj, objId, header) {
    let output = "<tr>";
    let forbiddenParameters = ["createdAt", "updatedAt", "publishedAt"];

    //For in loop för att gå igenom alla parametrar i obj
    for (x in obj) {
        //x = parameterns namn
        //obj[x] = parameterns värde

        //Kontrollera att x är en tillåten parameter
        //Keyword Continue går vidare till nästa parameter i loopen
        if (forbiddenParameters.includes(x)) continue;

        if (header) output += `<th>${x}</th>`;
        else output += `<td>${obj[x]}</td>`;
    }

    //Skapa Update & Delete knapp för TD rad
    if (!header) {
        let postUrl = `http://localhost:1337/api/Songs/${objId}`;
        //Inkludera en update knapp
        output += `<td><button onclick="updatePost(${postUrl});">Update</button></td>`;
        output += `<td><button onclick="deletePost(${postUrl}));">Delete</button></td>`;
    }
    output += "</tr>";

    return output;
}

//Function UpdatePost
async function updatePost(url){
    let token = await getToken();
    if (!token) return;

 //Hämtar data från fält
 const artist = document.getElementById("artist").value;
 const song = document.getElementById("song").value;
 const genre = document.getElementById("genre").value;
 const album = document.getElementById("album").value;
 const duration = document.getElementById("duration").value;

 //Skapa ett objekt med data inkluderat
     let titleObject = {
         data : {}
     };

     if (artist) titleObject.data["artist"] = artist;
     if (song) titleObject.data["song"] = song;
     if (genre) titleObject.data["genre"] = genre;
     if (album) titleObject.data["album"] = album;
     if (duration) titleObject.data["duration"] = duration;
     
     await fetch(url, 
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(titleObject)
        });
    
    await getSongsStrapi();
}

//Function DeletePost
async function deletePost(url){
    let token = await getToken();
    if (!token) return;

    await fetch(url, 
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    });

await getSongsStrapi();
}


// <--------------- Function getPodcastTitlesStrapi() Podcast -----------------------
/*
//     async function getPodcastTitlesStrapi() {
//         //URL till Strapi-API Podcasts
//         let podcastUrl = "http://localhost:1337/api/Podcasts/";
    
//         //Hämtar JSON från API och konverterar det till JS objekt
//         let stringResponse = await fetch(podcastUrl);
//         let myObject = await stringResponse.json();
        
//         //Skriv ut Data
//         let output = ""; 
    
//         //Checkar om det är ett eller flera objekt som hämtas
//         //Kan undvikas genom flera funktioner; en för alla och en för unik
//         if (Array.isArray(myObject.data)) {

//             //Skapar en ForEach loop för varje element i Data-arrayen
//             myObject.data.forEach((element) => {

//                 //Gör en pekare till attribut objektet
//                 let attr = element.attributes;
            
//                 for (x in attr) {
//                     console.log(x + ": " + attr[x]);
//                 }
            
//             //Skriver Output string
//             output += `<div>Title: ${attr.Title}</div>`;
//     });

//     } else {
//         //Gör en pekare till attribut objektet
//         let obj = myObject.data.attributes;
//         for (x in obj) {
//             console.log( x + ": " + obj[x]);
//         }
//     }
//     //Skriver ut Output string till div-element
//     document.getElementById("podcastTitlesFetched").innerHTML = output;
// }
*/

// ---------------- Function getToken() Podcast -----------------------
/*
async function getToken(){
        // 1. Göra ett inloggningsförsök för att få en Token returnerad
        // 2. Samla data och skapa ett objekt av dessa
        // 3. Skicka iväg JSON till API
        const urlUser = "http://localhost:1337/api/auth/local/";

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
                body: JSON.stringify({...userObject})
            });
        let userJson = await userResponse.json();

        if (userJson.jwt) await postData(userJson.jwt);

            // //Ta ut Token från Objekt
            // const userToken = userJson.jwt;
}
*/

// ---------------- Function postData() Podcast -----------------------
/*
    async function postData(token){
    const urlPodcasts = "http://localhost:1337/api/Podcasts/";

    //Hämtar data från fält
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const date = document.getElementById("date").value;
    const episode = document.getElementById("episode").value;
    const length = document.getElementById("length").value;


    //Skapa ett objekt med data inkluderat
        let titleObject = {
            data : {
                Title: title,
                Description: description,
                Date: date,
                Episode: episode,
                Length: length
            },
        };

        //Anropar API med titleObject
        let titleResponse = await fetch(urlPodcasts,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(titleObject),
            });
            let podcastJson = await titleResponse.json();
            console.log(podcastJson);
}
*/
