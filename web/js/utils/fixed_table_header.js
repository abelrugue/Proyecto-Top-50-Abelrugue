function activarCabecerasFijas() {

    const tablas = document.querySelectorAll(".tabla-scroll");

    tablas.forEach(contenedor => {

        const tabla = contenedor.querySelector("table");
        const thead = tabla?.querySelector("thead");

        if (!tabla || !thead) return;

        let cabeceraFija = null;

        function crearCabecera() {

            if (cabeceraFija) return;

            cabeceraFija = document.createElement("div");
            cabeceraFija.className = "tabla-header-fijo";

            const tablaFija = document.createElement("table");
            tablaFija.className = tabla.className;

            const theadFijo = thead.cloneNode(true);

            tablaFija.appendChild(theadFijo);
            cabeceraFija.appendChild(tablaFija);

            document.body.appendChild(cabeceraFija);

            actualizarAnchos();
            actualizarPosicionHorizontal();
        }

        function eliminarCabecera() {

            if (!cabeceraFija) return;

            cabeceraFija.remove();
            cabeceraFija = null;
        }

        function actualizarAnchos() {

            if (!cabeceraFija) return;

            const tablaFija = cabeceraFija.querySelector("table");
            const thOriginales = thead.querySelectorAll("th");
            const thFijos = tablaFija.querySelectorAll("th");

            /*
             * El ancho total de la tabla fija debe ser exactamente
             * el mismo que el de la tabla original.
             */
            tablaFija.style.width = `${tabla.offsetWidth}px`;

            thOriginales.forEach((th, i) => {

                if (!thFijos[i]) return;

                const ancho = th.getBoundingClientRect().width;

                thFijos[i].style.width = `${ancho}px`;
                thFijos[i].style.minWidth = `${ancho}px`;
                thFijos[i].style.maxWidth = `${ancho}px`;
            });

            /*
             * La cabecera fija tiene la misma altura que la original.
             */
            cabeceraFija.style.height = `${thead.offsetHeight}px`;
        }

        function actualizarPosicionHorizontal() {

            if (!cabeceraFija) return;

            const rect = contenedor.getBoundingClientRect();

            cabeceraFija.style.left = `${rect.left}px`;
            cabeceraFija.style.width = `${rect.width}px`;
            cabeceraFija.style.maxWidth = `${rect.width}px`;
            cabeceraFija.style.overflow = "hidden";

            const tablaFija = cabeceraFija.querySelector("table");

            tablaFija.style.transform =
                `translateX(${-contenedor.scrollLeft}px)`;
        }

        function actualizar() {

            const rect = contenedor.getBoundingClientRect();

            /*
             * La cabecera aparece cuando la parte superior de la tabla
             * ha pasado por arriba de la pantalla.
             *
             * Y desaparece cuando hemos llegado al final de la tabla.
             */
            const alturaCabecera = thead.offsetHeight;

            const debeFijarse =
                rect.top <= 0 &&
                rect.bottom > alturaCabecera;

            if (debeFijarse) {

                crearCabecera();

                /*
                 * Ocultamos visualmente la cabecera original.
                 * Su espacio sigue existiendo, por lo que la tabla
                 * no cambia de tamaño.
                 */
                thead.style.visibility = "hidden";

                actualizarAnchos();
                actualizarPosicionHorizontal();

            } else {

                thead.style.visibility = "visible";

                eliminarCabecera();
            }
        }

        /*
         * Scroll vertical de la página.
         */
        window.addEventListener("scroll", actualizar, {
            passive: true
        });

        /*
         * Scroll horizontal de la tabla.
         */
        contenedor.addEventListener("scroll", actualizarPosicionHorizontal, {
            passive: true
        });

        /*
         * Cambios de tamaño de ventana.
         */
        window.addEventListener("resize", () => {

            actualizar();

            if (cabeceraFija) {
                actualizarAnchos();
                actualizarPosicionHorizontal();
            }

        });

        /*
         * Primera comprobación.
         */
        actualizar();
    });
}


/*
 * Esperamos a que el HTML esté completamente cargado.
 */
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        activarCabecerasFijas
    );

} else {

    activarCabecerasFijas();
}