"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {

        let form = document.getElementById("peak-form");
        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();
                buscar();
            });

            const params = new URLSearchParams(window.location.search);

            const peak = params.get("peak") ?? 1;

            document.getElementById("peak-input").value = peak;

            await asCardGallery(peak);
        }

        
        

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}

function buscar() {
    const peak = document.getElementById("peak-input").value;
    if (!peak) return;

    history.pushState({}, "", `?peak=${peak}`);

    const lista = document.getElementById("body-peak");
    lista.replaceChildren();

    asCardGallery(peak);
}


async function asCardGallery(peak) {
    let bodyDiv = document.getElementById("body-peak");

    let { data, error } = await supabase
        .from("vista_canciones")
        .select("*")
        .eq("peak", peak)
        .order("fecha_peak");
    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion, "entradas");
    }
    document.getElementById("title-peak-x").innerHTML = `Buscar por peak: #${peak}`;
    bodyDiv.innerHTML = html;
}


document.addEventListener("DOMContentLoaded", main);