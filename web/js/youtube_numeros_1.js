"use strict";

import { supabase } from "./supabase.js";

let canciones = [];


async function cargarCanciones() {

    const container = document.getElementById("canciones-container");
    const mensaje = document.getElementById("mensaje");

    container.innerHTML = `
        <div class="text-center">
            <div class="spinner-border"></div>
            <p class="mt-2">Cargando canciones...</p>
        </div>
    `;

    mensaje.innerHTML = "";

    const { data, error } = await supabase.functions.invoke(
        "youtube-numeros-1",
        {
            body: {
                accion: "listar"
            }
        }
    );

    if (error) {
        console.error(error);
        container.innerHTML = "";
        mensaje.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar las canciones.
            </div>
        `;
        return;
    }

    canciones = data.canciones;

    mostrarCanciones();
}


function mostrarCanciones() {

    const container = document.getElementById("canciones-container");

    if (canciones.length === 0) {

        container.innerHTML = `
            <div class="alert alert-success text-center">
                Todas las canciones que fueron número 1 entre 2021 y 2026
                tienen ya un enlace de YouTube.
            </div>
        `;

        return;
    }

    let html = "";

    canciones.forEach((cancion, i) => {

        html += `
            <div class="card mb-2 p-2">

                <div class="row align-items-center g-2">

                    <div class="col-12 col-md-5">
                        <strong>
                            ${cancion.titulo}
                        </strong>

                        <div class="text-muted">
                            ${cancion.artistas}
                        </div>
                    </div>

                    <div class="col-12 col-md-2 text-center">
                        <span class="badge bg-success">
                            Nº 1
                        </span>

                        <div class="small text-muted mt-1">
                            ${cancion.fecha_primera}
                        </div>
                    </div>

                    <div class="col-12 col-md-5">

                        <input
                            type="url"
                            class="form-control youtube-input"
                            data-id="${cancion.id}"
                            placeholder="https://youtu.be/..."
                        >

                    </div>

                </div>

            </div>
        `;
    });

    container.innerHTML = html;
}


async function guardarEnlaces() {

    const boton = document.getElementById("btn-guardar");
    const mensaje = document.getElementById("mensaje");

    const inputs = document.querySelectorAll(".youtube-input");

    const enlaces = [];

    for (const input of inputs) {

        const youtube_url = input.value.trim();

        if (!youtube_url) {
            continue;
        }

        enlaces.push({
            id: Number(input.dataset.id),
            youtube_url: youtube_url
        });
    }

    if (enlaces.length === 0) {

        mensaje.innerHTML = `
            <div class="alert alert-warning">
                No has introducido ningún enlace.
            </div>
        `;

        return;
    }

    boton.disabled = true;

    mensaje.innerHTML = `
        <div class="alert alert-info">
            Guardando enlaces...
        </div>
    `;

    const { data, error } = await supabase.functions.invoke(
        "youtube-numeros-1",
        {
            body: {
                accion: "guardar",
                enlaces: enlaces
            }
        }
    );

    boton.disabled = false;

    if (error) {

        console.error(error);

        mensaje.innerHTML = `
            <div class="alert alert-danger">
                Error al guardar los enlaces.
            </div>
        `;

        return;
    }

    mensaje.innerHTML = `
        <div class="alert alert-success">
            Se han guardado ${data.actualizadas} enlaces correctamente.
        </div>
    `;

    await cargarCanciones();
}


document
    .getElementById("btn-guardar")
    .addEventListener("click", guardarEnlaces);


document.addEventListener("DOMContentLoaded", cargarCanciones);