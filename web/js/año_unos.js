"use strict";

import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        document.getElementById("año-unos-form").addEventListener("submit", e => {
            e.preventDefault();
            buscar();
        });

        const params = new URLSearchParams(window.location.search);

        const año = params.get("año") ?? 2026;

        document.getElementById("año-input").value = año;

        await cargarLista(año);



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


function buscar() {
    const año = document.getElementById("año-input").value;
    if (!año) return;

    history.pushState({}, "", `?año=${año}`);

    const lista = document.getElementById("div-año-unos");
    lista.replaceChildren();

    cargarLista(año);


}

async function cargarLista(año) {

    document.getElementById("title-año-unos").innerHTML = `Números 1 de ${año}`;

    let { data, error } = await supabase
        .rpc("vista_numeros_1", {
            anio: año
        });


    if (error) throw error;

    const bodyDiv = document.getElementById("div-año-unos");

    let html_total = '';
    for (let cancion of data) {
        html_total += asCard(cancion);
    }

    bodyDiv.innerHTML = html_total;

}

function asCard(cancion) {

    let html = `
        <div class="card mb-2 p-1">
            <div class="row g-1 align-items-center m-0">
                <div class="col-2 col-md-2 text-center" >
                    <h1 class="card-title" >${cancion.num_semana}</h1>
                </div>
                <div class="col-2 col-md-2">
                    <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                    class="img-fluid rounded w-100 h-100 object-fit-cover">
                </div>
                <div class="col-5 col-md-5 d-flex align-items-center">
                    <div class="card-body">
                        <h3 class="card-title">${cancion.titulo}</h3>
                        <p class="card-text">${cancion.artistas}</p>

                    </div>
                </div>
                    <div class="col-3 col-md-3 d-flex align-items-end">
                        <div class="col-2 col-md-2 text-center" >
                        <h3 class="card-title" >${cancion.fecha}</h3>
                    </div>
                </div>


            </div>
        </div>
        `;

    return html;

}

document.addEventListener("DOMContentLoaded", main);
