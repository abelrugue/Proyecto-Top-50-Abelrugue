"use strict";

import { sessionManager } from "/js/utils/session.js";
import { supabase } from "./supabase.js";

async function main() {
    /*
    showUser();
    addLogoutHandler();
    hideHeaderOptions();
    */

    const {
        data: { session }
    } = await supabase.auth.getSession();

    const navAnadir = document.getElementById("nav-anadir-semana");
    const navLogin = document.getElementById("nav-login");
    const navLogout = document.getElementById("nav-logout");

    if (session) {

        navAnadir.style.display = "";
        navLogout.style.display = "";
        navLogin.style.display = "none";
 
    } else {

        navAnadir.style.display = "none";
        navLogout.style.display = "none";
        navLogin.style.display = "";

    }

    const btn = document.getElementById("btn-logout");

    if (btn) {
        btn.addEventListener("click", async () => {
            await supabase.auth.signOut();
            window.location.href = "/login.html";
        });
    }
}

/*
function showUser() {
    let title = document.getElementById("navbar-title");
    let text;

    if (sessionManager.isLogged()) {
        let username = sessionManager.getLoggedUser().username;
        text = "Hi, @" + username;
    } else {
        text = "Guest";
    }
    title.textContent = text;
}

function addLogoutHandler() {
    let logoutButton = document.getElementById("navbar-logout");

    logoutButton.onclick = function () {
        sessionManager.logout();
        window.location.href = "index.html";
    };
}

function hideHeaderOptions() {
    let headerRegister = document.getElementById("navbar-register");
    let headerLogin = document.getElementById("navbar-login");
    let headerLogout = document.getElementById("navbar-logout");
    let headerRecent = document.getElementById("navbar-recent");
    let headerCreate = document.getElementById("navbar-create");
    let headerTrending = document.getElementById("navbar-trending");

    if (sessionManager.isLogged()) {
        headerRegister.style.display = "none";
        headerLogin.style.display = "none";
    } else {
        headerRecent.style.display = "none";
        headerCreate.style.display = "none";
        headerLogout.style.display = "none";
        headerTrending.style.display = "none";
    }
}
*/

document.addEventListener("DOMContentLoaded", main)