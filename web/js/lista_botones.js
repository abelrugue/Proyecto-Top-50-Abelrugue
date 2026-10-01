"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {


        let btn_lista_top50 = document.getElementById("btn-lista-top50");
        if (btn_lista_top50) {
            btn_lista_top50.addEventListener("click", buscarBtnListaTop50);
        }

        let btn_mayores_subidas = document.getElementById("btn-mayores-subidas");
        if (btn_mayores_subidas) {
            btn_mayores_subidas.addEventListener("click", buscarBtnMayoresSubidas);
        }

        let btn_semanas_en_lista = document.getElementById("btn-semanas-en-lista");
        if (btn_semanas_en_lista) {
            btn_semanas_en_lista.addEventListener("click", buscarBtnSemanasEnLista);
        }

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}


async function buscarBtnListaTop50() {

    let content = document.getElementById("content");

    content.replaceChildren();

    document.getElementById("titulo-index").innerHTML = `Lista Top 50 de Abelrugue`;

    let { data, error } = await supabase
        .from("vista_lista_actual")
        .select("*");
    let { data: hitos, error: error2 } = await supabase
        .from("vista_hitos_semana")
        .select("*")
        .single();
    let { data: rdps, error: error3 } = await supabase
        .from("vista_record_permanencia")
        .select("*");
    let { data: salidas, error: error4 } = await supabase
        .from("vista_salidas")
        .select("*");
    content.appendChild(galleryRenderer.asCardGallery(data, hitos, rdps, salidas));
}

async function buscarBtnMayoresSubidas() {
    const bodyDiv = document.getElementById("content");
    bodyDiv.replaceChildren();

    document.getElementById("titulo-index").innerHTML = `Mayores subidas`;


    let { data, error } = await supabase
        .from("vista_lista_actual")
        .select("*")
        .order("variacion", { ascending: false })
        .order("posicion", { ascending: true });

    if (error) throw error;

    let html_total = '';
    for (let cancion of data) {
        if(cancion.variacion!=null){
            html_total += asCard(cancion, "subidas");
        }
    }

    bodyDiv.innerHTML = html_total;


}

function asCard(puesto, tipo) {

    let fa = null;
    let mas = "";
    let variacion = "";
    let color = "";
    let posicion_anterior = puesto.posicion_anterior;

    let texto_primero = "";

    if (tipo == "subidas") {
        if (puesto.variacion < 0) {
            fa = `<i class="fa-regular fa-circle-down fa-width-auto" style="color: rgb(220, 53, 69);"></i>`;
            variacion = puesto.variacion;
            color = `style="color: rgb(220, 53, 69);"`;
        } else if (puesto.variacion == 0) {
            fa = `<i class="fa-regular fa-circle-pause fa-rotate-90" style="color: rgb(138, 138, 138);"></i>`;
        } else if (puesto.variacion > 0) {
            fa = `<i class="fa-regular fa-circle-up fa-width-auto" style="color: rgb(25, 135, 84);"></i>`;
            variacion = puesto.variacion;
            color = `style="color: rgb(25, 135, 84);"`;
            mas = "+";
        } else if (puesto.es_entrada) {
            fa = `<i class="fa-solid fa-certificate" style="color: rgb(255, 193, 7);"></i>`;
            posicion_anterior = "-";
        } else if (puesto.es_reentrada) {
            fa = `<i class="fa-solid fa-certificate" style="color: rgb(255, 69, 7);"></i>`;
            posicion_anterior = "-";
        }
        texto_primero=`${color}>${fa} ${mas}${variacion}`;

    }else{
        texto_primero=`>${puesto.sem} sem`
        if (puesto.es_entrada) {
            posicion_anterior = "-";
        } else if (puesto.es_reentrada) {
            posicion_anterior = "-";
        }
    }



    let color_num = "";
    if (puesto.es_nuevo_peak) {
        color_num = "color: rgb(255, 170, 0);";
    }

    let repeticion = "";
    if (puesto.numeros_1 > 1) {
        repeticion = `x${puesto.numeros_1}`
    }




    let html = `
        <div class="card mb-2 p-1">
            <div class="row g-1 align-items-center m-0">
                <div class="col-2 col-md-2 text-center" >
                    <h3 class="card-text" ${texto_primero}</h3>
                </div>
                <div class="col-2 col-md-2">
                    <img src="${puesto.portada_url && puesto.portada_url !== 'NO_ENCONTRADA' ? puesto.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
                    class="img-fluid rounded w-100 h-100 object-fit-cover">
                </div>
                <div class="col-6 col-md-5 d-flex align-items-center">
                    <div class="card-body">
                        <h3 class="card-title">${puesto.titulo}</h3>
                        <p class="card-text">${puesto.artistas}</p>

                    </div>
                </div>
                <div class="col-2 col-md-3 d-flex align-items-end">
                    <div class="card-body">
                        <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 text-end w-100 stats">
                            <div class="stat">
                                <div class="d-none d-sm-block">
                                    <p class="mb-1">Max:</p>
                                    <p style="white-space: nowrap; ${color_num}"><i class="fa-solid fa-trophy"></i> ${puesto.peak}${repeticion}</p>
                                </div>

                                <div class="d-block d-sm-none stats" style="${color_num}">
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

                            
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
        `;

    return html;

}



async function buscarBtnSemanasEnLista() {

    const bodyDiv = document.getElementById("content");
    bodyDiv.replaceChildren();

    document.getElementById("titulo-index").innerHTML = `Semanas en lista`;


    let { data, error } = await supabase
        .from("vista_lista_actual")
        .select("*")
        .order("sem", { ascending: false })
        .order("posicion", { ascending: true });

    if (error) throw error;

    let html_total = '';
    for (let cancion of data) {
        html_total += asCard(cancion, "semanas");
    }

    bodyDiv.innerHTML = html_total;
}


document.addEventListener("DOMContentLoaded", main);
