"use strict";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

async function main() {
    try {
        console.log("1");
        let btn_buscar_artistas = document.getElementById("btn-buscar-artistas");
        console.log("2", btn_buscar_artistas);
        if (btn_buscar_artistas) {
            btn_buscar_artistas.addEventListener("click", buscaArtistas);
        }
        console.log("3");

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}

async function buscaArtistas() {

    console.log("4");

    let textarea = document.getElementById("lista-input");
    console.log("5", textarea);
    let texto = textarea.value;
    console.log("6");

    const titulos = texto
        .trim()
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    const { data, error } = await supabase.functions.invoke(
        "buscar-canciones",
        {
            body: {
                titulos
            }
        }
    );
    console.log("7", data, error);

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }

}


document.addEventListener("DOMContentLoaded", main);