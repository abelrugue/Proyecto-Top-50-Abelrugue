"use strict";

import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

async function main() {
    try {
        document.getElementById("fin-año-form").addEventListener("submit", e => {
            e.preventDefault();
            buscar();
        });

        const params = new URLSearchParams(window.location.search);

        let { data: fecha_ultima, error: error_ultima } = await supabase
            .from("vista_ultima_fecha")
            .select("fecha_ultima")
            .single();

        if (error_ultima) throw error_ultima;

        const año = params.get("año") ?? new Date(fecha_ultima.fecha_ultima).getFullYear();

        document.getElementById("año-fin-input").value = año;

        await cargarLista(año);



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


function buscar() {
    const año = document.getElementById("año-fin-input").value;
    if (!año) return;

    history.pushState({}, "", `?año=${año}`);

    const lista = document.getElementById("div-fin-año");
    lista.replaceChildren();

    cargarLista(año);


}

async function cargarLista(año) {

    document.getElementById("title-lista-fin-año").innerHTML = `Lista Fin de Año ${año}`;

    let { data, error } = await supabase
        .rpc("vista_lista_fin_de_año", {
            anio: año
        });


    if (error) throw error;

    const bodyDiv = document.getElementById("div-fin-año");

    let html_total = '';
    let i = 1;
    for (let cancion of data) {
        html_total += asCard(cancion, i);
        i++;
    }

    bodyDiv.innerHTML = html_total;

    const botones = bodyDiv.querySelectorAll("[id^='copiar-']");

    botones.forEach(boton => {
        const i = Number(boton.id.replace("copiar-", ""));
        const puesto = data[i - 1];

        boton.addEventListener("click", async () => {
            try {
                let repeticion = "";

                if (puesto.numeros_1 > 1) {
                    repeticion = `x${puesto.numeros_1}`;
                }

                await navigator.clipboard.writeText(`${i}.‎ ${puesto.titulo.toUpperCase()} - ${puesto.artistas}
    
Max. ${puesto.peak}${repeticion}, Sem. ${puesto.sem} (Total ${puesto.sem_total})
Punt. ${Number(puesto.puntuacion).toFixed(3)}
    
${puesto.youtube_url}`);

            } catch (err) {
                console.error(err);
            }
        });
    });

}

function asCard(puesto, i) {


    let repeticion = "";
    if (puesto.numeros_1 > 1) {
        repeticion = `x${puesto.numeros_1}`
    }

    let num1 = "";
    if (i == 1) {
        num1 = `style="background-color: rgb(255, 236, 236);"`;
    }




    let html = `
            <div class="card mb-2 p-1" ${num1}>
                <div class="row g-1 align-items-center m-0">
                    <div class="col-2 col-md-2 text-center" >
                        <h2 class="card-title" >${i}</h2>
                    </div>
                    <div class="col-2 col-md-2">
                        <img src="${puesto.portada_url && puesto.portada_url !== 'NO_ENCONTRADA' ? puesto.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                        class="img-fluid rounded w-100 h-100 object-fit-cover">
                    </div>
                    <div class="col-5 col-md-4 d-flex align-items-center">
                        <div class="card-body">
                            <h3 class="card-title">${puesto.titulo}</h3>
                            <p class="card-text">${puesto.artistas}</p>
    
                        </div>
                    </div>
                    <div class="col-2 col-md-3 d-flex align-items-end">
                        <div class="card-body p-1">
                            <div class="d-flex flex-column flex-md-row gap-1 gap-md-2 text-center w-100 stats">
                                <div class="stat">
                                    <div class="d-none d-sm-block">
                                        <p class="mb-1">Max:</p>
                                        <p style="white-space: nowrap;"><i class="fa-solid fa-trophy"></i> ${puesto.peak}${repeticion}</p>
                                    </div>
    
                                    <div class="d-block d-sm-none stats">
                                        <p><i class="fa-solid fa-trophy"></i> ${puesto.peak}${repeticion}</p>
                                    </div>
                                </div>
    
                                <div class="stat">
                                    <div class="d-none d-sm-block">
                                        <p class="mb-1">Sem:</p>
                                        <p style="white-space: nowrap;"><i class="fa-solid fa-calendar"></i> ${puesto.sem}</p>
                                    </div>
    
                                    <div class="d-block d-sm-none stats">
                                        <p><i class="fa-solid fa-calendar"></i> ${puesto.sem}</p>
                                    </div>
                                </div>
    
                                <div class="stat">
                                    <div class="d-none d-sm-block">
                                        <p class="mb-1">Punt:</p>
                                        <p style="white-space: nowrap;"><i class="fa-solid fa-star"></i> ${Number(puesto.puntuacion).toFixed(3)}</p>
                                    </div>
    
                                    <div class="d-block d-sm-none stats">
                                        <p><i class="fa-solid fa-star"></i> ${Number(puesto.puntuacion).toFixed(3)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="col-1 col-md-1 d-flex align-items-center justify-content-center">
                        <button class="btn btn-sm btn-outline-secondary" id="copiar-${i}">
                            <i class="fa-regular fa-copy" style="color: rgb(132, 132, 132);"></i>
                        </button>
                    </div>
    
                </div>
            </div>
            `;

    

    return html;

}

document.addEventListener("DOMContentLoaded", main);
