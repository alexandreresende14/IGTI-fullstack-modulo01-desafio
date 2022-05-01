// Global variables to use throughout the code.
let allPeople = [];
let filteredPeople= [];
let searchTyping = null;
let isSearching = false;


let inputSearch = null;
let buttonSearch = null;
let foundUsers = null;
let foundStatics = null;

let tabdUsers = null;
let tabStatics = null;

let countMale = null;
let countFemale = null;
let ageSum = null;
let ageAverage = null;


// Function to load the page, map the html elements and initialize the app.

window.addEventListener('load', () => {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('#buttonSearch');
  foundUsers = document.querySelector('#foundUsers');
  foundStatics = document.querySelector('#foundStatics');
  
  tabdUsers = document.querySelector('#tabUsers');
  tabStatics = document.querySelector('#tabStatics');
  
  doFetch();
  preventFormSubmit();
  inputSearch.focus();
})

// function to prevent the page's restart after a submit.
function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  
  let form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}
/*
  Get the api data utilizing async await, filling in the array "allPeople" with the api data.
  Method map() to return only the necessary information from the api.
  Call the function render() responsible to call the others functions.
*/
async function doFetch() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();
  allPeople = json.results.map(person => {
    const { name, picture, dob, gender } = person;
    
    return {
      name: `${name.first} ${name.last}`,
      age: dob.age,
      gender,
      picture
    };
  });  
  render();
}

// function render() to call the others methods.
function render() {
  filteringPeopleList();
  renderFilteredPeople();
  renderFilteredList();
  renderStaticsList();

  clearInput();
}

/*
  This function is responsable for monitoring the typing and click events
  Once you start typing, the button change from disabled to activeted.
  When you delete the input text, the button change to disabled again.
*/
function renderFilteredPeople() {
  function handleInputSearch(event) {
    buttonSearch.disabled = false;
    searchTyping = event.target.value;
    isSearching = true;

    if(searchTyping ==='') {
      buttonSearch.disabled = true;
      isSearching = false;
    }
    
    if(event.key === 'Enter') {
      render();
    }
  }

  function handleClickSearch() {
    isSearching = true;
    render();
  }

  inputSearch.addEventListener('keyup', handleInputSearch);
  buttonSearch.addEventListener('click', handleClickSearch);
}

// Fill the users table with the filtered list
function renderFilteredList() {
  if(isSearching) {
    
    let peopletHTML = '<div>';

    filteredPeople.forEach(person => {
      const { name, picture, age } = person;

      const createPersonHTMl = `
        <div class="flex-row">
          <img src="${picture.thumbnail}" alt="${name}" />
          <span> ${name}, ${age} anos</span>
        </div>
      `;
      
      peopletHTML += createPersonHTMl;
    });
    peopletHTML += '</div>';
    tabdUsers.innerHTML = peopletHTML;

    CountUsers();
  }
}

// Fill the statics from the filtered list
function renderStaticsList() {
  if(isSearching) {
    countStatics();

    const createStaticsHTML = `
    <ul>
      <li>Sexo masculino: ${countMale}</li>
      <li>Sexo feminino: ${countFemale}</li>
      <li>Somda das idades: ${ageSum}</li>
      <li>Média das idades: ${ageAverage}</li>
    </ul>
  `;

  tabStatics.innerHTML = createStaticsHTML;
  }
}
/*
  Filling in the empty list "filteredPeople" with the input text filter.
  The filered is list is ordened.
*/
function filteringPeopleList() {
  if(isSearching) {
    filteredPeople = allPeople.filter(person => {
      return person.name.toLowerCase().includes(searchTyping);
    });
  }

  filteredPeople.sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
}

function CountUsers() {
  let countUsers = filteredPeople.length;
  
  foundUsers.textContent = `${countUsers} usuário(s) encontrado(s)`;
}

function countStatics() {
  const filteredMale = filteredPeople.filter(person => person.gender === 'male');
  const filteredFemale = filteredPeople.filter(person => person.gender === 'female');

  countMale = filteredMale.length;
  countFemale = filteredFemale.length;

  ageSum = filteredPeople.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);
  ageAverage = ageSum / filteredPeople.length || 0;

  foundStatics.textContent = 'Estatísticas';
}

// Function to clear the input text, disabled the button and putting focus in the input area.
function clearInput() {
  inputSearch.value = '';
  inputSearch.focus();

  isSearching = false;
  buttonSearch.disabled = true;
}
