"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
import { puestoRenderer } from "/js/renderers/puesto.js";
const galleryRenderer = {
    asCardGallery: function (data, hitos, rdps, salidas) {
        let galleryContainer = parseHTML('<div class="photo-gallery row p - 2 bg - light"> </div>');
        for (let puesto of data) {
            galleryContainer.appendChild(puestoRenderer.asCard(puesto, hitos, rdps));
        }
        galleryContainer.appendChild(parseHTML(`<div class="row text-center">
            <div class="col-md">
                <h3>Salidas</h3>
            </div>
            <hr>
        </div>`));
        for (let salida of salidas) {
            galleryContainer.appendChild(puestoRenderer.asCardSalida(salida));
        }
        return galleryContainer;
    }
}
export { galleryRenderer };