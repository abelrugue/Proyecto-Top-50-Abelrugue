"use strict";

import { supabase } from "../supabase.js";

const cancionRenderer = {
    asCard: function (cancion, tipo) {

        let num1 = "";
        if (cancion.numeros_1 == 1) {
            if (tipo == "entradas") {
                num1 = `style="background-color: rgb(255, 227, 67);"`;
            }
        } else if (cancion.numeros_1 == 2) {
            num1 = `style="background-color: rgb(255, 162, 63);"`;
        } else if (cancion.numeros_1 == 3) {
            num1 = `style="background-color: rgb(255, 60, 60);"`;
        }

        let repeticion = "";
        if (cancion.numeros_1 > 1){
            repeticion = `x${cancion.numeros_1}`
        }

        let html = `<tr ${num1}>
        <td scope="col" class="portada-cell"><img src="${cancion.portada_url && cancion.portada_url !== 'NO_ENCONTRADA' ? cancion.portada_url : 'https://quinpart.com/imgs/placeholder.svg'}"
         class="rounded portada-img"></td>
<td scope="col">${cancion.titulo}</td>
<td scope="col" class="artistas-cell">${cancion.artistas}</td>
<td scope="col">${cancion.peak}${repeticion}</td>
<td scope="col">${cancion.sem}</td>
<td scope="col">${cancion.puntuacion}</td>
<td scope="col">${cancion.top_5}</td>
<td scope="col">${cancion.top_10}</td>
<td scope="col">${cancion.fecha_debut}</td>
<td scope="col">${cancion.fecha_peak}</td>


</tr>`;
        return html;
    }
};
export { cancionRenderer };