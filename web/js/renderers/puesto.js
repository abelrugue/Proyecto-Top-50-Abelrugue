"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
const puestoRenderer = {
    asCard: function (puesto) {
        let html = `
<div class="card mb-3">
<div class="row m-0">
<div class="col-md-4">
<h1 class="card-title">${puesto.posicion}</h1>
</div>
<div class="col-md-4 d-flex align-items-center">
<div class="card-body">
<h3 class="card-title">${puesto.titulo}</h3>
<p class="card-text">${puesto.artistas}</p>
</div>
</div>
<div class="col-md-4 d-flex align-items-end">
<div class="card-body">
<div class="col-md-1">
<p class="card-text">Max:</p>
<p class="card-text"><i class="fa-solid fa-trophy"></i>${puesto.peak}</p>
</div>
<div class="col-md-1">
<p class="card-text">Sem:</p>
<p class="card-text"><i class="fa-solid fa-calendar"></i>${puesto.sem}</p>
</div>
<div class="col-md-1">
<p class="card-text">Ant:</p>
<p class="card-text"><i class="fa-solid fa-clock"></i>${puesto.posicion_anterior}</p>
</div>
</div>
</div>`;
        let card = parseHTML(html);
        
        return card;
    },
};
export { puestoRenderer };