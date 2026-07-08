"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";

async function main() {
    try {

        let bodyDiv = document.getElementById("body");
        bodyDiv.innerHTML += await asCardGallery();

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}

async function asCardGallery() {

        let inputname = document.getElementById("name-input");

        let btn = document.getElementById("btn");

        btn.addEventListener("click", async () => {
            let { data, error } = await supabase
                .from("vista_artista_canciones")
                .select("*")
                .eq("nombre", inputname.value.trim())
                .order("fecha_debut");

            let html = '';
            for (let cancion of data) {
                html += cancionRenderer.asCard(cancion);
            }
            
        });

        return html;


    }



document.addEventListener("DOMContentLoaded", main);