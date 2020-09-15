const titleInput = document.querySelector('#titleInput')
const resultsList = document.querySelector('.resultsList')
const nominationList = document.querySelector('.nominationsList')
let buttons = document.querySelector('button')
let nominationCount = 0;
let nominations = []

document.addEventListener('DOMContentLoaded', getLocalNominations);

function fullBallot(){
  document.querySelector('#complete').classList.toggle("hidden");
}

function removeSelection(e){
  let movieTitle = e.target.previousSibling.textContent
  removeLocalNominations(movieTitle);
  let currentResultList = document.querySelector('.resultsList').children

  for(let i = 0; i < currentResultList.length; i++){
    console.log(currentResultList[i].firstChild);
    if(currentResultList[i].firstChild.id){
      if(currentResultList[i].firstChild.innerHTML.includes(movieTitle)){
        currentResultList[i].firstChild.childNodes[1].firstChild.classList.remove('opacity')
        currentResultList[i].firstChild.id=""
      }
    }
  }

  nominations = nominations.filter((a,b)=>{ return ( a !== movieTitle)})

  console.log(currentResultList);

  // currentResultList.forEach((item, i) => {
  //   console.log(item);
  // });
  if (nominationCount>0) {
    nominationCount--;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`
  }

  e.target.parentElement.remove()
  if (!document.querySelector('.complete').classList.contains('hidden')) {
    fullBallot();
  }
}

function nominateSelection(e){
  let currentNominationList = document.querySelector('#nominations').children

  if (nominationCount<=4 && (!nominations.includes(e.target.parentElement.parentElement.firstChild.textContent))){
    nominations.push(e.target.parentElement.parentElement.firstChild.textContent)

    e.target.classList.add('opacity');

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = e.target.parentElement.previousSibling.textContent
    e.target.parentElement.parentElement.id= `${nominationCount}`
    saveLocalNomination(e.target.parentElement.previousSibling.textContent);

    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)

    nominationCount++;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`
    if (nominationCount===5){
      fullBallot();
    }
  }
}

function showResults(results){
  //dom stuff...., reveals output section
  document.querySelector('#output').classList.remove('hidden')

  inputSearch.textContent = `Results for... "${titleInput.value}"`
  titleInput.value="";

  results=results.sort( (a, b) => b.year - a.year)
  // console.log(results);

    // console.log(results[0])
    results.forEach((item, i) => {
    let listItem = document.createElement('li')
    listItem.classList.add('movieItem')

    //drop down
    let movieHeaderSec=document.createElement('section')
    movieHeaderSec.classList.add('movieHeader')
    // more info drop down
    movieHeaderSec.addEventListener('click', e=>{
      if(true){
        // console.log(e.target== `<button class="nominate${i} opacity">Nominate</button>`);
        // console.log(e.target);
        movieHeaderSec.classList.toggle("active")
        const movieDetails = movieHeaderSec.nextElementSibling;
        if (movieHeaderSec.classList.contains('active')){
          movieDetails.style.maxHeight = movieDetails.scrollHeight + "px"; //
        }
        else{
          movieDetails.style.maxHeight = 0;
        }
      }

    })
    let movieDetailsSec=document.createElement('section')
    movieDetailsSec.classList.add('movieDetails')
    let detailsSection=document.createElement('section')
    detailsSection.classList.add('details')
    let testParagraph = document.createElement('p')
    let testNode = document.createTextNode('')
    testParagraph.appendChild(testNode)
    detailsSection.appendChild(testParagraph)
    movieDetailsSec.appendChild(detailsSection)

    //result information
    let movieTitle = document.createElement('h3')
    movieTitle.classList.add(`nominate${i}`)
    movieTitle.classList.add('movieTitle')
    let movieNode = document.createTextNode(`${item.movieTitle}  (${item.year})`);
    movieTitle.appendChild(movieNode)
    let buttonSection = document.createElement('section')
    let nominateButton = document.createElement('button')
    let nominateButtonNode = document.createTextNode('Nominate')
    nominateButton.appendChild(nominateButtonNode)
    nominateButton.classList.add(`nominate${i}`)
    nominateButton.addEventListener("click", nominateSelection)

    buttonSection.appendChild(nominateButton)

    movieHeaderSec.appendChild(movieTitle)
    movieHeaderSec.appendChild(buttonSection)

    listItem.appendChild(movieHeaderSec)
    listItem.appendChild(movieDetailsSec)


    resultsList.appendChild(listItem)

  });

}

function movieSearch(){ // bring back all matches dating back to 2000
  const yearCheckEnd = 2014
  const currentYear = 2020
  const searchResults = []

  let title = document.querySelector('#titleInput').value.toString().trim() // assigns title input to title, removes white space around text
  let counter=0;

  if (document.querySelector('#output').classList!=="outputContainer"){
    resultsList.innerHTML=''
  }

  while(title.includes(" ")){   // for proper formatting before the request, adds + inbetween spaces
    title=title.replace(" ", `+`)
  }

    // brings back matches from each year ending at yearcheckend`
  for (let i= currentYear; i >= yearCheckEnd; i-- ){
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // fetch(proxyurl+`http://www.omdbapi.com/?s=${title}&apikey=`)
    //proxyurl+ below
    fetch(proxyurl +`www.omdbapi.com/?apikey=8ce696ca&t=${title}&y=${i}`)
      .then(response=>response.json())
      .then(data=>{
        // console.log(data);

        counter++
        if ( data.Response!== "False"){
          // if(data.Poster !== 'N/A'){
            searchResults.push({
              year : parseInt(data.Year),
              movieTitle : data.Title,
              actors : data.Actors,
              directors : data.Director,
              genre : data.Genre,
              plot : data.Plot,
              poster : data.Poster,
              production : data.Production,
              rated : data.Rated,
              country : data.Country,
              releaseDate: data.Released,
              runtime : data.Runtime,
              writers : data.Writer,
              imdbID : data.imdbID,
              imbdRating : data.imdbRating
            })
          // }
        }
        if (counter===(currentYear-yearCheckEnd)){
          showResults(searchResults);
        }
      })
  }
}

function getLocalNominations(){

  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  if (nominations.length>0) {
    document.querySelector('#output').classList.remove('hidden')
  }
  nominations.forEach((nomination, i) => {

    //counter
    nominationCount = nominations.length;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = nomination


    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)

    if (nominationCount===5){
      fullBallot();
    }
  });


}

function removeLocalNominations(nomination){
  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  const nominationIndex = nomination;
  nominations.splice(nominations.indexOf(nominationIndex), 1)
  localStorage.setItem('nominations', JSON.stringify(nominations)) // saves nomination array as 'nominations'

}

function saveLocalNomination(nomination){
  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  nominations.push(nomination);
  localStorage.setItem('nominations', JSON.stringify(nominations)) // saves nomination array as 'nominations'
}

titleInput.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    if(titleInput.value){
      movieSearch();
    }
    else{
      console.log('looks like you didnt enter a string');
    }
  }
});
