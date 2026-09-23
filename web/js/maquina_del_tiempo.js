"use strict";

import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        document.getElementById("maquina-form").addEventListener("submit", e => {
            e.preventDefault();
            buscar();
        });

        const params = new URLSearchParams(window.location.search);

        let { data: fecha_ultima, error: error_ultima } = await supabase
            .from("vista_ultima_fecha")
            .select("fecha_ultima")
            .single();

        if (error_ultima) throw error_ultima;

        const fecha = params.get("fecha") ?? fecha_ultima.fecha_ultima;

        document.getElementById("maquina-input").value = fecha;

        await cargarLista(fecha);



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


function buscar() {
    const fecha = document.getElementById("maquina-input").value;
    if (!fecha) return;

    history.pushState({}, "", `?fecha=${fecha}`);

    const lista = document.getElementById("div-maquina");
    lista.replaceChildren();

    cargarLista(fecha);


}

async function cargarLista(fecha) {

    document.getElementById("title-maquina").innerHTML = `Máquina del tiempo del ${fecha}`;

    let { data: data_maquina, error: error_maquina } = await supabase
        .rpc("vista_maquina_años", {
            fecha_consulta: fecha
        });

    let { data: data_maquina_6_meses, error: error_maquina_6_meses } = await supabase
        .rpc("vista_maquina_6_meses", {
            fecha_consulta: fecha
        });


    // maquina antigua

    if (error_maquina) throw error_maquina;
    if (error_maquina_6_meses) throw error_maquina_6_meses;

    const bodyDiv = document.getElementById("div-maquina");

    let html_total = '';
    for (let cancion of data_maquina) {
        html_total += asCard(cancion, "año");
    }
    for (let cancion of data_maquina_6_meses) {
        html_total += asCard(cancion, "mes");
    }
    // maquina antigua

    bodyDiv.innerHTML = html_total;

}

function asCard(cancion, tipo) {
    let hace = "6 meses";
    let span = "";
    let cifra_y_tiempo = "6️⃣ MESES";
    const emoji = cancion.hace_años <= 20 ? ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "1️⃣1️⃣", "1️⃣2️⃣", "1️⃣3️⃣", "1️⃣4️⃣", "1️⃣5️⃣", "1️⃣6️⃣", "1️⃣7️⃣", "1️⃣8️⃣", "1️⃣9️⃣", "2️⃣0️⃣"][cancion.hace_años] : cancion.hace_años;

    let repeticion="";
    if(tipo=="año"){
        hace = `${cancion.hace_años} años`;
        span = `<span class="badge rounded-pill bg-success semana-badge">${new Date(cancion.fecha).getFullYear()}</span>`;
        if(cancion.hace_años==1){
            cifra_y_tiempo = `${emoji} AÑO`;
        }else{
            cifra_y_tiempo = `${emoji} AÑOS`;
        }
    }

    if(cancion.numeros_1_total>1){
        repeticion = `(${cancion.numeros_1_parcial}/${cancion.numeros_1_total})`;

    }


    let html = `
        <div class="card mb-2 p-1">
            <div class="row g-1 align-items-center m-0">
                <div class="col-3 col-md-3 text-center" >
                    <h3 class="mb-0" >${hace}</h3>
                </div>
                <div class="col-2 col-md-2">
                    <img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                    class="img-fluid rounded w-100 h-100 object-fit-cover">
                </div>
                <div class="col-4 col-md-4 d-flex align-items-center">
                    <div class="card-body">
                        <h3 class="card-title">${cancion.titulo}</h3>
                        <p class="card-text">${cancion.artistas}</p>

                    </div>
                </div>
                    <div class="col-2 col-md-2 d-flex align-items-center justify-content-center">                       
                        ${span} 
                    </div>
                </div>
                <div class="col-1 col-md-1 d-flex align-items-center justify-content-center">
                    <button class="btn btn-sm btn-outline-secondary" id="copiar-${cancion.fecha}">
                        <i class="fa-regular fa-copy" style="color: rgb(132, 132, 132);"></i>
                    </button>
                </div>


            </div>
        </div>
        `;

        let card = parseHTML(html);
        
                const boton = card.querySelector(`#copiar-${cancion.fecha}`);
        
                boton.addEventListener("click", async () => {
                    try {
                        await navigator.clipboard.writeText(`HACE ${cifra_y_tiempo}
        
        🕓 ${cancion.titulo.toUpperCase()} (${cancion.artistas}) ${repeticion}
        
        ${cancion.youtube_url}`);
        
                    } catch (err) {
                        console.error(err);
                    }
                });

    return html;

}

document.addEventListener("DOMContentLoaded", main);
