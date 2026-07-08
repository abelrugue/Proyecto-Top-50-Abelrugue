"use strict";

import { supabase } from "../supabase.js";

const cancionRenderer = {
    asCard: function (cancion) {

        let num1= "";
        if(cancion.numeros_1==1){
            num1=`style="background-color: rgb(255, 227, 67);"`;
        }else if(cancion.numeros_1==2){
            num1=`style="background-color: rgb(255, 162, 63);"`;
        }else if(cancion.numeros_1==3){
            num1=`style="background-color: rgb(255, 60, 60);"`;
        }

        let html = `<tr ${num1}>
<td scope="col">${cancion.titulo}</td>
<td scope="col" class="max-cell">${cancion.artistas}</td>
<td scope="col">${cancion.peak}</td>
<td scope="col">${cancion.sem}</td>
<td scope="col">${cancion.puntuacion}</td>
<td scope="col">${cancion.numeros_1}</td>
<td scope="col">${cancion.top_5}</td>
<td scope="col">${cancion.top_10}</td>
<td scope="col">${cancion.fecha_debut}</td>
<td scope="col">${cancion.fecha_peak}</td>


</tr>`;
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