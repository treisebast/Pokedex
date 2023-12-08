function generateHtmlRenderPokemon(i) {
    return `
    <div class="render-pokemon" id="renderPokemon${i}" onmouseover="handleHover(this)" onmouseout="handleHover(this)" onclick="showPokemonCard(${i})">
        <div class="hover-overlay"></div>
        <h1 class="pokemon-name" id="pokemonName${i}">Name</h1>

        <div class="type-id-position">
            <div id="types${i}" class="render-types"></div>
            <div id="pokemonID${i}" class="render-pokemon-id"></div>
        </div>

        <div class="render-pokeball-bg"></div>

        <div class="render-pokemon-image-size">
            <img class="render-pokemon-image" id="pokemonImage${i}">
        </div>
    </div>`;
}

function generateHtmlRenderPokedexCard(show, i) {
    return `
        ${generateHtmlHeaderPokedexCard(show, i)};
        ${generateHtmlInfoFieldPokedexCard(show, i)};
    `;
}

function generateHtmlHeaderPokedexCard(show, i) {
    return `
    <span class="material-symbols-outlined mso-arrow mso-arrow-left" onclick="backPokemonCard(${i}); NotClosePokemonCard(event)" >arrow_back_ios_new</span>
    <div id="pokedex" onclick="NotClosePokemonCard(event)">
        <div class="pokedex-header" id="${show}renderPokemon${i}">
        <span class="material-symbols-outlined mso-close" onclick="closePokemonCard()">close</span>
        <h1 class="pokemon-name pokemon-name-card z-index" id="${show}pokemonName${i}">Name</h1>
        <div class ="card-position">
            <div class="pekedex-header-left">
                <div class ="card-position-typeId"> 
                    <div class="margin-top z-index" id="${show}types${i}"></div>
                    <div class="render-pokemon-id margin-top z-index" id="${show}pokemonID${i}">#</div>
                </div>
                <div class="opasity-pokeball"></div>
            </div>
        
            <div class="pekedex-header-right">
                <img class="render-pokemon-image" id="${show}pokemonImage${i}">
            </div>
        </div>
        </div>`;
}

function generateHtmlInfoFieldPokedexCard(show, i){
return`
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
        <span class="material-symbols-outlined mso-arrow mso-arrow-right" onclick="forwardPokemonCard(${i}); NotClosePokemonCard(event)" >arrow_forward_ios</span>`;
}


//   <div class="tab-item" id="${show}evolutionTab${i}" onclick="switchTab('evolutionTab${i}', '${show}')">Evolution</div>

// <div class="tab-content" id="evolutionTab${i}">
//     <div class="evolutionImage">
//         <img id="evolutionImage${i + 1}">
//         <img id="evolutionImage${i + 2}">
//         <img id="evolutionImage${i + 3}">
//     </div>
// </div>