"use strict";

import { supabase } from "./supabase.js";
import { messageRenderer } from "./renderers/messages.js";

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        messageRenderer.showErrorMessage(error.message);
        return;
    }

    window.location.href = "/añadir_semana.html";
}

document
    .getElementById("btn-login")
    .addEventListener("click", login);