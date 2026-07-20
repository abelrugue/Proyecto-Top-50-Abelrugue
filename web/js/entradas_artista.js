"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {

        let btn = document.getElementById("btn");
        if (btn) {
            btn.addEventListener("click", asCardGallery);
        }

        let btn_n1 = document.getElementById("btn-n1");
        if (btn_n1) {
            btn_n1.addEventListener("click", asCardGallery_n1);
        }



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
        //.eq("nombre", inputname.value.trim())
        .order("fecha_debut");
    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion, "entradas");
    }
    document.getElementById("title-entradas-de-x").innerHTML = `Entradas de ${inputname.value}`;
    bodyDiv.innerHTML = html;
}

async function asCardGallery_n1() {
    let inputname = document.getElementById("name-input-n1");
    let bodyDiv = document.getElementById("body-n1");

    let { data, error } = await supabase
        .from("vista_artista_canciones_num_1")
        .select("*")
        .eq("nombre", inputname.value.trim())
        .order("fecha_peak");
    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion, "n1");
    }
    document.getElementById("title-n1-de-x").innerHTML = `Números 1 de ${inputname.value}`;
    bodyDiv.innerHTML = html;
}



document.addEventListener("DOMContentLoaded", main);