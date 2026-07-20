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

async function asCard(cancion) {

    let html = `
            <div class="card mb-2 p-1">
                <div class="row g-1 align-items-center m-0">

                    <div class="col-4 col-md-4">
                        <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                        class="img-fluid rounded w-100 h-100 object-fit-cover">
                    </div>

                    <div class="col-8 col-md-8 d-flex align-items-center">
                        <div class="card-body">
                            <h3 class="card-title">${cancion.titulo}</h3>
                            <p class="card-text">${cancion.artistas}</p>

                            <ul>
                                <li>
                                    <p class="card-text">Max: <i class="fa-solid fa-trophy"></i> ${cancion.peak}</p>
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
                            </ul>
    
                        </div>
                    </div>
                </div>
            </div>
            `;

            return html;

}



document.addEventListener("DOMContentLoaded", main);