var script = function(){
const PRIV_KEY = "1b4b2d7ad09dd4b7c5ab609fee601bce884c61c7";
const PUBLIC_KEY = "ebe8295e33ef600c1479b873df830a6d";
const featuredcharID = [1009407, 1009220, 1009562, 1009187]; //IDs of characters to be displayed as feaured characters

const inputtext = document.getElementById('inputtext');
const optionlist = document.getElementById('optionlist');
const searchbtn = document.getElementById('searchbtn');

//fetch charcters to fill in the list on the basis of text typed in the search bar
function fetchCharList(event){
    var text = event.target.value;
    //if empty text then clear the list
    if (text==""){
        optionlist.innerHTML="";
        return;
    }
    //fetching fav hero list that is stored. to mark characters already in the fav list
    var str = localStorage.getItem("favHero");
    if (str==null){
        str="";
    }
    var favarr = str.split(',');
    //fetching 6 characters based on the typed text
    try {
        var ts = new Date().getTime();
        var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
        const response =  fetch(`https://gateway.marvel.com:443/v1/public/characters?apikey=${PUBLIC_KEY}&hash=${hash}&ts=${ts}&nameStartsWith=${text}&limit=6`)
            .then(response => response.json()) // converting response to json
            .then(
                function (data) {
                    // to show the results on the page
                    var arr = data.data.results;
                    optionlist.innerHTML="";

                    for (var i=0; i<arr.length; i++){
                        let id = arr[i].id;
                        let name = arr[i].name;
                        let imgpath = arr[i].thumbnail.path +"." + arr[i].thumbnail.extension;
                        /*check if character added to fav*/
                        let favStatus="fa-regular";
                        if (favarr.indexOf(id.toString())>=0){
                            favStatus="fa-solid";
                        }
                        /*create element*/
                        const li = document.createElement('li');
                        li.innerHTML=`<a href="info.html?id=${id}" class="options"><div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                          <div class="col-4 parent-container">
                            <img src="${imgpath}" class="img-fluid rounded-start" alt="...">
                          </div>
                          <div class="col-8">
                            <div class="card-body">
                              <h5 class="card-title fw-bold text-decoration-none">${name}</h5>
                              <span class="float-end" title="Add to Favourites"><i class="${favStatus} fa-heart" data-id="${id}" style="color: red;"></i></span>
                              <p class="card-text"><small class="text-decoration-none">Id: ${id}</small></p>
                            </div>
                          </div>
                        </div>
                    </div></a>`;
                    li.setAttribute("data-id", id);
                    optionlist.append(li);
                    }
                }
            );
    } catch (err) {
        console.log('Error:', err);
    }
}

//updating alert message
function appendAlert () {
    const alertmsg = document.getElementById('alertmsg');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-success alert-dismissible" role="alert">`,
        `   <img src="images/1600531.png"></img>`,
        `   <div>Uh oh! Couldnt't find this character in our database</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertmsg.append(wrapper);
}

//if search button is clicked, check if character exists and only then load or else error message
function checkCharExists(){
    var text = inputtext.value;
    text= encodeURI(text); //encoding the searched text for url
    //checking if character exists according to the name
    try {
        var ts = new Date().getTime();
        var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
        const response =  fetch(`https://gateway.marvel.com:443/v1/public/characters?apikey=${PUBLIC_KEY}&hash=${hash}&ts=${ts}&name=${text}`)
            .then(response => response.json()) // converting response to json
            .then(
                function (data) {
                    if (data.data.count>0){
                        window.open(`info.html?id=${data.data.results[0].id}`, "_parent"); //character present so open it in the same tab
                    }else{
                        appendAlert(); //character doesnt exist. show alert message
                    }
                }
            );
    }catch{
        console.log('Error:', err);
    }

}
/*updating IDs into fav list and storing it*/
function UpdateFav(favid){
    var str = localStorage.getItem("favHero");
    if (str==null){
        str="";
    }
    var arr = str.split(',');
    var index = arr.indexOf(favid); //check if already present
    if (index>=0){ //unlike - so remove from list
        arr.splice(index, 1);
        localStorage.setItem("favHero", arr.toString());
    }else{ //like - so update list
        arr.push(favid);
        localStorage.setItem("favHero", arr.toString());
    }
}

function clickEvent(event){
    const target= event.target;
    if (target==searchbtn){ //search button - check if character typed exists
        event.preventDefault();
        checkCharExists();
    }else if(target.className.includes('fa-heart')){ //like or unlike
        event.preventDefault();
        event.stopPropagation();
        var favid = target.dataset.id;
        target.classList.toggle("fa-regular");
        target.classList.toggle("fa-solid");
        UpdateFav(favid);
    }
}

//loading featured characters list
function featuredchar(){
    var featuredelem = document.querySelectorAll('.featuredchar');
    var str = localStorage.getItem("favHero");
    if (str==null){
        str="";
    }
    var favarr = str.split(',');
    //fetching characters of the IDs stored bove
    for (let i=0; i<featuredcharID.length; i++){ 
        try{
        var ts = new Date().getTime();
        var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
        let featuredimg = document.createElement('img');
        featuredimg.classList.add('card-img-top');
        featuredimg.src="#";
        let featureddiv = document.createElement('div');
        featureddiv.classList.add('card-body');
        const response =  fetch(`https://gateway.marvel.com:443/v1/public/characters/${featuredcharID[i]}?apikey=${PUBLIC_KEY}&hash=${hash}&ts=${ts}`)
            .then(response => response.json()) // converting response to json
            .then(
                function (data) {
                    let chardata = data.data.results[0];
                    let favStatus="fa-regular";
                    if (favarr.indexOf(chardata.id.toString())>=0){
                        favStatus="fa-solid";
                    }
                    featuredimg.setAttribute("src", chardata.thumbnail.path+"."+chardata.thumbnail.extension);
                    featureddiv.innerHTML=`<h5 class="card-title">${chardata.name}</h5>
                    <span class="float-end" title="Add to Favourites"><i class="${favStatus} fa-heart" data-id="${chardata.id}" style="color: black;"></i></span>
                    <p class="card-text"><small class="text-body-secondary">ID: ${chardata.id}</small></p>`;
                    featuredelem[i].appendChild(featuredimg);
                    featuredelem[i].appendChild(featureddiv);
                }
            );
        }catch (err) {
            console.log('Error:', err);
        }
        
    }
}

function initialize(){
    inputtext.addEventListener('keyup', fetchCharList);
    document.addEventListener('click', clickEvent);
    featuredchar(); //loading featured characters list
}
initialize();

}();