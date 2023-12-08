let pokemonId = 20;
let pokemons = [];
let loadLimit = 3;
let endOfPage = false;
let urls = [];
const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

async function renderUrl() {
    for (let i = 0; i <= pokemonId; i++) {
        let id = i;
        // let url = `https://pokeapi.co/api/v2/pokemon/${id}?limit=3`;
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        urls.push(url);
    }
    loadPokemonJson();
}

async function loadPokemonJson(morePokemon) {
    if (morePokemon) {
        let j = (k = pokemons.length + 1);
        for (j; j <= k - 1 + loadLimit && j <= pokemonId; j++) {
            let url = urls[j];
            await loadPokemonJsonLoop(url);
        }
    } else {
        for (let i = 1; i <= loadLimit && i <= pokemonId; i++) {
            let url = urls[i];
            await loadPokemonJsonLoop(url);
        }
    }
    renderPokemon();
}

async function loadPokemonJsonLoop(url) {
    let response = await fetch(url);
    let pokemon = await response.json();
    pokemons.push(pokemon);
    console.log(pokemon);
}

function renderPokemon() {
    let content = document.getElementById("content");
    content.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {
        let currentPokemon = pokemons[i];
        content.innerHTML += generateHtmlRenderPokemon(i);

        renderPokemonElement(currentPokemon, i, "");
    }
}

function generateHtmlRenderPokemon(i) {
    return `
    <div class="render-pokemon" id="renderPokemon${i}" onmouseover="handleHover(this)" onmouseout="handleHover(this)" onclick="showPokemonCard(${i})">
        <div class="hover-overlay"></div>
        <h1 class="pokemon-name" id="pokemonName${i}">Name</h1>

        <div class="type-id-position">
            <span id="type${i}" class="render-type"></span>
            <div id="pokemonID${i}" class="render-pokemon-id"></div>
        </div>

        <div class="render-pokeball-bg"></div>

        <div class="render-pokemon-image-size">
            <img class="render-pokemon-image" id="pokemonImage${i}">
        </div>
    </div>`;
}

function renderPokemonElement(currentPokemon, i, show) {
    document.getElementById(`${show}pokemonName${i}`).innerHTML = currentPokemon["name"];
    document.getElementById(`${show}pokemonImage${i}`).src =
        currentPokemon["sprites"]["other"]["dream_world"]["front_default"];
    document.getElementById(`${show}pokemonID${i}`).innerHTML = formateNumber(currentPokemon["id"]);

    let pokemonBgColor = document.getElementById(`${show}renderPokemon${i}`);
    let pokemonType = document.getElementById(`${show}type${i}`);
    pokemonType.innerHTML = currentPokemon["types"][0]["type"]["name"];

    whichColorBgPokemon(pokemonBgColor, pokemonType);
}

function whichColorBgPokemon(pokemonBgColor, pokemonType) {
    if (pokemonType.innerHTML in typeColors) {
        pokemonBgColor.style.backgroundColor = typeColors[pokemonType.innerHTML];
    } else {
        pokemonBgColor.style.backgroundColor = "gray";
    }
}

function formateNumber(zahl) {
    if (zahl >= 1 && zahl <= 151) {
        return `#${zahl.toString().padStart(3, "0")}`;
    }
}

// Hovern PokemonCard
function handleHover(element) {
    element.querySelector(".hover-overlay").classList.toggle("hover-element");
}

// Dialog bauen>> ShowPokemonCard
function showPokemonCard(i) {
    document.getElementById("showPokemonCard").classList.remove("d-none");
    let pokemonCardInfo = document.getElementById("pokemonCardInfo");
    let show = "show";
    let currentPokemon = pokemons[i];
    pokemonCardInfo.innerHTML = "";
    pokemonCardInfo.innerHTML = `
        <span class="material-symbols-outlined mso-arrow" onclick="backPokemonCard(${i}); NotClosePokemonCard(event)" >arrow_back_ios_new</span>
        <div id="pokedex" onclick="NotClosePokemonCard(event)">
            <div class="pokedex-header" id="${show}renderPokemon${i}">
            <span class="material-symbols-outlined mso-close" onclick="closePokemonCard()">close</span>
            <h1 class="pokemon-name pokemon-name-card z-index" id="${show}pokemonName${i}">Name</h1>
            <div class ="card-position">
                <div class="pekedex-header-left">
                    <div class ="card-position-typeId"> 
                        <div class="render-type margin-top z-index" id="${show}type${i}">#</div>
                        <div class="render-pokemon-id margin-top z-index" id="${show}pokemonID${i}">#</div>
                    </div>
                    <div class="opasity-pokeball"></div>
                </div>
            
                <div class="pekedex-header-right">
                    <img class="render-pokemon-image" id="${show}pokemonImage${i}">
                </div>
            </div>
            </div>
    
            <div class="info-field" >
            <div class="tab-container">
              <div class="tab-item" id="${show}aboutTab${i}" onclick="switchTab('aboutTab${i}', '${show}')">About</div>
              <div class="tab-item" id="${show}statsTab${i}" onclick="switchTab('statsTab${i}', '${show}')">Stats</div>
            
              <div class="tab-item" id="${show}moveTab${i}" onclick="switchTab('moveTab${i}', '${show}')">Moves</div>
            </div>
            
            <div class="tab-content" id="aboutTab${i}">
                <div class="aboutPokemon"> 
                    <table>
                        <tr>
                            <td><b>Experience:</b></td>
                            <td><span id="aboutExperience${i}"></span></td>
                        </tr>
                        <tr>
                            <td><b>Height:</b></td>
                            <td><span id="aboutHeight${i}"></span></td>
                        </tr>
                        <tr>
                            <td><b>Weight:</b></td>
                            <td><span id="aboutWeight${i}"></span></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="statsTab${i}">
                <div class = "statsPokemon">
                    <canvas id="myChart"></canvas>
                </div>
            </div>

            




            <div class="tab-content" id="moveTab${i}">
                <ul class="moveContent" id="moveContent${i}"></ul>
            </div>
          </div>
          
        </div>
        <span class="material-symbols-outlined mso-arrow" onclick="forwardPokemonCard(${i}); NotClosePokemonCard(event)" >arrow_forward_ios</span>
        `;

    renderPokemonElement(currentPokemon, i, show);
    switchTab("aboutTab" + i, show);
    renderAboutPokemon(currentPokemon, i);
    renderStatsPokemon(currentPokemon, i);
    renderMovePokemon(currentPokemon, i);
}
//   <div class="tab-item" id="${show}evolutionTab${i}" onclick="switchTab('evolutionTab${i}', '${show}')">Evolution</div>

