const titleInput = document.querySelector('#titleInput')
const resultsList = document.querySelector('.resultsList')
const nominationList = document.querySelector('.nominationsList')
let buttons = document.querySelector('button')
let nominationCount = 0;
let nominations = []

function fullBallot(){
  document.querySelector('#complete').classList.toggle("hidden");
  console.log('ballot');
}

function removeSelection(e){
  // let currentResultList = Object.entries(document.querySelectorAll('.resultsList'))
  let movieTitle = e.target.previousSibling.textContent
  let currentResultList = document.querySelector('.resultsList').children

  for(let i = 0; i < currentResultList.length; i++){
    if(currentResultList[`${i}`].id){
      if(currentResultList[`${i}`].innerHTML.includes(movieTitle)){
        currentResultList[`${i}`].childNodes[1].firstChild.classList.remove('opacity')
        currentResultList[`${i}`].id=""
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
    console.log(e.target.parentElement.parentElement.firstChild.textContent);
    console.log(!nominations.includes(e.target.parentElement.parentElement.firstChild.textContent));
    nominations.push(e.target.parentElement.parentElement.firstChild.textContent)
    console.log(!nominations.includes(e.target.parentElement.parentElement.firstChild.textContent));

    console.log(nominations);
    e.target.classList.add('opacity');
    // let nominationNumber = e.target.classList.value
    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = e.target.parentElement.previousSibling.textContent
    e.target.parentElement.parentElement.id= `${nominationCount}`
    console.log(e.target.parentElement.parentElement.id);

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
  //dom stuff
  document.querySelector('#output').classList.remove('hidden')

  inputSearch.textContent = `Results for... "${titleInput.value}"`

  results=results.sort( (a, b) => b.year - a.year)
  // console.log(results);

    // console.log(results[0])
    results.forEach((item, i) => {

    let listItem = document.createElement('li')
    let movieTitle = document.createElement('h3')
    movieTitle.classList.add(`nominate${i}`)
    let movieNode = document.createTextNode(`${item.movieTitle}  (${item.year})`);
    movieTitle.appendChild(movieNode)
    movieTitle.classList.add('movieTitle')
    let buttonSection = document.createElement('section')
    let nominateButton = document.createElement('button')
    let nominateButtonNode = document.createTextNode('Nominate')
    nominateButton.appendChild(nominateButtonNode)
    nominateButton.classList.add(`nominate${i}`)
    let arrowButton = document.createElement('p')
    arrowButton.innerHTML = `&nabla;`
    arrowButton.classList.add('arrow')
    // arrowButton.appendChild(arrowButtonNode)

    buttonSection.appendChild(nominateButton)
    buttonSection.appendChild(arrowButton)

    listItem.appendChild(movieTitle)
    listItem.appendChild(buttonSection)

    resultsList.appendChild(listItem)

    nominateButton.addEventListener("click", nominateSelection)



    // let actors = document.createElement('');
    // let director = document.createElement('');
    // let plot = document.createElement('');
    // let poster = document.createElement('');
    // let production = document.createElement('');
    // let rated = document.createElement('');
    // let country = document.createElement('');
    // let releaseDate = document.createElement('');
    // let runtime = document.createElement('');
    // let writers = document.createElement('');
    // let imdbID = document.createElement('');
    // let imbdRating = document.createElement('');
    // actors
    // director
    // plot
    // poster
    // production
    // rated
    // country
    // releaseDate
    // runtime
    // writers
    // imdbID
    // imbdRating
    //
    //
    // actors.classList.add('')
    // director.classList.add('')
    // plot.classList.add('')
    // poster.classList.add('')
    // production.classList.add('')
    // rated.classList.add('')
    // country.classList.add('')
    // releaseDate.classList.add('')
    // runtime.classList.add('')
    // writers.classList.add('')
    // imdbID.classList.add('')
    // imbdRating.classList.add('')

  });


}

function movieSearch(){ // bring back all matches dating back to 2000
  const yearCheckEnd = 1995
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

    // brings back matches from each year starting at `1965`
  for (let i= currentYear; i >= yearCheckEnd; i-- ){
    fetch(`http://www.omdbapi.com/?apikey=c2d156e8&t=${title}&y=${i}`)
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
