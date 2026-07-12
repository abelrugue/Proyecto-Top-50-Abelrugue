"use strict";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

async function main() {
    try {
        
        let btn_buscar_artistas = document.getElementById("btn-buscar-artistas");
        
        if (btn_buscar_artistas) {
            btn_buscar_artistas.addEventListener("click", buscaArtistas);
        }
        

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}

async function buscaArtistas() {

    

    let textarea = document.getElementById("lista-input");
    
    let texto = textarea.value;
    

    const titulos = texto
        .trim()
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    

    const { data, error } = await supabase.functions.invoke(
        "buscar_canciones",
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