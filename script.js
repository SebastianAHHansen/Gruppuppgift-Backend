// Function - get data from Strapi CMS
async function getPodcastsStrapi() {
        let url = "http://localhost:1337/api/Podcasts/";
    
        let stringResponse = await fetch(url);
        let myObject = await stringResponse.json();
        
        let output = "<table>"; 
    
        if (Array.isArray(myObject.data)) {
            output += generateRow(myObject.data[0].attributes, null, true);

            myObject.data.forEach((element) => {

                let obj = element.attributes;
            
            output += generateRow(obj, element.id, false);
    });

    } else {
        let obj = myObject.data.attributes;

            output += generateRow(obj, null, true);
            output += generateRow(obj, myObject.data.id, false);
        }

        output += "</table>"

    document.getElementById("podcastTitlesFetched").innerHTML = output;
}

// Function GetToken()
async function getToken(){
        let valid = true;
        
        if (!validateLogin() ) valid = false;
        if (!validateForm() ) valid = false;
        if (!valid) return null;

        const urlUser = "http://localhost:1337/api/auth/local";

        //Collect data from input form
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
                body: JSON.stringify(userObject)
            });

        let userJson = await userResponse.json();

        if (userJson.jwt) return userJson.jwt;
        else {
            let errMessage = userJson.error.message;
            document.getElementById("userError").innerText = errMessage;
            return null;
        }

    }

// Function postData()
async function postData(){
    let token = await getToken();
    if (!token) return;

    const urlPodcasts = "http://localhost:1337/api/Podcasts/";

    //Get data from object
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const date = document.getElementById("date").value;
    const length = document.getElementById("length").value;
    const episode = document.getElementById("episode").value;
    const category = document.getElementById("category").value;

    //Skapa ett objekt med data inkluderat
        let dataObject = {
            data : {
                Title: title,
                Description: desc,
                Date: date,
                Length: length,
                Episode: episode,
                Category: category
            }
        };

        //Calls API
        let podcastResponse = await fetch(urlPodcasts,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(dataObject),
            });

            let podcastJson = await podcastResponse.json();
            console.log(podcastJson);
}

// User Validation
function userValidate(comp){
    let valid = true;

    if (comp.value.length == 0) {
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

// Password Validation
function passValidate(comp){
    let valid = true;

    if (comp.value.length <= 5) {
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

// Login Validation
function validateLogin(){
    let valid = true;

    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }
    return valid;

}

// Input Form Validation
function formValidate(comp) {
    let valid = true;

    if (comp.value.length == 0) {
        valid = false;
        document.getElementById("formError").innerText = "Fill in all input fields";
    }
    if (valid) {
        document.getElementById("formError").innerText = "";
    }

    return valid;
}

//Titles, Description, Date, Length & Episode Validation
function validateForm() {
    let valid = true;
    if ( !formValidate(document.getElementById("title", "desc", "date", "length", "episode", "category")) ) {
        valid = false;
    }
    return valid;
}

//Generate Row - output
function generateRow(object, objectId, header) {
    let output = "<tr>";
    let forbiddenParameters = ["createdAt", "updatedAt", "publishedAt"];

    //For in loop för att gå igenom alla parametrar i obj
    for (x in object) {
        if (forbiddenParameters.includes(x)) continue;

        if (header) output += `<th>${x}</th>`;
        else output += `<td>${object[x]}</td>`;
    }

    //Update & Delete button
    if (!header) {
        let podcastUrl = `http://localhost:1337/api/Podcasts/${objectId}`;
        output += `<td><button onclick="updatePost('${podcastUrl}');">Update</button></td>`;
        output += `<td><button onclick="deletePost('${podcastUrl}');">Delete</button></td>`;
    }
    output += "</tr>";

    return output;
}

// Function DeletePost
async function deletePost(url) {
    let token = await getToken();
    if (!token) return;


    await fetch(url,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + token
            }
        });

    await getPodcastsStrapi();

}

// Function UpdatePost
async function updatePost(url){
    let token = await getToken();
    if (!token) return;

 //Collects data from input fields
 const title = document.getElementById("title").value;
 const desc = document.getElementById("desc").value;
 const date = document.getElementById("date").value;
 const length = document.getElementById("length").value;
 const episode = document.getElementById("episode").value;
 const category = document.getElementById("category").value;

     let dataObject = {
         data : {}
     };

     if (title) dataObject.data["title"] = title;
     if (desc) dataObject.data["desc"] = desc;
     if (date) dataObject.data["date"] = date;
     if (length) dataObject.data["length"] = length;
     if (episode) dataObject.data["episode"] = episode;
     if (category) dataObject.data["category"] = episode;
     
     await fetch(url, 
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dataObject)
        });
    
    await getPodcastsStrapi();
}

// Clears Input Forms()
function clearInputForms() {
    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("date").value = "";
    document.getElementById("length").value = "";
    document.getElementById("episode").value = "";
    document.getElementById("category").value = "";

    document.getElementById("output").innerHTML = "<p>Input forms cleared</p>";
};