// <div class="tab-content" id="evolutionTab${i}">
//     <div class="evolutionImage">
//         <img id="evolutionImage${i + 1}">
//         <img id="evolutionImage${i + 2}">
//         <img id="evolutionImage${i + 3}">
//     </div>
// </div>

function renderAboutPokemon(currentPokemon, i) {
    document.getElementById(`aboutExperience${i}`).innerHTML = currentPokemon["base_experience"];
    document.getElementById(`aboutHeight${i}`).innerHTML = `${currentPokemon["height"] / 10} m`;
    document.getElementById(`aboutWeight${i}`).innerHTML = `${currentPokemon["weight"] / 10} kg`;
}

function renderStatsPokemon(currentPokemon, i) {
    let base_stat = [];
    let name_stat = [];
    for (let i = 0; i < currentPokemon["stats"].length; i++) {
        let stat = currentPokemon["stats"][i]["base_stat"];
        base_stat.push(stat);
        let name = currentPokemon["stats"][i]["stat"]["name"];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        name_stat.push(name);
    }
    renderChart(base_stat, name_stat);
}

function renderMovePokemon(currentPokemon, i) {
    let moveContent = document.getElementById(`moveContent${i}`);
    moveContent.innerHTML = "";
    for (let i = 0; i < currentPokemon["moves"].length; i++) {
        let move = currentPokemon["moves"][i]["move"]["name"];
        move = move.charAt(0).toUpperCase() + move.slice(1);
        moveContent.innerHTML += `<li>${move}</li>`;
    }
}

// Tabulator Infobox
function switchTab(tabName, show) {
    console.log(show + tabName);
    let allTabs = document.querySelectorAll(".tab-content");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    let allItem = document.querySelectorAll(".tab-item");
    allItem.forEach((item) => item.classList.remove("itemDesign"));

    let selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active");
    let selectedItem = document.getElementById(show + tabName);
    selectedItem.classList.add("itemDesign");
}

function backPokemonCard(i) {
    if (i > 0) {
        i--;
        showPokemonCard(i);
    } else {
        i = pokemons.length - 1;
        showPokemonCard(i);
    }
}

function forwardPokemonCard(i) {
    if (i < pokemons.length - 1) {
        i++;
        showPokemonCard(i);
    } else {
        i = 0;
        showPokemonCard(i);
    }
}

function closePokemonCard() {
    document.getElementById("showPokemonCard").classList.add("d-none");
}

// Scroll to Begin
function scrollToBegin() {
    scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// stopPropagation
function NotClosePokemonCard(event) {
    event.stopPropagation();
}

// Window-Scroll
let lastScrollPosition = 0;

window.addEventListener("scroll", async function () {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > lastScrollPosition) {
        if ((await isEndOfPage()) && endOfPage == false) {
            LoadingPokemonKeyframe("add");
            endOfPage = true;

            setTimeout(async function () {
                await onEndOfPage();
                LoadingPokemonKeyframe("remove");
            }, 1000);
        }
    }
    lastScrollPosition = currentScrollPosition;
});

function LoadingPokemonKeyframe(x) {
    let elements = document.querySelectorAll(".render-pokemon");
    elements.forEach(function (element) {
        element.classList[x]("loading");
    });
}

async function isEndOfPage() {
    return window.innerHeight + window.scrollY + 25 >= document.body.offsetHeight;
}

async function onEndOfPage() {
    await loadPokemonJson(true);
    endOfPage = false;
}

// Search-Filter:
function filterNames() {
    let search = document.getElementById("search").value.trim().toLowerCase();
    let content = document.getElementById("content");
    content.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];
        let pokemonName = pokemon["name"].toLowerCase();
        let pokemonNumber = pokemon["id"].toString();

        if (pokemonName.includes(search) || pokemonNumber.includes(search)) {
            content.innerHTML += generateHtmlRenderPokemon(i);
            renderPokemonElement(pokemon, i, "");
        }
    }
}

// Template
async function init() {
    await includeHTML();
    await renderUrl();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}
