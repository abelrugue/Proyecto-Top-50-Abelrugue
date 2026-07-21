"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {
        /*
        let btn = document.getElementById("btn");
        if (btn) {
            btn.addEventListener("click", asCardGallery);
        }

        let btn_n1 = document.getElementById("btn-n1");
        if (btn_n1) {
            btn_n1.addEventListener("click", asCardGallery_n1);
        }

        let nameinput = document.getElementById("name-input");
        if (nameinput) {
            nameinput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    asCardGallery();
                }
            });
        }

        let nameinputn1 = document.getElementById("name-input-n1");
        if (nameinputn1) {
            nameinputn1.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    asCardGallery_n1();
                }
            });
        }*/

        let form = document.getElementById("entradas-form");
        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();
                buscar();
            });

            const params = new URLSearchParams(window.location.search);

            const artista = params.get("name") ?? "";

            document.getElementById("name-input").value = artista;

            await asCardGallery(artista);
        }

        let formn1 = document.getElementById("n1-form");
        if (formn1) {
            formn1.addEventListener("submit", e => {
                e.preventDefault();
                buscarn1();
            });

            const params = new URLSearchParams(window.location.search);

            const artista = params.get("name") ?? "";

            document.getElementById("name-input-n1").value = artista;

            await asCardGallery_n1(artista);
        }

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}

function buscar() {
    const artista = document.getElementById("name-input").value;
    if (!artista) return;

    history.pushState({}, "", `?name=${artista}`);

    const lista = document.getElementById("body");
    lista.replaceChildren();

    asCardGallery(artista);
}

function buscarn1() {
    const artista = document.getElementById("name-input-n1").value;
    if (!artista) return;

    history.pushState({}, "", `?name=${artista}`);

    const lista = document.getElementById("body-n1");
    lista.replaceChildren();

    asCardGallery_n1(artista);
}

async function asCardGallery(artista) {
    let bodyDiv = document.getElementById("body");

    let { data, error } = await supabase
        .from("vista_artista_canciones")
        .select("*")
        .eq("nombre", artista.trim())
        .order("fecha_debut");
    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion, "entradas");
    }
    document.getElementById("title-entradas-de-x").innerHTML = `Entradas de ${inputname.value}`;
    bodyDiv.innerHTML = html;
}

async function asCardGallery_n1(artista) {
    let bodyDiv = document.getElementById("body-n1");

    let { data, error } = await supabase
        .from("vista_artista_canciones_num_1")
        .select("*")
        .eq("nombre", artista.trim())
        .order("fecha_peak");
    let html = '';
    for (let cancion of data) {
        html += cancionRenderer.asCard(cancion, "n1");
    }
    document.getElementById("title-n1-de-x").innerHTML = `Números 1 de ${inputname.value}`;
    bodyDiv.innerHTML = html;
}



document.addEventListener("DOMContentLoaded", main);