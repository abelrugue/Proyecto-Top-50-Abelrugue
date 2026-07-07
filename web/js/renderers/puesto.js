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
<p class="card-text">Max: ${puesto.peak}</p>
<p class="card-text">Sem: ${puesto.sem}</p>
<p class="card-text">Ant: ${puesto.posicion_anterior}</p>
<a class="btn btn-primary"
href="/create_puesto.html?puestoId=${puesto.puestoId}">Edit</a>
</div>
</div>
</div>
</div>`;
        let card = parseHTML(html);
        console.log(card);
        return card;
    },
};
export { puestoRenderer };