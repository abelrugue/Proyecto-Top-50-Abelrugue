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
        content.appendChild(galleryRenderer.asCardGallery(data));
    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }
}
document.addEventListener("DOMContentLoaded", main);
