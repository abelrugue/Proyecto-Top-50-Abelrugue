"use strict";
import { parseHTML } from "/js/utils/parseHTML.js";
import { puestoRenderer } from "/js/renderers/puesto.js";
const galleryRenderer = {
    asCardGallery: function (data, hitos) {
        let galleryContainer = parseHTML('<div class="photo-gallery row p - 2 bg - light"> </div>');
        for (let puesto of data) {
            galleryContainer.appendChild(puestoRenderer.asCard(puesto, hitos));
        }
        return galleryContainer;
    }
}
export { galleryRenderer };