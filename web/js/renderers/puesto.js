"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
const puestoRenderer = {
    asCard: function (puesto) {
        let fa = null;
        let mas = "";
        console.log(puesto.variacion);
        if(puesto.variacion==null){
            fa = `<i class="fa-solid fa-circle-n" style="color: rgb(255, 200, 0);"></i>`;
        }else if(puesto.variacion<0){
            fa = `<i class="fa-regular fa-circle-down fa-width-auto" style="color: rgb(210, 3, 3);"></i>`;
        }else if(puesto.variacion==0){
            fa = `<i class="fa-solid fa-equals fa-width-auto" style="color: rgb(138, 138, 138);"></i>`;
        }else if(puesto.variacion>0){
            fa = `<i class="fa-regular fa-circle-up fa-width-auto" style="color: rgb(29, 183, 0);"></i>`;
            mas = "+";
        }

        let html = `
<div class="card mb-3">
<div class="row m-0">
<div class="col-md-4">
<h1 class="card-title">${puesto.posicion}</h1>
<h1 class="card-text">${fa} ${mas}${puesto.variacion}</h1>
</div>
<div class="col-md-4 d-flex align-items-center">
<div class="card-body">
<h3 class="card-title">${puesto.titulo}</h3>
<p class="card-text">${puesto.artistas}</p>
</div>
</div>
<div class="col-md-4 d-flex align-items-end">
<div class="card-body">
<div class="d-flex justify-content-end gap-4 text-center">
<div>
<p class="mb-1">Max:</p>
<p"><i class="fa-solid fa-trophy"></i>  ${puesto.peak}</p>
</div>
<div>
<p class="mb-1">Sem:</p>
<p"><i class="fa-solid fa-calendar"></i>  ${puesto.sem}</p>
</div>
<div>
<p class="mb-1">Ant:</p>
<p"><i class="fa-solid fa-clock"></i>  ${puesto.posicion_anterior}</p>
</div>
</div>
</div>
</div>`;
        let card = parseHTML(html);
        
        return card;
    },
};
export { puestoRenderer };