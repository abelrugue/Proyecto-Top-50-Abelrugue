"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {

        let btn = document.getElementById("btn");

        btn.addEventListener("click", asCardGallery);

        

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}

async function asCardGallery() {

    let inputname = document.getElementById("name-input");

    let bodyDiv = document.getElementById("body");
        


    let { data, error } = await supabase
        .from("vista_artista_canciones")
        .select("*")
        .eq("nombre", inputname.value.trim())
        .order("fecha_debut");

    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion);
    }



    bodyDiv.innerHTML = html;


}



document.addEventListener("DOMContentLoaded", main);