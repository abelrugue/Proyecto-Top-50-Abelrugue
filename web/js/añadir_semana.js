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

    let i = 1;
    let bodyDiv = document.getElementById("body-busca-artistas");
    let html = '';

    for (let titulo of titulos) {
        let opciones = data.canciones[titulo];
        let html_artistas = "";


        if (opciones.length === 0) {
            html_artistas += `<input type="text" class="form-control" id="${titulo}-input" name="fecha" placeholder="Artistas de ${titulo}" required>`
            

        } else if (opciones.length === 1) {
            html_artistas += opciones[0].artistas;


        } else {
            html_artistas += `<select class="form-select">`;
            for (const cancion of opciones) {
                html_artistas += `
                <option value="${cancion.id}">
                    ${cancion.artistas}
                </option>
                `;
            }
            html_artistas += `</select>`;

        }
        let html_fila = `<tr>
        <td scope="col">${i}</td>
        <td scope="col">${titulo}</td>
        <td scope="col">${html_artistas}</td>

        </tr>`;
        html += html_fila;
        i++;


    }
    
    bodyDiv.innerHTML = html;
    

}


document.addEventListener("DOMContentLoaded", main);