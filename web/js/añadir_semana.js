"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';

async function main() {
    try {
        let textarea = document.getElementById("lista-input");
        let texto = textarea.value;

        const lineas = texto
            .trim()
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

            /*
        let { data, error } = await supabase
            .from("vista_lista_actual")
            .select("*");

            */
        // content.appendChild(galleryRenderer.asCardGallery(data, hitos, rdps));
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}
document.addEventListener("DOMContentLoaded", main);