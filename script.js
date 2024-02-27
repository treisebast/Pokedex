let pokemonId = 649;
let pokemons = [];
let loadLimit = 50;
let endOfPage = true;
let batchUrls = [];
let loadMore = false;
let firstPokemonLoad = false;

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

async function init() {
    await includeHTML();
    await renderUrl();
}

async function renderUrl() {
    for (let i = 1; i <= loadLimit; i++) {
        await generateUrlAndBatch(i);
    }
    endOfPage = false;
    renderPokemon();
    firstPokemonLoad = true;
}

async function loadMorePokemon() {
    if (loadMore === true && firstPokemonLoad === true) {
        toggleLoadingButton();
        loadMore = false;
        let j = (k = pokemons.length + 1);
        for (j; j <= k - 1 + loadLimit && j <= pokemonId; j++) {
            await generateUrlAndBatch(j);
        }
    }
    endOfPage = false;
    renderPokemon();
}

async function generateUrlAndBatch(x) {
    let url = `https://pokeapi.co/api/v2/pokemon/${x}`;
    batchUrls.push(url);
    if (batchUrls.length === loadLimit || x === pokemonId) {
        await loadPokemonJsonBatch(batchUrls);
        batchUrls = [];
    }
}

async function loadPokemonJsonBatch(urls) {
    return Promise.all(urls.map((url) => fetch(url)))
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((jsons) => {
            pokemons.push(...jsons);
        })
        .catch((error) => {
            console.error("Fehler beim Laden der Pokemon:", error);
        });
}

function renderPokemon() {
    let content = document.getElementById("content");
    content.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {
        let currentPokemon = pokemons[i];
        content.innerHTML += generateHtmlRenderPokemon(i);

        renderPokemonElement(currentPokemon, i, "");
    }
    toggleLoadingButton();
}

function renderPokemonElement(currentPokemon, i, show) {
    document.getElementById(`${show}pokemonName${i}`).innerHTML = currentPokemon["name"];
    document.getElementById(`${show}pokemonImage${i}`).src =
        currentPokemon["sprites"]["other"]["dream_world"]["front_default"];
    document.getElementById(`${show}pokemonID${i}`).innerHTML = formateNumber(currentPokemon["id"]);

    let pokemonBgColor = document.getElementById(`${show}renderPokemon${i}`);
    let pokemonType = document.getElementById(`${show}types${i}`);
    for (let j = 0; j < currentPokemon["types"].length; j++) {
        let type = currentPokemon["types"][j];
        pokemonType.innerHTML += `<div class="render-type">${type["type"]["name"]}</div>`;
    }
    whichColorBgPokemon(currentPokemon, pokemonBgColor, pokemonType);
}

function whichColorBgPokemon(currentPokemon, pokemonBgColor, pokemonType) {
    if (currentPokemon["types"].length === 1) {
        const type = currentPokemon["types"][0]["type"]["name"];
        if (type in typeColors) {
            pokemonBgColor.style.backgroundColor = typeColors[type];
        } else {
            pokemonBgColor.style.backgroundColor = "gray";
        }
    } else if (currentPokemon["types"].length === 2) {
        const type1 = currentPokemon["types"][0]["type"]["name"];
        const type2 = currentPokemon["types"][1]["type"]["name"];

        if (type1 in typeColors && type2 in typeColors) {
            pokemonBgColor.style.background = `linear-gradient(to bottom right, ${typeColors[type1]}, ${typeColors[type2]})`;
        } else {
            pokemonBgColor.style.backgroundColor = "gray";
        }
    } else {
        pokemonBgColor.style.backgroundColor = "gray";
    }
}

function formateNumber(zahl) {
    if (zahl >= 1 && zahl <= pokemonId) {
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
    pokemonCardInfo.innerHTML = generateHtmlRenderPokedexCard(show, i);
    renderingFunctions(currentPokemon, i, show);
}

function renderingFunctions(currentPokemon, i, show) {
    renderPokemonElement(currentPokemon, i, show);
    switchTab("aboutTab" + i, show);
    renderAboutPokemon(currentPokemon, i);
    renderStatsPokemon(currentPokemon, i);
    renderMovePokemon(currentPokemon, i);
}

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

// Tab Fenster InfoField
function switchTab(tabName, show) {
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

// Window-Scroll-End-of-Page-Pokemonload
let lastScrollPosition = 0;

window.addEventListener("scroll", async function () {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > lastScrollPosition) {
        if ((await isEndOfPage()) && endOfPage == false) {
            endOfPage = true;
            LoadingPokemonKeyframe("add");

            (async function () {
                await onEndOfPage();
                LoadingPokemonKeyframe("remove");
            })();
        }
    }
    lastScrollPosition = currentScrollPosition;
});

function LoadingPokemonKeyframe(x) {
    let elements = document.querySelectorAll(".render-pokemon");
    elements.forEach(function (element) {
        element.classList[x]("loading");
        document.getElementById("btnLoadPokemon").classList[x]("d-none");
    });
}

async function isEndOfPage() {
    return window.innerHeight + window.scrollY + 25 >= document.body.offsetHeight;
}

async function onEndOfPage() {
    loadMore = true;
    toggleLoadingButton();
    await loadMorePokemon();
}

function toggleLoadingButton() {
    let button = document.getElementById('btnLoadPokemon');
    if (button.innerHTML === 'Weitere Pokemon´s laden') {
        button.innerHTML = 'Pokemon´s werden geladen...';
    } else {
        button.innerHTML = 'Weitere Pokemon´s laden';
    }
}


// Toggle Search-Inputfield
function toggleSearch(show = true) {
    let searchInput = document.getElementById("inputField");
    let searchIcon = document.getElementById("searchIcon");
    let closeIcon = document.getElementById("closeIcon");

    if (show) {
        searchInput.style.display = "inline-block";
        searchIcon.style.display = "none";
        closeIcon.style.display = "inline-block";
    } else {
        searchInput.style.display = "none";
        searchIcon.style.display = "inline-block";
        closeIcon.style.display = "none";
    }
}

// Search-Filter:
function filterNames(x) {
    let search = document.getElementById(`inputField${x}`).value.trim().toLowerCase();
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
