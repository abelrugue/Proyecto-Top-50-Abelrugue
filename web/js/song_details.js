"use strict";

import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {

        let btn = document.getElementById("btn-song-details");
        if (btn) {
            btn.addEventListener("click", asCardGallery);
        }


    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}

async function asCardGallery() {
    let inputname = document.getElementById("cancion-input");
    let bodyDiv = document.getElementById("song-div");

    let { data, error } = await supabase
        .from("vista_canciones")
        .select("*")
        .eq("titulo", inputname.value.trim())
        .order("fecha_debut");
    let html_total = '';
    for (let cancion of data) {
        html_total += asCard(cancion);
    }
    
    bodyDiv.innerHTML = html_total;
}

function asCard(cancion) {

    let repeticion = "";
        if (cancion.numeros_1 > 1){
            repeticion = `x${cancion.numeros_1}`
        }

    let html = `
            <br>
            <div class="card mb-2 p-1">
                <div class="row g-1 align-items-center m-0 d-none d-md-flex">

                    <div class="col-md-4">
                        <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                        class="img-fluid rounded w-100 h-100 object-fit-cover">
                    </div>

                    <div class="col-md-8 d-flex align-items-center">
                        <div class="card-body">
                            <h1 class="card-title">${cancion.titulo}</h1>
                            <h4 class="card-text">${cancion.artistas}</h4>

                            <ul>
                                <li>
                                    <p class="card-text">Max: <i class="fa-solid fa-trophy"></i> ${cancion.peak}${repeticion}</p>
                                </li>
                                <li>
                                    <p class="card-text">Sem: <i class="fa-solid fa-calendar"></i> ${cancion.sem}</p>
                                </li>
                                <li>
                                    <p class="card-text">Punt: ${cancion.puntuacion}</p>
                                </li>
                                <li>
                                    <p class="card-text">Recorrido: ${cancion.recorrido}</p>
                                </li>
                                <li>
                                    <p class="card-text">Semanas top 5: ${cancion.top_5}</p>
                                </li>
                                <li>
                                    <p class="card-text">Semanas top 10: ${cancion.top_10}</p>
                                </li>
                                <li>
                                    <p class="card-text">Fecha debut: ${cancion.fecha_debut}</p>
                                </li>
                                <li>
                                    <p class="card-text">Fecha peak: ${cancion.fecha_peak}</p>
                                </li>
                            </ul>
    
                        </div>
                    </div>
                </div>

                <div class="d-md-none">

                    <div class="row g-2 align-items-center">

                        <div class="col-4">
                            <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                            class="img-fluid rounded w-100 object-fit-cover">
                        </div>

                        <div class="col-8">
                            <h3 class="card-title mb-1">${cancion.titulo}</h3>
                            <h5 class="card-text">${cancion.artistas}</h5>
                        </div>

                    </div>

                    <ul class="mt-2 mb-1">
                        <li>
                            <p class="card-text">Max: <i class="fa-solid fa-trophy"></i> ${cancion.peak}${repeticion}</p>
                        </li>
                        <li>
                            <p class="card-text">Sem: <i class="fa-solid fa-calendar"></i> ${cancion.sem}</p>
                        </li>
                        <li>
                            <p class="card-text">Punt: ${cancion.puntuacion}</p>
                        </li>
                        <li>
                            <p class="card-text">Recorrido: ${cancion.recorrido}</p>
                        </li>
                        <li>
                            <p class="card-text">Semanas top 5: ${cancion.top_5}</p>
                        </li>
                        <li>
                            <p class="card-text">Semanas top 10: ${cancion.top_10}</p>
                        </li>
                        <li>
                            <p class="card-text">Fecha debut: ${cancion.fecha_debut}</p>
                        </li>
                        <li>
                            <p class="card-text">Fecha peak: ${cancion.fecha_peak}</p>
                        </li>
                    </ul>

                </div>



            </div>

            <div class="card mb-2 p-1">

                <!-- MÓVIL -->
                <div class="d-md-none">

                    <div class="row g-2 align-items-center">

                        <div class="col-4">
                            <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA'
                                ? cancion.portada_url
                                : 'https://quinpart.com/imgs/placeholder.svg'}"
                                class="img-fluid rounded w-100 object-fit-cover">
                        </div>

                        <div class="col-8">
                            <h3 class="card-title mb-1">${cancion.titulo}</h3>
                            <h5 class="card-text">${cancion.artistas}</h5>
                        </div>

                    </div>

                    <ul class="mt-2 mb-1">
                        ...
                    </ul>

                </div>

            </div>
            `;

            return html;

}



document.addEventListener("DOMContentLoaded", main);