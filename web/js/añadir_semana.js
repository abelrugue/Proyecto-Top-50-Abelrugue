"use strict";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

let titulos = [];
let data = null;

async function main() {
    try {

        const {
            data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
            window.location.href = "/login.html";
            return;
        }

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = "/login.html";
            return;
        }

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


    titulos = texto
        .trim()
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);



    const respuesta = await supabase.functions.invoke(
        "buscar_canciones",
        {
            body: {
                titulos
            }
        }
    );

    data = respuesta.data;
    const error = respuesta.error;

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
            html_artistas += `<input type="text" class="form-control" id="artistas-${i}" name="fecha" placeholder="Artistas de ${titulo} (separados por ';')" required>`


        } else if (opciones.length === 1) {
            html_artistas += opciones[0].artistas;


        } else {
            html_artistas += `<select class="form-select" id="cancion-${i}">`;
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

    let headDiv = document.getElementById("head-busca-artistas");
    let html_head = `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Título</th>
                        <th scope="col">Artistas</th>
                    </tr>`;

    let btnInsertarDiv = document.getElementById("div-btn-insertar");
    let html_div_btn = `<button type="button" id="btn-insertar-semana" class="btn btn-primary">Insertar semana</button>`;


    headDiv.innerHTML = html_head;
    bodyDiv.innerHTML = html;
    btnInsertarDiv.innerHTML = html_div_btn;

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
                cancion_id: opciones[0].id
            });

        } else {


            let id_cancion_i = document.getElementById(`cancion-${i + 1}`);

            puestos_lista.push({
                posicion: i + 1,
                cancion_id: Number(id_cancion_i.value)
            });

        }

    }

    const body = {
        fecha: document.getElementById("fecha-input").value,
        puestos: puestos_lista
    };

    console.log(body);


    const { data: data_insertar, error: error_insertar } = await supabase.functions.invoke(
        "insertar-semana",
        {
            body
        }


    );

    console.log("DATA:", data_insertar);
    console.log("ERROR:", error_insertar);


    if (error_insertar) {
        messageRenderer.showErrorMessage(error_insertar.message);
        return;
    }

    if (!data_insertar.ok) {
        messageRenderer.showErrorMessage(data_insertar.error);
        return;
    }

    messageRenderer.showSuccessMessage("Semana añadida correctamente.");
    messageRenderer.showSuccessMessage(`${data_insertar}`);

}


document.addEventListener("DOMContentLoaded", main);