let cl = console.log; //=> first class function


let baseURL = "http://localhost:3000/posts";
const data = document.getElementById('data');
const postForm = document.getElementById("postForm");
const title = document.getElementById('title');
const info = document.getElementById('info');
const submit = document.getElementById('submit');
const update = document.getElementById('update');

let postArray = [];

// ===============================Common Function For All methods============================= //


function makeFetchAPICall(methodName, url, body){
    return fetch(url, {
        method : methodName,
        body : body,
        headers : {
            'content-type' : "application/json; charset=UTF-8",
            'authorization' : "Bearar Token qwertyqaz"
        }
    }).then(response => response.json());
}

// async function makeFetchAPICall(methodName, url, body){
//     const response = await fetch(url, {
//         method: methodName,
//         body: body,
//         headers: {
//             'content-type': "application/json; charset=UTF-8",
//             'authorization': "Bearar Token qwertyqaz"
//         }
//     });
//     return await response.json();
// }


// For GET Method //
// ===============================GET Method============================= //


async function getPost(){
    try{
        let responseData = await makeFetchAPICall("GET", baseURL);
        postArray = responseData;
        templating(postArray);
    } catch(err){
        cl(err);
    }
    // fetch(baseURL)
    //     .then(response => response.json())
    //     .then(resp =>{
    //         cl(resp);
    //         postArray = resp;
    //         templating(postArray);
    //     })
    //     .catch(err => cl(err));
}
getPost();


// For POST method //
// ===============================POST Method============================= //


async function onPostSubmitHandler(eve){
    eve.preventDefault();
    let obj = {
        userID : Math.ceil(Math.random() * 10),
        title : title.value,
        body : info.value,
    }
    // cl(obj);
    postArray.push(obj);
    cl(postArray);
    postForm.reset();
    templating(postArray);

    try{
        let responseData = await makeFetchAPICall("POST", baseURL, JSON.stringify(obj));
        cl(responseData);
    } catch(err){
        cl(err);
    }
    // fetch(baseURL, {
    //     method : "POST",
    //     body : JSON.stringify(obj),
    //     headers : {
    //         "content-Type" : "application/json; charset =UTF-8",
    //         "authorization" : "Bearar Token qwertyqaz",
    //     }
    // }).then(response => response.json())
    //   .then(data => cl(data))
    //   .catch(cl);
}

// For PATCH method
// ===============================PATCH Method============================= //

const onEditHandler = eve =>{
    // cl("Edited");
    let getID = +eve.getAttribute("data-id");
    cl(getID);
    localStorage.setItem("setPostID", getID);
    let editObj = postArray.find(obj => obj.id === getID);
    cl(editObj);
    title.value = editObj.title;
    info.value = editObj.body;
    submit.classList.add("d-none");
    update.classList.remove("d-none");
}


async function onUpdateHandler(eve){
    let obj = {
        title : title.value,
        body : info.value,
    }
    cl(obj);
    let updatedID = +localStorage.getItem("setPostID");
    cl(updatedID);
    postArray.forEach(ele =>{
        if(ele.id === updatedID){
            ele.title = title.value;
            ele.body = info.value;
        }
    })
    cl(postArray);
    templating(postArray);
    postForm.reset();
    submit.classList.remove("d-none");
    update.classList.add("d-none");
    let updatedURL = `${baseURL}/${updatedID}`;
    try{
        let responseData = await makeFetchAPICall("PATCH", updatedURL, JSON.stringify(obj));
    }catch(err){
        cl(err);
    }
}

// ===============================DELETE Method============================= //


async function onDeleteHandler(eve){
    let deletedID = +eve.getAttribute('data-id');
    let newPostArray = postArray.filter(obj => obj.id != deletedID);
    cl(newPostArray);
    templating(newPostArray);
    let deletedURL = `${baseURL}/${deletedID}`;
    try{
        let responseData = await makeFetchAPICall("DELETE", deletedURL);
    }catch(err){
        cl(err);
    }
}


// ===============================Templating Function============================= //


function templating(arr){
    let result = '';
    arr.forEach(ele =>{
        result += `
            <div class="card mb-4">
                <div class="card-body">
                    <h3>${ele.title}</h3>
                    <p>${ele.body}</p>
                    <p class="text-right">
                        <button class="btn btn-success" data-id="${ele.id}" onclick="onEditHandler(this)">Edit</button>
                        <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeleteHandler(this)">Delete</button>
                    </p>
                </div>
            </div>`
    });
    data.innerHTML = result;
}

// ===============================Event Listners============================= //

postForm.addEventListener("submit", onPostSubmitHandler);
update.addEventListener("click", onUpdateHandler);