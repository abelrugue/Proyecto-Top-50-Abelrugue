"use strict";
import { galleryRenderer } from "./renderers/lista.js";
import { supabase } from "./supabase.js";
import { messageRenderer } from './renderers/messages.js';
async function main() {
    try {
        let content = document.getElementById("content");

        let { puestos, error } = await supabase
            .from("vista_lista_actual")
            .select("*");
        console.log(puestos);
        console.log(typeof puestos);
        console.log(Array.isArray(puestos));
        content.appendChild(await galleryRenderer.asCardGallery(puestos));
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}
document.addEventListener("DOMContentLoaded", main);
