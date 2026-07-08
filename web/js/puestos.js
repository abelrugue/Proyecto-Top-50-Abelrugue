"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        let content = document.getElementById("content");

        let { data, error } = await supabase
            .from("vista_lista_actual")
            .select("*");
        let { data: hitos, error: error2 } = await supabase
            .from("vista_hitos_semana")
            .select("*")
            .single();
        let { data: rdps, error: error3 } = await supabase
            .from("vista_record_permanencia")
            .select("*")
        content.appendChild(galleryRenderer.asCardGallery(data, hitos, rdps));
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}
document.addEventListener("DOMContentLoaded", main);
