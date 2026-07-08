"use strict";

import { supabase } from "./supabase.js";

const cancionRenderer = {
    asCard: function (cancion) {
        let html = `<thead>
<tr>
<td scope="col">${cancion.titulo}</td>
<td scope="col">${cancion.artistas}</td>
<td scope="col">${cancion.peak}</td>
<td scope="col">${cancion.sem}</td>
<td scope="col">${cancion.puntuacion}</td>
<td scope="col">${cancion.numeros_1}</td>
<td scope="col">${cancion.top_5}</td>
<td scope="col">${cancion.top_10}</td>
<td scope="col">${cancion.fecha_debut}</td>
<td scope="col">${cancion.fecha_peak}</td>


</tr>
</thead>`;
        return html;
    },

    asCardGallery: async function () {
        let { data, error } = await supabase
                    .from("vista_artista_canciones")
                    .select("*")
                    .eq("nombre", "Beret")
                    .order("fecha_debut");
        let html = '';
        for (let cancion of data) {
            html += this.asCard(cancion);
        }
        return html;
    }
};
export { cancionRenderer };