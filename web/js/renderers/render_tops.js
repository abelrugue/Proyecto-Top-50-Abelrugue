"use strict";

import { supabase } from "../supabase.js";

const cancionRenderer = {
    asCard: function (cancion, tipo, i) {

        let num="";
        if(tipo=="entradas"){
            num = cancion.num_entradas;
        }else{
            num = cancion.numeros_1;
        }

        let html = `<tr>
<td scope="col">${i}</td>
<td scope="col">${cancion.nombre}</td>
<td scope="col">${num}</td>


</tr>`;
        return html;
    },

    asCardGallery: async function () {
        let { data, error } = await supabase
            .from("vista_artistas")
            .select("*")
            .order("num_entradas", { ascending: false });
        let html = '';
        let i = 1;
        for (let cancion of data) {
            html += this.asCard(cancion, "entradas", i);
            i++;
        }

        return html;
    },

    asCardGallery_n1: async function () {
        let { data, error } = await supabase
            .from("vista_artistas")
            .select("*")
            .order("numeros_1", { ascending: false });
        let html = '';
        for (let cancion of data) {
            html += this.asCard(cancion, "n1");
        }

        return html;
    }
};
export { cancionRenderer };