"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

async function main() {
    document.getElementById("btn-buscar-artistas").addEventListener("click", buscaArtistas);
}

async function buscaArtistas() {
    
    try {
        let textarea = document.getElementById("lista-input");
        let texto = textarea.value;

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

        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


document.addEventListener("DOMContentLoaded", main);