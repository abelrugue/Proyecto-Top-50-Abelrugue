"use strict";

import { cancionRenderer } from "./renderers/render_entradas.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";

async function main() {
    try {

        let bodyDiv = document.getElementById("body");
        bodyDiv.innerHTML += cancionRenderer.asCardGallery();

    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}



document.addEventListener("DOMContentLoaded", main);