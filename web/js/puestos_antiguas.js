"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        let content = document.getElementById("content_antiguas");

        let fecha = '2026-07-05';

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
        content.appendChild(galleryRenderer.asCardGallery(data, hitos, rdps, salidas));
        document.getElementById("title-lista-antigua").innerHTML = `Lista Top 50 de Abelrugue del ${fecha}`;
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}
document.addEventListener("DOMContentLoaded", main);
