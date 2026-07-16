"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
const puestoRenderer = {
    asCard: function (puesto, hitos, rdps) {
        let fa = null;
        let mas = "";
        let variacion = "";
        let variacion_mensajes = "";
        let color = "";
        let posicion_anterior = puesto.posicion_anterior;
        if (puesto.variacion < 0) {
            fa = `<i class="fa-regular fa-circle-down fa-width-auto" style="color: rgb(220, 53, 69);"></i>`;
            variacion = puesto.variacion;
            variacion_mensajes = variacion;
            color = `style="color: rgb(220, 53, 69);"`;
        } else if (puesto.variacion == 0) {
            fa = `<i class="fa-regular fa-circle-pause fa-rotate-90" style="color: rgb(138, 138, 138);"></i>`;
            variacion_mensajes = "=";
        } else if (puesto.variacion > 0) {
            fa = `<i class="fa-regular fa-circle-up fa-width-auto" style="color: rgb(25, 135, 84);"></i>`;
            variacion = puesto.variacion;
            variacion_mensajes = variacion;
            color = `style="color: rgb(25, 135, 84);"`;
            mas = "+";
        } else if (puesto.es_entrada) {
            fa = `<i class="fa-solid fa-certificate" style="color: rgb(255, 193, 7);"></i>`;
            posicion_anterior = "-";
            variacion_mensajes = "N";
        } else if (puesto.es_reentrada) {
            fa = `<i class="fa-solid fa-certificate" style="color: rgb(255, 69, 7);"></i>`;
            posicion_anterior = "-";
            variacion_mensajes = "RE";
        }

        let hito = "";
        let hito_mensaje = "";
        if (hitos.smf_posicion == puesto.posicion) {
            hito = `<span class="badge rounded-pill bg-success">SMF</span>`;
            hito_mensaje = "SMF - ";
        } else if (hitos.bmf_posicion == puesto.posicion) {
            hito = `<span class="badge rounded-pill bg-danger">BMF</span>`;
            hito_mensaje = "BMF - ";
        } else if (hitos.emf_posicion == puesto.posicion) {
            hito = `<span class="badge rounded-pill bg-warning">EMF</span>`;
            hito_mensaje = "EMF - ";
        }

        let array = [];
        for (let rdp of rdps) {
            array.push(rdp.posicion);
        }

        let hito_rdp = "";
        let hito_rdp_mensaje = "";
        if (array.includes(puesto.posicion)) {
            hito_rdp = `<span class="badge rounded-pill bg-purple">RDP</span>`;
            hito_rdp_mensaje = "RDP - ";
        }

        let color_num = "";
        if (puesto.es_nuevo_peak) {
            color_num = `style="color: rgb(255, 170, 0);"`;
        }

        let num1 = "";
        if (puesto.es_numero_1) {
            num1 = `style="background-color: rgb(255, 236, 236);"`;
        }



        let html = `
<div class="card mb-3" ${num1}>
<div class="row m-0">
<div class="col-md-2" >
<h1 class="card-title" >${puesto.posicion}</h1>
<h4 class="card-text" ${color}>${fa} ${mas}${variacion}</h4>
<h4 class="card-text">${hito}</h4>
<h4 class="card-text">${hito_rdp}</h4>
</div>
<div class="col-md-2">
<img src="https://quinpart.com/imgs/placeholder.svg" class="img-fluid rounded h-100">
</div>
<div class="col-md-4 d-flex align-items-center">
<div class="card-body">
<h3 class="card-title">${puesto.titulo}</h3>
<p class="card-text">${puesto.artistas}</p>
</div>
</div>
<div class="col-md-3 d-flex align-items-center">
<div class="card-body">
<div class="d-flex justify-content-end gap-4 text-center align-items-center">
<div>
<p class="mb-1">Max:</p>
<p ${color_num}><i class="fa-solid fa-trophy"></i>  ${puesto.peak}</p>
</div>
<div>
<p class="mb-1">Sem:</p>
<p><i class="fa-solid fa-calendar"></i>  ${puesto.sem}</p>
</div>
<div>
<p class="mb-1">Ant:</p>
<p><i class="fa-solid fa-clock"></i>  ${posicion_anterior}</p>
</div>
</div>
</div>

<div class="col-md-1 d-flex align-items-center text-center">
<button class="btn btn-sm btn-outline-secondary" id="copiar-${puesto.posicion}">
    <i class="fa-regular fa-copy" style="color: rgb(132, 132, 132);"></i></button>
</div>

</div>`;

        let card = parseHTML(html);

        const boton = card.querySelector(`#copiar-${puesto.posicion}`);
        
        boton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(`${puesto.posicion}.‎ ${hito_rdp_mensaje}${hito_mensaje}${puesto.titulo.toUpperCase()} (${mas}${variacion_mensajes}) ${puesto.artistas}

Max. ${puesto.peak}, Sem. ${puesto.sem}

${puesto.youtube_url}`);
                
            } catch (err) {
                console.error(err);
            }
        });



        return card;
    },
    asCardSalida: function (salida) {



        let html = `
<div class="card mb-3 card-salida">
<div class="row m-0">
<div class="col-md-2" >
<h1 class="card-title" ><i class="fa-solid fa-xmark fa-xl" style="color: rgb(220, 53, 69);"></i> ${salida.posicion_anterior}</h1>
</div>
<div class="col-md-2">
<img src="https://quinpart.com/imgs/placeholder.svg" class="img-fluid rounded h-100">
</div>
<div class="col-md-4 d-flex align-items-center">
<div class="card-body">
<h3 class="card-title">${salida.titulo}</h3>
<p class="card-text">${salida.artistas}</p>
</div>
</div>
<div class="col-md-3 d-flex align-items-center">
<div class="card-body">
<div class="d-flex gap-4 text-center align-items-center">
<div>
<p class="mb-1">Max:</p>
<p><i class="fa-solid fa-trophy"></i>  ${salida.peak}</p>
</div>
<div>
<p class="mb-1">Sem:</p>
<p><i class="fa-solid fa-calendar"></i>  ${salida.sem}</p>
</div>
</div>
</div>

<div class="col-md-1 d-flex align-items-center text-center">
<button class="btn btn-sm btn-outline-secondary" id="copiar-salida-${salida.posicion_anterior}">
    <i class="fa-regular fa-copy" style="color: rgb(132, 132, 132);"></i></button>
</div>

</div>`;

        let card = parseHTML(html);

        const boton = card.querySelector(`#copiar-salida-${salida.posicion_anterior}`);
        
        boton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(`❌ ${salida.posicion_anterior}.‎ ${salida.titulo.toUpperCase()} (${salida.artistas})

Max. ${salida.peak}, Sem. ${salida.sem}

Recorrido: ${salida.recorrido}-X

${salida.youtube_url}`);
                
            } catch (err) {
                console.error(err);
            }
        });



        return card;
    }
};
export { puestoRenderer };