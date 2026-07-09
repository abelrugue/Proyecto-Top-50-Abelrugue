"use strict";

import { cancionRenderer } from "./renderers/render_tops.js";
import { messageRenderer } from './renderers/messages.js';
import { sessionManager } from "./utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    try {

        let bodyDiv = document.getElementById("body-num1");
        bodyDiv.innerHTML += await cancionRenderer.asCardGallery_n1();



    } catch (err) {
        messageRenderer.showErrorMessage(err);
    }



}





document.addEventListener("DOMContentLoaded", main);