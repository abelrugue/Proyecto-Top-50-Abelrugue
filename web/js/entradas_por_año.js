"use strict";

import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        document.getElementById("entradas-año-form").addEventListener("submit", e => {
            e.preventDefault();
            buscar();
        });

        const params = new URLSearchParams(window.location.search);

        const año = params.get("año") ?? 2026;

        document.getElementById("año-entradas-input").value = año;

        await cargarLista(año);



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


function buscar() {
    const año = document.getElementById("año-entradas-input").value;
    if (!año) return;

    history.pushState({}, "", `?año=${año}`);

    const lista = document.getElementById("body-entradas-año");
    lista.replaceChildren();

    cargarLista(año);


}

async function cargarLista(año) {

    document.getElementById("title-entradas-de-año").innerHTML = `Entradas de ${año}`;

    let { data, error } = await supabase
        .rpc("vista_entradas_año", {
            anio: año
        });


    if (error) throw error;

    const bodyDiv = document.getElementById("body-entradas-año");

    let html_total = '';
    for (let i = 1; i <= 50; i++) {
        html_total += `<tr> <td scope="col">${i}</td>`
        for (let cancion of data) {
            if (cancion.puesto_entrada == i) {
                html_total += asCard(cancion);
            }
        }
        html_total += `</tr>`
    }

    bodyDiv.innerHTML = html_total;

}

function asCard(cancion) {

    let reentrada = "";
    if (cancion.tipo == "Reentrada") {
        reentrada = "(RE) ";
    }

    let num1 = "";
    if (cancion.numeros_1 == 1) {
        num1 = `rgb(255, 227, 67)`;
    } else if (cancion.numeros_1 == 2) {
        num1 = `rgb(255, 162, 63)`;
    } else if (cancion.numeros_1 == 3) {
        num1 = `rgb(255, 60, 60)`;
    }else{
        num1 = `rgb(255, 255, 255)`;
    }

    let html = `
        <td scope="col"><span class="badge rounded-pill" style="background-color: ${num1}; color: black; width: 100px;">${reentrada}${cancion.titulo}</span></td>
        `;

    return html;

}

document.addEventListener("DOMContentLoaded", main);
