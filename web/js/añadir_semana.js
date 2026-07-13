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
            html_artistas += `<input type="text" class="form-control" id="artistas-${i}" name="fecha" placeholder="Artistas de ${titulo}" required>`


        } else if (opciones.length === 1) {
            html_artistas += opciones[0].artistas;


        } else {
            html_artistas += `<select class="form-select" id="cancion-${i}>`;
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

    let btn_insertar_semana = document.getElementById("btn-insertar-semana");

    if (btn_insertar_semana) {
        btn_insertar_semana.addEventListener("click", insertaSemana);
    }

}

async function insertaSemana() {

    const puestos_lista = [];

    for (let i = 0; i < titulos.length; i++) {

        const titulo = titulos[i];
        const opciones = data.canciones[titulo];

        if (opciones.length === 0) {


            let id_artistas_i = document.getElementById(`artistas-${i + 1}`);
            puestos_lista.push({
                posicion: i + 1,
                titulo: titulo,
                artistas: id_artistas_i.value.trim().split(";").map(l => l.trim()).filter(Boolean)
            });

        } else if (opciones.length === 1) {


            puestos_lista.push({
                posicion: i + 1,
                cancion_id: opciones[0].cancion_id
            });

        } else {


            let id_cancion_i = document.getElementById(`cancion-${i + 1}`);

            puestos_lista.push({
                posicion: i + 1,
                cancion_id: id_cancion_i.value
            });

        }

    }

    const body = {
        fecha: document.getElementById("fecha-input").value,
        puestos: puestos_lista
    };

    console.log(body);

    /*
    const { data, error } = await supabase.functions.invoke(
        "insertar-semana",
        {
            body
        }


    );

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
    */
}


document.addEventListener("DOMContentLoaded", main);