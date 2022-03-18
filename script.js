    //Funktion för att hämta Songs data från Strapi CMS
    async function getSongsStrapi() {
        //URL till Strapi-API Songs
        let url = "http://localhost:1337/api/Songs";
    
        //Hämtar JSON från API och konverterar det till JS objekt
        let stringResponse = await fetch(url);
        let myObject = await stringResponse.json();
    
        console.log(myObject);
        
        //Skriv ut Data
        let output = ""; 
    
        //Checkar om det är ett eller flera objekt som hämtas
        //Kan undvikas genom flera funktioner; en för alla och en för unik
        if (Array.isArray(myObject.data)){     //<-------------

            //Skapar en ForEach loop för varje element i Data-arrayen
            myObject.data.forEach(element => {

                //Gör en pekare till attribut objektet
                let attr = element.attributes;
            
                for (x in attr) {
                    console.log(x + ": " + attr[x]);
                }
            
            //Skriver Output string
            //document.write(`Namn: ${attr.Song}`);
            output += `<div>Title: ${attr.Song}</div>`;
        
    });

    } else {
        //Gör en pekare till attribut objektet
        let obj = myObject.data.attributes;
        for (x in obj) {
            console.log( x + ": " + obj[x]);
        }

        //Skriver Output string
        output += `<div>Namn: ${obj.Song}</div>`;
    }

    //Skriver ut Output string till div-element
    //document.write(output);
    document.getElementById("songsFetched").innerHTML = output;
}

    //Funktion för att hämta Songs data från Strapi CMS
    async function getArtistsStrapi() {
        //URL till Strapi-API Songs
        let url = "http://localhost:1337/api/Songs";
    
        //Hämtar JSON från API och konverterar det till JS objekt
        let stringResponse = await fetch(url);
        let myObject = await stringResponse.json();
    
        console.log(myObject);
        
        //Skriv ut Data
        let output = ""; 
    
        //Checkar om det är ett eller flera objekt som hämtas
        //Kan undvikas genom flera funktioner; en för alla och en för unik
        if (Array.isArray(myObject.data)){     //<-------------

            //Skapar en ForEach loop för varje element i Data-arrayen
            myObject.data.forEach(element => {

                //Gör en pekare till attribut objektet
                let attr = element.attributes;
            
                for (x in attr) {
                    console.log(x + ": " + attr[x]);
                }
            
            //Skriver Output string
            //document.write(`Namn: ${attr.Song}`);
            output += `<div>Title: ${attr.Artist}</div>`;
        
    });

    } else {
        //Gör en pekare till attribut objektet
        let obj = myObject.data.attributes;
        for (x in obj) {
            console.log( x + ": " + obj[x]);
        }

        //Skriver Output string
        output += `<div>Namn: ${obj.Artist}</div>`;
    }

    //Skriver ut Output string till div-element
    //document.write(output);
    document.getElementById("artistsFetched").innerHTML = output;
}

    //Funktion för att hämta Songs data från Strapi CMS
    async function getAlbumsStrapi() {
        //URL till Strapi-API Songs
        let url = "http://localhost:1337/api/Songs";
    
        //Hämtar JSON från API och konverterar det till JS objekt
        let stringResponse = await fetch(url);
        let myObject = await stringResponse.json();
    
        console.log(myObject);
        
        //Skriv ut Data
        let output = ""; 
    
        //Checkar om det är ett eller flera objekt som hämtas
        //Kan undvikas genom flera funktioner; en för alla och en för unik
        if (Array.isArray(myObject.data)){     //<-------------

            //Skapar en ForEach loop för varje element i Data-arrayen
            myObject.data.forEach(element => {

                //Gör en pekare till attribut objektet
                let attr = element.attributes;
            
                for (x in attr) {
                    console.log(x + ": " + attr[x]);
                }
            
            //Skriver Output string
            //document.write(`Namn: ${attr.Song}`);
            output += `<div>Title: ${attr.Album}</div>`;
        
    });

    } else {
        //Gör en pekare till attribut objektet
        let obj = myObject.data.attributes;
        for (x in obj) {
            console.log( x + ": " + obj[x]);
        }

        //Skriver Output string
        output += `<div>Namn: ${obj.Album}</div>`;
    }

    //Skriver ut Output string till div-element
    //document.write(output);
    document.getElementById("albumsFetched").innerHTML = output;
}

    // ---------------- Function getToken() -----------------------
    //Funktion för att skapa ny data
    async function getToken(){
        // 1. Göra ett inloggningsförsök för att få en Token returnerad
        // 2. Samla data och skapa ett objekt av dessa
        // 3. Skicka iväg JSON till API
        const urlUser = "http://localhost:1337/api/auth/local";
        //const urlSongs = "http://localhost:1337/api/Songs";

        //Hämta värden från inputfält
        const user = document.getElementById("user").value;
        const pass = document.getElementById("pass").value;

        const userObject = {
            identifier: user,
            password: pass
        }

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
            //console.log(userJson);

            if (userJson.jwt) postData(userJson.jwt);

            //Ta ut Token från Objekt
            const userToken = userJson.jwt;

            //Steg 2; Samla data till ett objekt
    }

    // ---------------- Function postData() -----------------------
    async function postData(token){
    
        const urlSongs = "http://localhost:1337/api/Songs";

    //Hämtar data från fält
    const title = document.getElementById("Title").value;
    const artist = document.getElementById("Artist").value;
    const album = document.getElementById("Album").value;

    //Skapa ett objekt med data inkluderat
        let songObject = {
            data : {
                title: title,
                artist: artist,
                album: album
            }
        };
        //Anropar API med songObject
        let songResponse = await fetch(urlSongs,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
 
                },
                body: JSON.stringify({songObject})
            });

            let songJson = await songResponse.json();

            console.log(songJson);
    }



