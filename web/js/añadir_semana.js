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
            html_artistas += `<input type="text" class="form-control mb-2" id="artistas-${i}" placeholder="Artistas de ${titulo} (separados por ';')" required>
                            <input type="url" class="form-control" id="youtube-${i}" placeholder="https://youtu.be/..." required>`


        } else if (opciones.length === 1) {
            html_artistas += `${opciones[0].artistas} 
                <button type="button" class="btn btn-outline-primary btn-sm ms-2" id="modificar-${i}">
                    Modificar
                </button>` ;


        } else {
            html_artistas += `<select class="form-select" id="cancion-${i}">`;
            for (const cancion of [...opciones].reverse()) {
                html_artistas += `
                <option value="${cancion.id}">
                    ${cancion.artistas}
                </option>
                `;
            }
            html_artistas += `</select>
                <button type="button" class="btn btn-outline-primary btn-sm ms-2" id="modificar-${i}">
                    Modificar
                </button>`;

        }
        let html_fila = `<tr>
        <td scope="col">${i}</td>
        <td scope="col">${titulo}</td>
        <td scope="col" id="artistas-cell-${i}">${html_artistas}</td>

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

    document.querySelectorAll("[id^='modificar-']").forEach(btn => {

        const i = Number(btn.id.replace("modificar-", ""));
        const titulo = titulos[i - 1];
        const opciones = data.canciones[titulo];

        btn.addEventListener("click", () => {

            let artistas = "";
            let youtube = "";

            if (opciones.length === 1) {
                artistas = opciones[0].artistas;
                youtube = opciones[0].youtube_url ?? "";

            } else if (opciones.length > 1) {

                const select = document.getElementById(`cancion-${i}`);
                const cancionSeleccionada = opciones.find(
                    cancion => String(cancion.id) === select.value
                );

                if (cancionSeleccionada) {
                    artistas = cancionSeleccionada.artistas;
                    youtube = cancionSeleccionada.youtube_url ?? "";
                }
            }

            modificarCancion(i, titulo, artistas, youtube);
        });
    });

    let btn_insertar_semana = document.getElementById("btn-insertar-semana");

    if (btn_insertar_semana) {
        btn_insertar_semana.addEventListener("click", insertaSemana);
    }

}

function modificarCancion(i, titulo, artistasActuales = "", youtubeActual = "") {

    const celda = document.getElementById(`artistas-cell-${i}`);

    celda.innerHTML = `
        <input type="text"
               class="form-control mb-2"
               id="artistas-mod-${i}"
               value="${artistasActuales}"
               placeholder="Artistas de ${titulo} (separados por ';')">

        <input type="url"
               class="form-control mb-2"
               id="youtube-mod-${i}"
               value="${youtubeActual}"
               placeholder="https://youtu.be/...">

        <button type="button"
                class="btn btn-success btn-sm me-1"
                id="guardar-mod-${i}">
            Guardar
        </button>

        <button type="button"
                class="btn btn-secondary btn-sm"
                id="cancelar-mod-${i}">
            Cancelar
        </button>
    `;

    document.getElementById(`guardar-mod-${i}`).addEventListener("click", () => {
        guardarModificacion(i);
    });

    document.getElementById(`cancelar-mod-${i}`).addEventListener("click", () => {
        // Volvemos a buscar la canción original
        const opciones = data.canciones[titulo];

        let html_artistas = "";

        if (opciones.length === 0) {

            html_artistas = `
                <input type="text"
                       class="form-control mb-2"
                       id="artistas-${i}"
                       placeholder="Artistas de ${titulo} (separados por ';')"
                       required>

                <input type="url"
                       class="form-control"
                       id="youtube-${i}"
                       placeholder="https://youtu.be/..."
                       required>
            `;

        } else if (opciones.length === 1) {

            html_artistas = `
                ${opciones[0].artistas}
                <button type="button"
                        class="btn btn-outline-primary btn-sm ms-2"
                        id="modificar-${i}">
                    Modificar
                </button>
            `;

        } else {

            html_artistas = `
                <select class="form-select" id="cancion-${i}">
            `;

            for (const cancion of [...opciones].reverse()) {
                html_artistas += `
                    <option value="${cancion.id}">
                        ${cancion.artistas}
                    </option>
                `;
            }

            html_artistas += `
                </select>

                <button type="button"
                        class="btn btn-outline-primary btn-sm mt-2"
                        id="modificar-${i}">
                    Modificar
                </button>
            `;
        }

        celda.innerHTML = html_artistas;

        const btn = document.getElementById(`modificar-${i}`);

        if (btn) {
            btn.addEventListener("click", () => {
                const opciones = data.canciones[titulo];

                let artistas = "";
                let youtube = "";

                if (opciones.length === 1) {
                    artistas = opciones[0].artistas;
                    youtube = opciones[0].youtube_url ?? "";

                } else if (opciones.length > 1) {

                const select = document.getElementById(`cancion-${i}`);
                const cancionSeleccionada = opciones.find(
                    cancion => String(cancion.id) === select.value
                );

                if (cancionSeleccionada) {
                    artistas = cancionSeleccionada.artistas;
                    youtube = cancionSeleccionada.youtube_url ?? "";
                }
            }

                modificarCancion(i, titulo, artistas, youtube);
            });
        }
    });
}

function guardarModificacion(i) {

    const artistasInput = document.getElementById(`artistas-mod-${i}`);
    const youtubeInput = document.getElementById(`youtube-mod-${i}`);

    const artistas = artistasInput.value
        .split(";")
        .map(a => a.trim())
        .filter(Boolean);

    const youtube_url = youtubeInput.value.trim();

    if (artistas.length === 0) {
        alert("Debes introducir al menos un artista.");
        return;
    }

    // Guardamos la modificación en la fila
    const fila = titulos[i - 1];

    if (!window.cancionesModificadas) {
        window.cancionesModificadas = {};
    }

    window.cancionesModificadas[i] = {
        titulo: fila,
        artistas,
        youtube_url
    };

    const celda = document.getElementById(`artistas-cell-${i}`);

    celda.innerHTML = `
        ${artistas.join(", ")}

        <button type="button"
                class="btn btn-outline-primary btn-sm ms-2"
                id="modificar-${i}">
            Modificar
        </button>
    `;

    document.getElementById(`modificar-${i}`).addEventListener("click", () => {
        modificarCancion(
            i,
            fila,
            artistas.join("; "),
            youtube_url
        );
    });
}

async function insertaSemana() {

    const puestos_lista = [];


    for (let i = 0; i < titulos.length; i++) {

        const titulo = titulos[i];
        const opciones = data.canciones[titulo];

        if (window.cancionesModificadas?.[i + 1]) {

            const modificada = window.cancionesModificadas[i + 1];

            puestos_lista.push({
                posicion: i + 1,
                titulo: modificada.titulo,
                artistas: modificada.artistas,
                youtube_url: modificada.youtube_url
            });

            continue;
        }

        if (opciones.length === 0) {


            let id_artistas_i = document.getElementById(`artistas-${i + 1}`);
            let id_youtube_i = document.getElementById(`youtube-${i + 1}`);
            puestos_lista.push({
                posicion: i + 1,
                titulo: titulo,
                artistas: id_artistas_i.value.trim().split(";").map(l => l.trim()).filter(Boolean),
                youtube_url: id_youtube_i.value.trim()
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

/*
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

    messageRenderer.showSuccessMessage(
        `Semana añadida correctamente.
        Canciones creadas: ${data_insertar.canciones_creadas},
        Artistas creados: ${data_insertar.artistas_creados},
        Relaciones creadas: ${data_insertar.relaciones_insertadas}.`
    );
*/
}


document.addEventListener("DOMContentLoaded", main);