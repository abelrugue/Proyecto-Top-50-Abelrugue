"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        document.getElementById("btn-buscar-lista-antigua").addEventListener("click", buscar);

        document.getElementById("fecha-antigua-input").addEventListener("keydown", e => {
            if (e.key === "Enter") {
                buscar();
            }
        });

        const params = new URLSearchParams(window.location.search);

        const fecha = params.get("fecha") ?? "2026-07-19";

        document.getElementById("fecha-antigua-input").value = fecha;

        await cargarLista(fecha);



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


function buscar() {
    const fecha = document.getElementById("fecha-antigua-input").value;
    if (!fecha) return;

    history.pushState({}, "", `?fecha=${fecha}`);
    cargarLista(fecha);


}

async function cargarLista(fecha) {

    let { data, error } = await supabase
        .rpc("vista_lista_antigua", {
            fecha_consulta: fecha
        });

    let { data: hitos, error: error2 } = await supabase
        .rpc("vista_hitos_semana", {
            fecha_consulta: fecha
        })
        .single();

    let { data: rdps, error: error3 } = await supabase
        .rpc("vista_record_permanencia", {
            fecha_consulta: fecha
        });
    let { data: salidas, error: error4 } = await supabase
        .rpc("vista_salidas", {
            fecha_consulta: fecha
        });

    if (error) throw error;
    if (error2) throw error2;
    if (error3) throw error3;
    if (error4) throw error4;

    const lista = document.getElementById("div-lista-antigua");
    lista.replaceChildren();
    lista.appendChild(galleryRenderer.asCardGallery(data, hitos, rdps, salidas));
    document.getElementById("title-lista-antigua").innerHTML = `Lista Top 50 de Abelrugue del ${fecha}`;
}

document.addEventListener("DOMContentLoaded", main);
