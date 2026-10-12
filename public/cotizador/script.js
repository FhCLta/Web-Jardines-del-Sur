// Los catalogos de precios ya NO viven aqui: son la fuente unica
// data/precios.json, que tambien alimenta al sitio web. precios.js lo genera
// `node scripts/gen-cotizador-precios.mjs` y se carga con un <script> ANTES
// que este archivo (sincrono a proposito: el arranque del cotizador no puede
// depender de una descarga).
//
// Si falta, se avisa fuerte y se detiene: sin precios el cotizador calcularia
// con `undefined` y sacaria cotizaciones en ceros sin que nadie lo note.
if (!window.COTIZADOR_PRECIOS) {
    alert("No se pudieron cargar los precios (falta precios.js). No uses esta cotizacion: los importes saldrian incorrectos.");
    throw new Error("COTIZADOR_PRECIOS no esta disponible: falta cargar precios.js antes de script.js");
}

document.addEventListener("DOMContentLoaded", function () {
    // --- INICIO: Configuración inicial de fechas ---
    const fechaCotizacionInput = document.getElementById("fechaCotizacion");
    const fechaVigenciaInput = document.getElementById("fechaVigencia");

    if (fechaCotizacionInput && fechaVigenciaInput) {
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(hoy.getDate() + 1);

        // Asegurarse de que la zona horaria no afecte la fecha
        const hoyStr = new Date(hoy.getTime() - (hoy.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        const mananaStr = new Date(manana.getTime() - (manana.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

        fechaCotizacionInput.value = hoyStr;
        fechaVigenciaInput.value = mananaStr;
    }
    // --- FIN: Configuración inicial de fechas ---

    const azularSelect = document.getElementById("Azular");
    const prototipoSelect = document.getElementById("prototipo");
    const porcentajeGastosEscrituracionSelect = document.getElementById("porcentajeGastosEscrituracion");
    const porcentajeGastosPrint = document.getElementById("porcentajeGastosPrint");
    let gastosTitulacionManuallyEdited = false; // Flag para detectar edición manual

    // Datos según el desarrollo seleccionado
    const datosAzular = window.COTIZADOR_PRECIOS.datosAzular;

    const datosDepartamentosJardines6 = window.COTIZADOR_PRECIOS.datosDepartamentosJardines6;

    const datosDepartamentosLirios2 = window.COTIZADOR_PRECIOS.datosDepartamentosLirios2;

    // Referencia al selector único de departamentos
    const departamentoSelect = document.getElementById("departamentoSelect");
    const departamentoContainer = document.getElementById("departamentoContainer");
    const prototipoContainer = document.getElementById("prototipoContainer");

    // Generar opciones del selector de departamentos (Modelo + Planta)
    function generarOpcionesDepartamentos(catalogo) {
        catalogo = catalogo || datosDepartamentosJardines6;
        departamentoSelect.innerHTML = '<option value="">Seleccione...</option>';
        const ordenPlantas = ["PB", "1", "2", "3"];
        Object.keys(catalogo).forEach(modelo => {
            ordenPlantas.forEach(planta => {
                if (!catalogo[modelo][planta]) return;
                const datos = catalogo[modelo][planta];
                const option = document.createElement("option");
                option.value = `${modelo}-${planta}`;
                option.textContent = datos.prototipo;
                departamentoSelect.appendChild(option);
            });
        });
    }

    function actualizarCuotaContingencia(desarrollo) {
        const monto = window.COTIZADOR_PRECIOS.cuotasContingencia[desarrollo] ?? 4000;
        const formato = monto.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        const otrosGastosInput = document.getElementById("otrosGastos");
        const infoCuotaInput = document.getElementById("infoCuotaContingencia");
        if (otrosGastosInput) otrosGastosInput.value = formato;
        if (infoCuotaInput) infoCuotaInput.value = formato;
    }

    function actualizarOpcionesPrecioMetrosExcedentes(precioTerrenoExcedente) {
        const datalist = document.getElementById("precio-metros-excedentes-options");
        if (!datalist) return;

        datalist.innerHTML = "";
        const monto = parseFloat(precioTerrenoExcedente) || 0;
        if (monto <= 0) return;

        const option = document.createElement("option");
        option.value = monto.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        datalist.appendChild(option);
    }

    azularSelect.addEventListener("change", function () {
        prototipoSelect.innerHTML = '<option value="">Seleccione...</option>';
        let seleccion = this.value;
        actualizarCuotaContingencia(seleccion);

        // La direccion que el selector escribio sola en "# de la Unidad" se
        // borra al cambiar de desarrollo; si el asesor la escribio a mano, se queda.
        const unidadInput = document.getElementById("letrasNumeros");
        if (unidadInput && unidadInput.dataset.autoUnidad && unidadInput.value === unidadInput.dataset.autoUnidad) {
            unidadInput.value = "";
        }
        if (unidadInput) delete unidadInput.dataset.autoUnidad;

        if (seleccion && datosAzular[seleccion]) {
            // La Rioja 2 trae su lista CASA POR CASA (`unidades`): una opcion por
            // casa con su direccion. El value sigue siendo la clave del catalogo
            // (varias casas comparten precio), asi que el resto del cotizador no
            // cambia. Los demas desarrollos siguen con su lista de modelos.
            const unidades = datosAzular[seleccion].unidades;
            if (Array.isArray(unidades) && unidades.length) {
                unidades.forEach(u => {
                    const option = document.createElement("option");
                    option.value = u.clave;
                    option.textContent = u.etiqueta;
                    option.dataset.unidad = u.unidad;
                    prototipoSelect.appendChild(option);
                });
            } else {
                datosAzular[seleccion].modelos.forEach(modelo => {
                    let option = document.createElement("option");
                    option.value = modelo;
                    option.textContent = modelo;
                    prototipoSelect.appendChild(option);
                });
            }

            let precioTerrenoExcedente = datosAzular[seleccion].precioTerrenoExcedente;
            const precioMetrosExcedentesInput = document.getElementById("precioMetrosExcedentes");
            sessionStorage.setItem("precioTerrenoExcedente", precioTerrenoExcedente);
            actualizarOpcionesPrecioMetrosExcedentes(precioTerrenoExcedente);

            if (seleccion === "Azular1" || seleccion === "LaRioja2") {
                sessionStorage.setItem("precioTerrenoExcedente", precioTerrenoExcedente);
                precioMetrosExcedentesInput.readOnly = false;
                precioMetrosExcedentesInput.value = precioTerrenoExcedente > 0
                    ? precioTerrenoExcedente.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
                    : "";
            } else {
                precioMetrosExcedentesInput.readOnly = true;
                precioMetrosExcedentesInput.value = precioTerrenoExcedente.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
            }
        } else {
            console.warn("⚠️ Selección no válida:", seleccion);
            actualizarOpcionesPrecioMetrosExcedentes(0);
        }

        // 🔴 Nueva lógica para ocultar los campos de terreno excedente
        const terrenoExcedenteContainer = document.getElementById("terrenoExcedenteContainer");
        const labelPrecioTotalCasa = document.getElementById("labelPrecioTotalCasa");
        const labelPrecioNetoCasa = document.getElementById("labelPrecioNetoCasa");
        const labelPrecioNetoCasa3 = document.getElementById("labelPrecioNetoCasa3");
        const labelPrecioTotalDepartamento = document.getElementById("labelPrecioTotalDepartamento");
        const labelPrecioNetoDepartamento = document.getElementById("labelPrecioNetoDepartamento");
        const labelPrecioNetoDepartamento3 = document.getElementById("labelPrecioNetoDepartamento3");

        if (seleccion === "Azular1-Depas" || seleccion === "Lirios2-Depas") {
            document.body.classList.add("es-departamento");

            if (departamentoContainer) departamentoContainer.classList.remove("hidden");
            if (prototipoContainer) prototipoContainer.classList.add("hidden");

            const catalogoActivo = seleccion === "Lirios2-Depas" ? datosDepartamentosLirios2 : datosDepartamentosJardines6;
            generarOpcionesDepartamentos(catalogoActivo);
            if (departamentoSelect) departamentoSelect.value = "";

            if (terrenoExcedenteContainer) terrenoExcedenteContainer.style.display = "none";

            // Jardines del Sur 6 Departamentos no usa equipamiento; solo valor, descuento y neto.
            const equipamientoContainer = document.getElementById("equipamientoContainer");
            if (equipamientoContainer) equipamientoContainer.classList.add("hidden");
            const equipamientoInput = document.getElementById("equipamiento");
            const toggleEquipamiento = document.getElementById("toggleEquipamiento");
            if (equipamientoInput) equipamientoInput.value = "$0.00";
            if (toggleEquipamiento) toggleEquipamiento.checked = true;

            // Ocultar Precio Total del Departamento (ya no se usa)
            const precioTotalContainer = document.getElementById("precioTotalContainer");
            if (precioTotalContainer) precioTotalContainer.style.display = "none";

            // Cambiar etiqueta de Precio de Lista
            const labelPrecioLista = document.getElementById("labelPrecioLista");
            const labelPrecioListaDepa = document.getElementById("labelPrecioListaDepa");
            if (labelPrecioLista) labelPrecioLista.classList.add("hidden");
            if (labelPrecioListaDepa) labelPrecioListaDepa.classList.remove("hidden");

            // Ocultar etiquetas de casa
            if (labelPrecioTotalCasa) labelPrecioTotalCasa.classList.add("hidden");
            if (labelPrecioNetoCasa) labelPrecioNetoCasa.classList.add("hidden");
            if (labelPrecioNetoCasa3) labelPrecioNetoCasa3.classList.add("hidden");

            // Mostrar etiquetas de departamento
            if (labelPrecioTotalDepartamento) labelPrecioTotalDepartamento.classList.remove("hidden");
            if (labelPrecioNetoDepartamento) labelPrecioNetoDepartamento.classList.remove("hidden");
            if (labelPrecioNetoDepartamento3) labelPrecioNetoDepartamento3.classList.remove("hidden");

        } else {
            console.log("🟢 Mostrando campos de terreno y casas, ocultando departamentos");
            document.body.classList.remove("es-departamento");

            // Ocultar selector de departamentos, mostrar selector de Prototipo
            if (departamentoContainer) departamentoContainer.classList.add("hidden");
            if (prototipoContainer) prototipoContainer.classList.remove("hidden");

            if (terrenoExcedenteContainer) terrenoExcedenteContainer.style.display = "block";

            // Mostrar campo de Esquina para casas
            const esquinaContainer = document.getElementById("esquinaContainer");
            if (esquinaContainer) esquinaContainer.style.display = "flex";

            // Ocultar campo de Equipamiento para casas
            const equipamientoContainer = document.getElementById("equipamientoContainer");
            if (equipamientoContainer) equipamientoContainer.classList.add("hidden");

            // Mantener Precio Total oculto; Valor Avalúo es el único valor principal visible.
            const precioTotalContainer = document.getElementById("precioTotalContainer");
            if (precioTotalContainer) precioTotalContainer.style.display = "none";

            // Restaurar etiqueta de Precio de Lista
            const labelPrecioLista = document.getElementById("labelPrecioLista");
            const labelPrecioListaDepa = document.getElementById("labelPrecioListaDepa");
            if (labelPrecioLista) labelPrecioLista.classList.remove("hidden");
            if (labelPrecioListaDepa) labelPrecioListaDepa.classList.add("hidden");

            // Mostrar etiquetas de casa
            if (labelPrecioTotalCasa) labelPrecioTotalCasa.classList.remove("hidden");
            if (labelPrecioNetoCasa) labelPrecioNetoCasa.classList.remove("hidden");
            if (labelPrecioNetoCasa3) labelPrecioNetoCasa3.classList.remove("hidden");

            // Ocultar etiquetas de departamento
            if (labelPrecioTotalDepartamento) labelPrecioTotalDepartamento.classList.add("hidden");
            if (labelPrecioNetoDepartamento) labelPrecioNetoDepartamento.classList.add("hidden");
            if (labelPrecioNetoDepartamento3) labelPrecioNetoDepartamento3.classList.add("hidden");
        }

        if (typeof actualizarDisponibilidadModoPrecioManual === "function") actualizarDisponibilidadModoPrecioManual();
        if (typeof actualizarCalculoFinal === "function") actualizarCalculoFinal();
    });

    function obtenerPlanVentaActual() {
        return document.getElementById("planVenta")?.value || "bancario";
    }

    function obtenerCobroAvaluo(datos) {
        return parseFloat(datos?.avaluo) || 0;
    }

    function obtenerValorAvaluo(datos) {
        const valorAvaluo = parseFloat(datos?.valorAvaluo);
        if (Number.isFinite(valorAvaluo) && valorAvaluo > 0) return valorAvaluo;
        return parseFloat(datos?.precioLista) || 0;
    }

    function obtenerPorcentajeEscrituracionAutomatico() {
        try {
            const porcentajes = JSON.parse(sessionStorage.getItem("porcentajesEscrituracion") || "{}");
            const porcentaje = parseFloat(porcentajes[obtenerPlanVentaActual()]);
            return Number.isFinite(porcentaje) && porcentaje > 0 ? porcentaje : null;
        } catch (error) {
            return null;
        }
    }

    function guardarDatosCotizacion(datos) {
        const precioLista = parseFloat(datos.precioLista) || 0;
        const bonoDescuento = parseFloat(datos.bono) || 0;
        const valorAvaluo = obtenerValorAvaluo(datos);
        const gastosAvaluo = obtenerCobroAvaluo(datos);

        sessionStorage.setItem("precioLista", precioLista);
        sessionStorage.setItem("bonoDescuento", bonoDescuento);
        sessionStorage.setItem("precioListaCatalogo", precioLista);
        sessionStorage.setItem("bonoDescuentoCatalogo", bonoDescuento);
        sessionStorage.setItem("valorAvaluo", valorAvaluo);
        sessionStorage.setItem("gastosAvaluo", gastosAvaluo);
        sessionStorage.setItem("porcentajesEscrituracion", JSON.stringify(datos.porcentajesEscrituracion || {}));

        document.getElementById("precioLista").value = precioLista.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        document.getElementById("bono").value = bonoDescuento.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        document.getElementById("avaluo").value = gastosAvaluo.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    }

    const modoPrecioManualContainer = document.getElementById("modoPrecioManualContainer");
    const togglePrecioManual = document.getElementById("togglePrecioManual");
    const precioListaInput = document.getElementById("precioLista");
    const bonoInput = document.getElementById("bono");

    function parsearMonto(valor) {
        return parseFloat((valor || "").replace(/[^0-9.-]+/g, "")) || 0;
    }

    function formatearMoneda(valor) {
        return (parseFloat(valor) || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    }

    function esDesarrolloCasas() {
        const desarrollo = azularSelect?.value || "";
        return desarrollo === "Azular1" || desarrollo === "LaRioja2";
    }

    function esDesarrolloDepartamentos() {
        const desarrollo = azularSelect?.value || "";
        return desarrollo === "Azular1-Depas" || desarrollo === "Lirios2-Depas";
    }

    function esDesarrolloConPrecioManual() {
        return esDesarrolloCasas() || esDesarrolloDepartamentos();
    }

    function tieneSeleccionPrecioManual() {
        if (esDesarrolloCasas()) return Boolean(prototipoSelect?.value);
        if (esDesarrolloDepartamentos()) return Boolean(departamentoSelect?.value);
        return false;
    }

    function esModoPrecioManualActivo() {
        return Boolean(togglePrecioManual?.checked && esDesarrolloConPrecioManual() && tieneSeleccionPrecioManual());
    }

    function actualizarCamposPrecioManual() {
        const modoActivo = esModoPrecioManualActivo();
        if (precioListaInput) precioListaInput.readOnly = !modoActivo;
        if (bonoInput) bonoInput.readOnly = !modoActivo;
        if (togglePrecioManual) togglePrecioManual.disabled = !(esDesarrolloConPrecioManual() && tieneSeleccionPrecioManual());
    }

    function desactivarModoPrecioManual() {
        if (togglePrecioManual) togglePrecioManual.checked = false;
        actualizarCamposPrecioManual();
    }

    function restaurarPrecioCatalogo() {
        const precioCatalogo = parseFloat(sessionStorage.getItem("precioListaCatalogo")) || 0;
        const bonoCatalogo = parseFloat(sessionStorage.getItem("bonoDescuentoCatalogo")) || 0;
        if (precioCatalogo > 0) sessionStorage.setItem("precioLista", precioCatalogo);
        sessionStorage.setItem("bonoDescuento", bonoCatalogo);
        if (bonoInput) bonoInput.value = formatearMoneda(bonoCatalogo);
    }

    function actualizarPrecioTerrenoManual() {
        const precioMetrosExcedentesInput = document.getElementById("precioMetrosExcedentes");
        if (!precioMetrosExcedentesInput) return;

        if (esModoPrecioManualActivo()) {
            precioMetrosExcedentesInput.value = "";
            return;
        }

        const precioTerrenoExcedente = parseFloat(sessionStorage.getItem("precioTerrenoExcedente")) || 0;
        if (!precioMetrosExcedentesInput.readOnly && precioTerrenoExcedente > 0) {
            precioMetrosExcedentesInput.value = formatearMoneda(precioTerrenoExcedente);
        }
    }

    function actualizarDisponibilidadModoPrecioManual() {
        const mostrarControl = esDesarrolloConPrecioManual();
        if (modoPrecioManualContainer) {
            modoPrecioManualContainer.classList.toggle("hidden", !mostrarControl);
        }
        if (!mostrarControl || !tieneSeleccionPrecioManual()) {
            if (togglePrecioManual) togglePrecioManual.checked = false;
        }
        actualizarCamposPrecioManual();
    }

    if (togglePrecioManual) {
        togglePrecioManual.addEventListener("change", function () {
            if (!this.checked) {
                restaurarPrecioCatalogo();
            }
            actualizarCamposPrecioManual();
            actualizarPrecioTerrenoManual();
            actualizarValores();
        });
    }

    if (precioListaInput) {
        precioListaInput.addEventListener("focus", function () {
            if (!esModoPrecioManualActivo()) return;
            this.value = formatearMoneda(sessionStorage.getItem("precioLista"));
        });
        precioListaInput.addEventListener("blur", function () {
            if (!esModoPrecioManualActivo()) return;
            const valor = parsearMonto(this.value);
            const valorPrevio = parseFloat(sessionStorage.getItem("precioLista")) || 0;
            sessionStorage.setItem("precioLista", valor > 0 ? valor : valorPrevio);
            actualizarValores();
        });
    }

    if (bonoInput) {
        bonoInput.addEventListener("blur", function () {
            if (!esModoPrecioManualActivo()) return;
            const valor = parsearMonto(this.value);
            const valorPrevio = parseFloat(sessionStorage.getItem("bonoDescuento")) || 0;
            sessionStorage.setItem("bonoDescuento", valor >= 0 ? valor : valorPrevio);
            this.value = formatearMoneda(sessionStorage.getItem("bonoDescuento"));
            actualizarValores();
        });
    }

    prototipoSelect.addEventListener("change", function () {
        desactivarModoPrecioManual();
        gastosTitulacionManuallyEdited = false; // Reiniciar el flag al cambiar de modelo
        let modeloSeleccionado = this.value;

        // Opcion de una casa concreta (La Rioja 2): su direccion va a "# de la Unidad".
        const unidadElegida = this.options[this.selectedIndex]?.dataset.unidad;
        const unidadInput = document.getElementById("letrasNumeros");
        if (unidadElegida && unidadInput) {
            unidadInput.value = unidadElegida;
            unidadInput.dataset.autoUnidad = unidadElegida;
        }
        let desarrolloSeleccionado = azularSelect.value;

        // Datos para La Rioja 2 - Casas
        const datosLaRioja2 = window.COTIZADOR_PRECIOS.datosLaRioja2;

        // Datos para Jardines del Sur 6 - Casas
        const datosCasas1 = window.COTIZADOR_PRECIOS.datosCasas1;

        // 📌 Determinar qué conjunto de datos usar
        let datosModelo;
        if (desarrolloSeleccionado === "Azular1") {
            datosModelo = datosCasas1;
        } else if (desarrolloSeleccionado === "LaRioja2") {
            datosModelo = datosLaRioja2;
        } else {
            console.warn("⚠️ Desarrollo no reconocido:", desarrolloSeleccionado);
            return;
        }

        // 📌 Verificar si el modelo seleccionado existe en el conjunto de datos
        if (datosModelo && modeloSeleccionado in datosModelo) {
            guardarDatosCotizacion(datosModelo[modeloSeleccionado]);
            actualizarDisponibilidadModoPrecioManual();

            actualizarValores(); // Esto calculará y guardará el valor de escrituración

            // Actualizamos el campo de titulación directamente aquí
            const gastosEscrituracion = parseFloat(sessionStorage.getItem("gastosEscrituracion")) || 0;
            document.getElementById("gastosTitulacion").value = gastosEscrituracion.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        } else {
            console.warn("⚠️ Modelo no encontrado en el desarrollo:", desarrolloSeleccionado, "Modelo:", modeloSeleccionado);
            actualizarDisponibilidadModoPrecioManual();
        }
    });

    // --- INICIO: Event listener para selector único de Departamentos ---
    if (departamentoSelect) {
        departamentoSelect.addEventListener("change", function () {
            desactivarModoPrecioManual();
            gastosTitulacionManuallyEdited = false;
            const seleccion = this.value; // Formato: "MODELO-PLANTA"
            
            if (!seleccion) return;
            
            // El separador es el ULTIMO guion: la clave del modelo puede traer
            // uno dentro (los edificios del Capua de Lirios son "P-4" y "L-1"),
            // pero la planta nunca lo trae — es "PB", "1", "2" o "3".
            const corte = seleccion.lastIndexOf("-");
            const modelo = seleccion.slice(0, corte);
            const planta = seleccion.slice(corte + 1);
            const desarrolloActual = azularSelect.value;
            const catalogoActivo = desarrolloActual === "Lirios2-Depas"
                ? datosDepartamentosLirios2
                : datosDepartamentosJardines6;

            if (catalogoActivo[modelo] && catalogoActivo[modelo][planta]) {
                const datos = catalogoActivo[modelo][planta];
                
                guardarDatosCotizacion(datos);
                actualizarDisponibilidadModoPrecioManual();

                actualizarValores();

                const gastosEscrituracion = parseFloat(sessionStorage.getItem("gastosEscrituracion")) || 0;
                document.getElementById("gastosTitulacion").value = gastosEscrituracion.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
                
                console.log(`Departamento seleccionado: ${datos.prototipo}`);
            }
        });
    }
    // --- FIN: Event listener para selector único de Departamentos ---


    // --- INICIO: Lógica del Toggle de Equipamiento ---
    const toggleEquipamiento = document.getElementById("toggleEquipamiento");
    const equipamientoInput = document.getElementById("equipamiento");
    const VALOR_EQUIPAMIENTO = 85000;

    if (toggleEquipamiento && equipamientoInput) {
        // Toggle ON = CON equipamiento (no hay descuento, mostrar $0)
        // Toggle OFF = SIN equipamiento (se descuenta, mostrar -$85,000)
        toggleEquipamiento.addEventListener("change", function () {
            if (this.checked) {
                equipamientoInput.value = "$0.00"; // Con equipamiento, no hay descuento
            } else {
                equipamientoInput.value = "-" + VALOR_EQUIPAMIENTO.toLocaleString("es-MX", { style: "currency", currency: "MXN" }); // Sin equipamiento, se descuenta
            }
            actualizarValores();
        });
        // Inicializar valor correcto
        equipamientoInput.value = "$0.00";
    }
    // --- FIN: Lógica del Toggle de Equipamiento ---

    function actualizarValores() {
        let metrosExcedentes = parseFloat(document.getElementById("metrosExcedentes").value) || 0;
        const precioMetrosExcedentesInput = document.getElementById("precioMetrosExcedentes");
        const precioMetrosExcedentesManual = parsearMonto(precioMetrosExcedentesInput.value);
        let precioMetrosExcedentes = precioMetrosExcedentesManual;
        if (!esModoPrecioManualActivo() && precioMetrosExcedentes <= 0) {
            precioMetrosExcedentes = parseFloat(sessionStorage.getItem("precioTerrenoExcedente")) || 0;
        }
        let precioLista = parseFloat(sessionStorage.getItem("precioLista")) || 0;
        let bonoDescuento = parseFloat(sessionStorage.getItem("bonoDescuento")) || 0;
        let esquina = parseFloat(document.getElementById("esquina").value.replace(/[^0-9.-]+/g, "")) || 0;

        // Obtener valor del equipamiento (solo aplica para departamentos)
        // Usamos Math.abs porque el campo puede mostrar valor negativo visualmente
        let equipamiento = Math.abs(parseFloat(document.getElementById("equipamiento").value.replace(/[^0-9.-]+/g, "")) || 0);
        let desarrolloSeleccionado = document.getElementById("Azular").value;

        if (metrosExcedentes < 0 || precioMetrosExcedentes < 0 || precioLista < 0 || bonoDescuento < 0 || esquina < 0) {
            console.error("⚠️ Valores negativos detectados en los cálculos.");
            return;
        }

        let valorTerrenoExcedente = metrosExcedentes * precioMetrosExcedentes;
        document.getElementById("valorTerrenoExcedente").value = valorTerrenoExcedente.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        // Calcular valor avalúo y precio neto según el tipo de desarrollo
        let valorAvaluoActual;
        let precioNetoCasa;

        if (desarrolloSeleccionado === "Azular1-Depas" || desarrolloSeleccionado === "Lirios2-Depas") {
            // DEPARTAMENTOS: Valor Avalúo = Precio Lista; Precio Neto = Precio Lista - equipamiento - bono
            // El campo "equipamiento" representa el DESCUENTO ($85,000 si toggle OFF, $0 si ON).
            // En Lirios2-Depas el equipamiento siempre es $0 (toggle oculto).
            valorAvaluoActual = precioLista;
            precioNetoCasa = precioLista - equipamiento - bonoDescuento;
        } else {
            // CASAS: el Valor Avalúo incluye terreno excedente y esquina.
            valorAvaluoActual = precioLista + valorTerrenoExcedente + esquina;
            precioNetoCasa = valorAvaluoActual - bonoDescuento;
        }

        const valorAvaluoFormato = valorAvaluoActual.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        document.getElementById("precioTotalCasa").value = valorAvaluoFormato;
        if (precioLista > 0 || valorAvaluoActual > 0) {
            document.getElementById("precioLista").value = valorAvaluoFormato;
            sessionStorage.setItem("valorAvaluo", valorAvaluoActual);
        }
        document.getElementById("precioNetoCasa").value = precioNetoCasa.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        sessionStorage.setItem("precioTotalCasa", valorAvaluoActual);

        // Gastos de escrituración y créditos se calculan sobre Valor Avalúo.
        let baseEscrituracion = valorAvaluoActual;
        const porcentajeAutomatico = obtenerPorcentajeEscrituracionAutomatico();
        const porcentajeEscrituracion = porcentajeAutomatico || parseFloat(porcentajeGastosEscrituracionSelect?.value) || 0.07;
        if (porcentajeAutomatico && porcentajeGastosEscrituracionSelect) {
            porcentajeGastosEscrituracionSelect.value = porcentajeAutomatico.toString();
        }
        if (porcentajeGastosPrint) {
            porcentajeGastosPrint.textContent = `(${(porcentajeEscrituracion * 100).toFixed(1).replace('.0', '')}%):`;
        }
        let gastosEscrituracion = baseEscrituracion * porcentajeEscrituracion;
        document.getElementById("gastosEscrituracion").value = gastosEscrituracion.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        // --- INICIO DE LA CORRECCIÓN MEJORADA ---
        // Solo actualiza si el usuario no lo ha editado manualmente
        if (!gastosTitulacionManuallyEdited) {
            document.getElementById("gastosTitulacion").value = gastosEscrituracion.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        }
        // --- FIN DE LA CORRECCIÓN MEJORADA ---

        sessionStorage.setItem("precioNetoCasa", precioNetoCasa);
        sessionStorage.setItem("gastosEscrituracion", gastosEscrituracion);

        actualizarFinanciamiento();
        calcularCreditoBancarioAutomatico(); // ✅  Llamada para recalcular el crédito
        calcularCreditoInfonavitAutomatico(); // ✅  Llamada para recalcular el crédito Infonavit
        actualizarCalculoFinal(); // ✅ Llamada directa para asegurar la actualización
    }

    if (porcentajeGastosEscrituracionSelect) {
        porcentajeGastosEscrituracionSelect.addEventListener("change", actualizarValores);
    }

    // --- INICIO: Nuevo código para cálculo de crédito bancario ---
    const porcentajeCreditoBancarioInput = document.getElementById("porcentajeCreditoBancario");
    const porcentajeCreditoBancarioPrint = document.getElementById("porcentajeCreditoBancarioPrint");
    const creditoBancarioInput = document.getElementById("creditoBancario");

    function obtenerBasePorcentajeCreditoBancario() {
        return parseFloat(sessionStorage.getItem("valorAvaluo")) || parseFloat(sessionStorage.getItem("precioTotalCasa")) || 0;
    }

    function formatearPorcentajeCreditoBancario(porcentaje) {
        if (!Number.isFinite(porcentaje) || porcentaje <= 0) return "";
        return porcentaje.toFixed(2).replace(/\.?0+$/, "");
    }

    function actualizarPorcentajeCreditoBancarioManual() {
        if (!porcentajeCreditoBancarioInput || !creditoBancarioInput) return;
        if (porcentajeCreditoBancarioInput.dataset.manualPercent === "true") return;

        const credito = parseFloat(creditoBancarioInput.value.replace(/[^0-9.-]+/g, "")) || 0;
        const base = obtenerBasePorcentajeCreditoBancario();

        if (credito <= 0 || base <= 0) {
            porcentajeCreditoBancarioInput.value = "";
            porcentajeCreditoBancarioInput.dataset.autoPercent = "true";
            return;
        }

        porcentajeCreditoBancarioInput.value = formatearPorcentajeCreditoBancario((credito / base) * 100);
        porcentajeCreditoBancarioInput.dataset.autoPercent = "true";
        actualizarPorcentajeCreditoBancarioPrint();
    }

    function actualizarPorcentajeCreditoBancarioPrint() {
        if (!porcentajeCreditoBancarioPrint || !porcentajeCreditoBancarioInput) return;
        const porcentaje = (porcentajeCreditoBancarioInput.value || "").trim();
        porcentajeCreditoBancarioPrint.textContent = porcentaje ? `(${porcentaje}%):` : ":";
    }

    function calcularCreditoBancarioAutomatico() {
        if (porcentajeCreditoBancarioInput.dataset.autoPercent === "true") {
            creditoBancarioInput.readOnly = false;
            actualizarPorcentajeCreditoBancarioPrint();
            actualizarCalculoFinal();
            return;
        }

        const porcentaje = parseFloat((porcentajeCreditoBancarioInput.value || "").replace(/[^0-9.]/g, "")) || 0;
        const baseCredito = obtenerBasePorcentajeCreditoBancario();

        if (porcentaje <= 0) {
            creditoBancarioInput.readOnly = false;
            porcentajeCreditoBancarioInput.dataset.manualPercent = "false";
            actualizarPorcentajeCreditoBancarioPrint();
            actualizarCalculoFinal();
            return;
        }

        creditoBancarioInput.readOnly = true;
        const credito = baseCredito * (porcentaje / 100);
        creditoBancarioInput.value = credito.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        actualizarPorcentajeCreditoBancarioPrint();
        actualizarCalculoFinal();
    }

    porcentajeCreditoBancarioInput.addEventListener('focus', function () {
        this.value = "";
        delete this.dataset.autoPercent;
        delete this.dataset.manualPercent;
    });
    porcentajeCreditoBancarioInput.addEventListener('input', function () {
        delete this.dataset.autoPercent;
        this.dataset.manualPercent = this.value.trim() ? "true" : "false";
        calcularCreditoBancarioAutomatico();
    });
    porcentajeCreditoBancarioInput.addEventListener('change', calcularCreditoBancarioAutomatico);
    creditoBancarioInput.addEventListener('input', actualizarPorcentajeCreditoBancarioManual);
    creditoBancarioInput.addEventListener('blur', actualizarPorcentajeCreditoBancarioManual);

    // --- INICIO: mensualidad estimada del credito bancario -------------------
    // Misma formula que la calculadora del sitio (components/MortgageCalculator.jsx,
    // modo "solo el credito"), verificada al centavo contra BBVA. Si cambia una,
    // cambia la otra: Florencio decidio que los dos digan el mismo numero.
    const TASA_ANUAL = 9.75;   // tasa promedio de mercado; se actualiza a mano
    const PLAZO_ANIOS = 20;
    const FACTOR_SEGURO_VIDA = 0.0006;    // mensual, sobre el credito
    const FACTOR_SEGURO_DANOS = 0.0002;   // mensual, sobre el valor de la vivienda
    const FACTOR_COMISION_ADMON = 0.0003; // mensual, sobre el credito
    const PROPORCION_INGRESO = 0.5;       // la mensualidad no pasa de la mitad del ingreso
    const LTV_AVALUO = 0.9;               // el banco presta ~90% del avaluo

    const fmtPesos = (n) => Math.round(n).toLocaleString("es-MX", {
        style: "currency", currency: "MXN", maximumFractionDigits: 0
    });

    function calcularMensualidadCredito(credito, valorVivienda) {
        const i = TASA_ANUAL / 100 / 12;
        const meses = PLAZO_ANIOS * 12;
        const capitalEIntereses = (credito * i) / (1 - Math.pow(1 + i, -meses));
        // El seguro de danos va sobre el valor de la vivienda. Si todavia no hay
        // avaluo capturado se estima con el avaluo minimo que sostendria ese
        // credito (credito / 90%), igual que la calculadora del sitio.
        const baseDanos = valorVivienda > 0 ? valorVivienda : credito / LTV_AVALUO;
        const seguros = credito * FACTOR_SEGURO_VIDA
            + baseDanos * FACTOR_SEGURO_DANOS
            + credito * FACTOR_COMISION_ADMON;
        const mensualidad = capitalEIntereses + seguros;
        return { mensualidad, ingreso: mensualidad / PROPORCION_INGRESO };
    }

    // Dónde va el bloque de la mensualidad. Decisión de Florencio (17 sept
    // 2026), mirando sus impresiones reales:
    // - CASAS con plan puro Bancario: debajo del Cálculo Final. Ahí la columna
    //   izquierda queda corta y el bloque llena ese hueco.
    // - Cofinavit (y cualquier otro caso): al final de la columna de Gastos,
    //   que es donde sobra espacio cuando hay dos créditos.
    // - Departamentos: igual, al final de Gastos; ahí la hoja va holgada.
    // Se MUEVE el mismo elemento, no se duplica: un solo lugar que mantener.
    // Cambia también en pantalla, a propósito: lo que se ve es lo que se imprime.
    function ubicarBloqueMensualidad(plan) {
        const bloque = document.getElementById("mensualidadGastos");
        const calculoFinal = document.getElementById("calculoFinal");
        const columnaGastos = document.querySelector(".column-2");
        if (!bloque || !calculoFinal || !columnaGastos) return;

        const bajoCalculoFinal = plan === "bancario" && esDesarrolloCasas();
        if (bajoCalculoFinal) {
            if (bloque.previousElementSibling !== calculoFinal) {
                calculoFinal.insertAdjacentElement("afterend", bloque);
            }
        } else if (bloque.parentElement !== columnaGastos || bloque.nextElementSibling) {
            columnaGastos.appendChild(bloque);
        }
    }

    function actualizarMensualidadCredito() {
        const plan = document.getElementById("planVenta")?.value || "";
        ubicarBloqueMensualidad(plan);
        const credito = parseFloat((creditoBancarioInput.value || "").replace(/[^0-9.-]+/g, "")) || 0;
        const valorVivienda = parseFloat(sessionStorage.getItem("valorAvaluo")) || 0;
        // Solo donde hay credito bancario de verdad: Bancario y Cofinavit.
        const aplica = (plan === "bancario" || plan === "cofinavit") && credito > 0;

        const contenedor = document.getElementById("mensualidadGastos");
        if (contenedor) {
            contenedor.classList.toggle("hidden", !aplica);
            if (aplica) {
                const { mensualidad, ingreso } = calcularMensualidadCredito(credito, valorVivienda);
                document.getElementById("mensualidadGastosMonto").textContent = fmtPesos(mensualidad);
                document.getElementById("mensualidadGastosIngreso").textContent = fmtPesos(ingreso);
                // Las dos leyendas salen de las MISMAS constantes del calculo: si
                // algun dia cambia la tasa o el plazo, el texto cambia solo y nunca
                // miente. La corta es para el papel, donde el espacio esta medido.
                const leyenda = document.getElementById("mensualidadGastosLeyenda");
                // Decisión de Florencio (17 sept 2026): lo que el cliente tiene
                // que entender es que es un PROMEDIO ENTRE BANCOS y que el suyo
                // puede darle otra cifra. Ya no se enumera qué incluye (el
                // cálculo SÍ lleva seguros de vida y daños y comisión de
                // administración, ver calcularMensualidadCredito).
                leyenda.querySelector(".leyenda-larga").textContent =
                    `Promedio entre bancos, a ${PLAZO_ANIOS} años y tasa promedio de `
                    + `${TASA_ANUAL}%. Tu mensualidad real depende del banco que te `
                    + `autorice el crédito.`;
                leyenda.querySelector(".leyenda-corta").textContent =
                    `Promedio entre bancos · ${PLAZO_ANIOS} años · tasa promedio `
                    + `${TASA_ANUAL}% · tu banco puede variar.`;
            }
        }

        // Infonavit/Fovissste: su mensualidad la fija el instituto, no se estima.
        const leyendaInstituto = document.getElementById("leyendaInstituto");
        if (leyendaInstituto) {
            const conInstituto = plan === "infonavit" || plan === "fovissste" || plan === "cofinavit";
            leyendaInstituto.classList.toggle("hidden", !conInstituto);
            if (conInstituto) {
                const instituto = plan === "fovissste" ? "Fovissste" : "Infonavit";
                leyendaInstituto.textContent = `La mensualidad de tu crédito ${instituto} `
                    + `la consultas directamente en tu portal de ${instituto}.`;
            }
        }

        // La hoja impresa se estira o encoge segun lo que lleve; estos dos
        // renglones cuentan, asi que hay que recalcular al mostrarlos u
        // ocultarlos (y no solo al imprimir).
        if (typeof actualizarModoCompactoPrint === "function") actualizarModoCompactoPrint();
    }

    document.getElementById("planVenta").addEventListener("change", actualizarMensualidadCredito);
    actualizarMensualidadCredito();
    // --- FIN: mensualidad estimada del credito bancario ----------------------
    // --- FIN: Nuevo código ---

    // --- INICIO: Nuevo código para cálculo de crédito INFONAVIT ---
    const porcentajeCreditoInfonavitInput = document.getElementById("porcentajeCreditoInfonavit");
    const porcentajeCreditoInfonavitPrint = document.getElementById("porcentajeCreditoInfonavitPrint");
    const creditoInfonavitInput = document.getElementById("creditoInfonavit");

    function actualizarPorcentajeCreditoInfonavitPrint() {
        if (!porcentajeCreditoInfonavitPrint || !porcentajeCreditoInfonavitInput) return;
        const porcentaje = (porcentajeCreditoInfonavitInput.value || "").trim();
        porcentajeCreditoInfonavitPrint.textContent = porcentaje ? `(${porcentaje}%):` : ":";
    }

    function actualizarPorcentajeCreditoInfonavitManual() {
        if (!porcentajeCreditoInfonavitInput || !creditoInfonavitInput) return;
        if (porcentajeCreditoInfonavitInput.dataset.manualPercent === "true") return;

        const credito = parseFloat(creditoInfonavitInput.value.replace(/[^0-9.-]+/g, "")) || 0;
        const base = obtenerBasePorcentajeCreditoBancario();

        if (credito <= 0 || base <= 0) {
            porcentajeCreditoInfonavitInput.value = "";
            porcentajeCreditoInfonavitInput.dataset.autoPercent = "true";
            actualizarPorcentajeCreditoInfonavitPrint();
            return;
        }

        porcentajeCreditoInfonavitInput.value = formatearPorcentajeCreditoBancario((credito / base) * 100);
        porcentajeCreditoInfonavitInput.dataset.autoPercent = "true";
        actualizarPorcentajeCreditoInfonavitPrint();
    }

    function calcularCreditoInfonavitAutomatico() {
        if (!porcentajeCreditoInfonavitInput) return; // Salir si el elemento no existe

        if (porcentajeCreditoInfonavitInput.dataset.autoPercent === "true") {
            creditoInfonavitInput.readOnly = false;
            actualizarPorcentajeCreditoInfonavitPrint();
            actualizarCalculoFinal();
            return;
        }

        const porcentaje = parseFloat((porcentajeCreditoInfonavitInput.value || "").replace(/[^0-9.]/g, "")) || 0;
        const baseCredito = obtenerBasePorcentajeCreditoBancario();

        if (porcentaje <= 0) {
            creditoInfonavitInput.readOnly = false;
            porcentajeCreditoInfonavitInput.dataset.manualPercent = "false";
            actualizarPorcentajeCreditoInfonavitPrint();
            actualizarCalculoFinal();
            return;
        }

        creditoInfonavitInput.readOnly = true;
        const credito = baseCredito * (porcentaje / 100);
        creditoInfonavitInput.value = credito.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        actualizarPorcentajeCreditoInfonavitPrint();
        actualizarCalculoFinal();
    }

    if (porcentajeCreditoInfonavitInput) {
        porcentajeCreditoInfonavitInput.addEventListener('focus', function () {
            this.value = "";
            delete this.dataset.autoPercent;
            delete this.dataset.manualPercent;
        });
        porcentajeCreditoInfonavitInput.addEventListener('input', function () {
            delete this.dataset.autoPercent;
            this.dataset.manualPercent = this.value.trim() ? "true" : "false";
            calcularCreditoInfonavitAutomatico();
        });
        porcentajeCreditoInfonavitInput.addEventListener('change', calcularCreditoInfonavitAutomatico);
    }
    creditoInfonavitInput.addEventListener('input', actualizarPorcentajeCreditoInfonavitManual);
    creditoInfonavitInput.addEventListener('blur', actualizarPorcentajeCreditoInfonavitManual);
    // --- FIN: Nuevo código INFONAVIT ---

    document.getElementById("metrosExcedentes").addEventListener("input", actualizarValores);
    document.getElementById("precioMetrosExcedentes").addEventListener("input", actualizarValores);
    document.getElementById("precioMetrosExcedentes").addEventListener("blur", function () {
        let valor = parseFloat(this.value.replace(/[^0-9.-]+/g, "")) || 0;
        if (!this.readOnly) {
            this.value = valor > 0 ? valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" }) : "";
            actualizarValores();
        }
    });
    document.getElementById("esquina").addEventListener("focus", function () {
        this._savedEsquina = this.value;
        this.value = "";
    });
    document.getElementById("esquina").addEventListener("blur", function () {
        let valor = parseFloat(this.value.replace(/[^0-9.-]+/g, "")) || 0;
        if (valor === 0 && this._savedEsquina) {
            this.value = this._savedEsquina;
        } else {
            this.value = valor > 0 ? valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" }) : "";
        }
        delete this._savedEsquina;
        actualizarValores();
    });

    // ✅ Función corregida para actualizar el Tercer Bloque - Financiamiento
    function actualizarFinanciamiento() {
        let precioNetoCasa = parseFloat(sessionStorage.getItem("precioNetoCasa")) || 0;
        // Se elimina la lectura de gastosEscrituracion porque ya no se usa aquí
        let gastosAvaluo = parseFloat(sessionStorage.getItem("gastosAvaluo")) || 0;

        if (precioNetoCasa < 0 || gastosAvaluo < 0) {
            console.error("⚠️ Valores negativos detectados en los cálculos de financiamiento.");
            return;
        }

        // El valor de precioNetoCasa3 (Total a Pagar por el Cliente = Precio Neto + Gastos)
        // se calcula en actualizarCalculoFinal, donde ya se tiene gastosTotales.

        // Se elimina la línea que actualizaba "gastosTitulacion" desde aquí

        document.getElementById("avaluo").value = gastosAvaluo.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    }

    function formatearEntradaDinero(id) {
        document.getElementById(id).addEventListener("blur", function () {
            let valor = parseFloat(this.value.replace(/[^0-9.-]+/g, "")) || 0;
            this.value = valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        });
    }

    ["creditoBancario", "creditoInfonavit", "subcuentaVivienda", "comisionApertura", "apartado", "gastosTitulacion"].forEach(id => {
        formatearEntradaDinero(id);
    });

    // La Comisión de Apertura se captura directamente en el recuadro de Gastos.

    // Apartado: limpiar al enfocar para mostrar todas las opciones del datalist
    document.getElementById("apartado").addEventListener("focus", function () {
        this._savedApartado = this.value;
        this.value = "";
    });
    document.getElementById("apartado").addEventListener("blur", function () {
        let valor = parseFloat(this.value.replace(/[^0-9.-]+/g, "")) || 0;
        if (valor === 0 && this._savedApartado) {
            this.value = this._savedApartado;
        } else {
            this.value = valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        }
        delete this._savedApartado;
    });

    // modificar vista con plan de contado.
    document.getElementById("planVenta").addEventListener("change", function () {
        let planSeleccionado = this.value;

        // Clase de apoyo para ajustes visuales por plan (pantalla/impresión).
        document.body.classList.remove("plan-contado", "plan-infonavit", "plan-fovissste", "plan-bancario", "plan-cofinavit");
        document.body.classList.add(`plan-${planSeleccionado}`);

        // Referencias a los contenedores de los campos
        const creditoContainer = document.getElementById("creditoContainer");
        const comisionAperturaContainer = document.getElementById("comisionAperturaContainer");
        const avaluoContainer = document.getElementById("avaluoContainer");

        // Referencias a campos individuales dentro de creditoContainer
        const calculoCreditoBancarioContainer = document.getElementById("calculoCreditoBancarioContainer");
        const calculoCreditoInfonavitContainer = document.getElementById("calculoCreditoInfonavitContainer");
        const creditoBancarioField = document.getElementById("creditoBancario").parentNode;
        const creditoInfonavitField = document.getElementById("creditoInfonavit").parentNode;
        const subcuentaViviendaField = document.getElementById("subcuentaVivienda").parentNode;
        const labelTextoCreditoInfonavit = document.getElementById("labelTextoCreditoInfonavit");
        if (labelTextoCreditoInfonavit) {
            labelTextoCreditoInfonavit.textContent = planSeleccionado === "fovissste" ? "(-) Crédito Fovissste:" : "(-) Crédito Infonavit:";
        }

        // --- 1. Resetear la visibilidad de todos los elementos ---
        creditoContainer.style.display = "block";
        comisionAperturaContainer.style.display = "flex";
        avaluoContainer.style.display = "flex";
        calculoCreditoBancarioContainer.style.display = "flex";
        if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.style.display = "flex";
        creditoBancarioField.style.display = "flex";
        creditoInfonavitField.style.display = "flex";
        subcuentaViviendaField.style.display = "flex";

        // Quitar clase de ocultar en impresión de todos los campos
        creditoContainer.classList.remove("ocultar-impresion");
        comisionAperturaContainer.classList.remove("ocultar-impresion");
        calculoCreditoBancarioContainer.classList.remove("ocultar-impresion");
        if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.classList.remove("ocultar-impresion");
        creditoBancarioField.classList.remove("ocultar-impresion");
        creditoInfonavitField.classList.remove("ocultar-impresion");
        subcuentaViviendaField.classList.remove("ocultar-impresion");

        // --- 2. Aplicar reglas de visibilidad y limpiar valores según el plan ---
        if (planSeleccionado === "contado") {
            creditoContainer.style.display = "none";
            comisionAperturaContainer.style.display = "none";

            // Ocultar campos individuales dentro de creditoContainer
            calculoCreditoBancarioContainer.style.display = "none";
            if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.style.display = "none";
            creditoBancarioField.style.display = "none";
            creditoInfonavitField.style.display = "none";
            subcuentaViviendaField.style.display = "none";

            // Agregar clase para ocultar en impresión
            creditoContainer.classList.add("ocultar-impresion");
            comisionAperturaContainer.classList.add("ocultar-impresion");
            calculoCreditoBancarioContainer.classList.add("ocultar-impresion");
            if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.classList.add("ocultar-impresion");
            creditoBancarioField.classList.add("ocultar-impresion");
            creditoInfonavitField.classList.add("ocultar-impresion");
            subcuentaViviendaField.classList.add("ocultar-impresion");

            // Limpiar valores para que no se cuenten en el cálculo
            document.getElementById("creditoBancario").value = "";
            document.getElementById("creditoInfonavit").value = "";
            document.getElementById("subcuentaVivienda").value = "";
            document.getElementById("comisionApertura").value = "";

        } else if (planSeleccionado === "infonavit" || planSeleccionado === "fovissste") {
            // Ocultar solo los campos que no aplican
            calculoCreditoBancarioContainer.style.display = "none";
            creditoBancarioField.style.display = "none";
            comisionAperturaContainer.style.display = "none";
            if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.style.display = "flex";

            // Agregar clase para ocultar en impresión
            calculoCreditoBancarioContainer.classList.add("ocultar-impresion");
            creditoBancarioField.classList.add("ocultar-impresion");
            comisionAperturaContainer.classList.add("ocultar-impresion");

            // Limpiar sus valores
            document.getElementById("creditoBancario").value = "";
            document.getElementById("comisionApertura").value = "";
        } else if (planSeleccionado === "bancario") {
            // Ocultar crédito infonavit y subcuenta vivienda
            if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.style.display = "none";
            creditoInfonavitField.style.display = "none";
            subcuentaViviendaField.style.display = "none";
            
            // Agregar clase para ocultar en impresión
            if (calculoCreditoInfonavitContainer) calculoCreditoInfonavitContainer.classList.add("ocultar-impresion");
            creditoInfonavitField.classList.add("ocultar-impresion");
            subcuentaViviendaField.classList.add("ocultar-impresion");
            
            // Limpiar valores
            document.getElementById("creditoInfonavit").value = "";
            document.getElementById("subcuentaVivienda").value = "";

        } else if (planSeleccionado === "cofinavit") {
            // Cofinavit no lleva comisión de apertura; sí lleva subcuenta de vivienda
            comisionAperturaContainer.style.display = "none";
            comisionAperturaContainer.classList.add("ocultar-impresion");
            document.getElementById("comisionApertura").value = "";
        }

        // --- 3. Recalcular todo ---
        actualizarValores();
    });

    // cuarto bloque

    function actualizarCalculoFinal() {
        let precioNetoCasa = parseFloat(sessionStorage.getItem("precioNetoCasa")) || 0;
        let creditoBancario = parseFloat(document.getElementById("creditoBancario").value.replace(/[^0-9.-]+/g, "")) || 0;
        let creditoInfonavit = parseFloat(document.getElementById("creditoInfonavit").value.replace(/[^0-9.-]+/g, "")) || 0;
        let subcuentaVivienda = parseFloat(document.getElementById("subcuentaVivienda").value.replace(/[^0-9.-]+/g, "")) || 0;

        if (precioNetoCasa < 0 || creditoBancario < 0 || creditoInfonavit < 0 || subcuentaVivienda < 0) {
            console.error("⚠️ Valores negativos detectados en los cálculos del enganche.");
            return;
        }

        // Cálculo del Enganche
        let enganche = precioNetoCasa - creditoBancario - creditoInfonavit - subcuentaVivienda;
        document.getElementById("enganche").value = enganche.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        let gastosTitulacion = parseFloat(document.getElementById("gastosTitulacion").value.replace(/[^0-9.-]+/g, "")) || 0;
        let comisionApertura = parseFloat(document.getElementById("comisionApertura").value.replace(/[^0-9.-]+/g, "")) || 0;
        let otrosGastos = parseFloat(document.getElementById("otrosGastos").value.replace(/[^0-9.-]+/g, "")) || 0;
        let contratoAgua = parseFloat(document.getElementById("contratoAgua").value.replace(/[^0-9.-]+/g, "")) || 0;
        let satQ = parseFloat(document.getElementById("satQ").value.replace(/[^0-9.-]+/g, "")) || 0;
        let certificadoLibertadGravamen = parseFloat(document.getElementById("certificadoLibertadGravamen").value.replace(/[^0-9.-]+/g, "")) || 0;
        let avaluo = parseFloat(document.getElementById("avaluo").value.replace(/[^0-9.-]+/g, "")) || 0;

        // Cálculo de Gastos Totales
        let gastosTotales = gastosTitulacion + comisionApertura + otrosGastos + contratoAgua + satQ + certificadoLibertadGravamen + avaluo;
        document.getElementById("gastosTotales").value = gastosTotales.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        // Total a Pagar por el Cliente (Precio Neto + Gastos) en el bloque Financiamiento
        let totalAPagarCliente = precioNetoCasa + gastosTotales;
        document.getElementById("precioNetoCasa3").value = totalAPagarCliente.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        // Cálculo del Total a Pagar
        let totalPagar = enganche + gastosTotales;
        document.getElementById("totalPagar").value = totalPagar.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        // Apartado (ahora se captura directamente en Cálculo Final)
        let apartado = parseFloat(document.getElementById("apartado").value.replace(/[^0-9.-]+/g, "")) || 0;

        // Cálculo del Enganche Total a Pagar
        let engancheTotalPagar = totalPagar - apartado;
        document.getElementById("engancheTotalPagar").value = engancheTotalPagar.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        actualizarTablaEnganche(); // ✅  Actualiza la tabla dinámicamente
        actualizarMensualidadCredito(); // mensualidad estimada del crédito bancario
    }

    // Escuchar cambios en los campos del Cuarto Bloque
    ["creditoBancario", "creditoInfonavit", "subcuentaVivienda", "comisionApertura", "apartado", "gastosTitulacion"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", actualizarCalculoFinal);
        }
    });

    // 5to bloque
    const engancheTotalInput = document.getElementById("engancheTotalPagar");
    const mesesInput = document.getElementById("mesesPagarEnganche");
    const tablaEnganche = document.getElementById("tablaEnganche").querySelector("tbody");
    const totalPagos = document.getElementById("totalPagos");
    const modoCalculoEngancheSelect = document.getElementById("modoCalculoEnganche"); // Nuevo selector

    // Escuchar cambios en el número de meses y en el modo de cálculo
    mesesInput.addEventListener("input", actualizarTablaEnganche);
    modoCalculoEngancheSelect.addEventListener("change", function () {
        // 🔴 INICIO DE LA CORRECCIÓN
        // Si el usuario cambia a modo Automático, reseteamos el estado manual de los inputs.
        if (this.value === 'automatico') {
            const todosLosMontos = tablaEnganche.querySelectorAll(".monto-pago");
            todosLosMontos.forEach(input => {
                delete input.dataset.manual;
            });
        }
        // 🔴 FIN DE LA CORRECCIÓN
        actualizarTablaEnganche();
    });



    // Elige cuántas columnas usar para que el Plan de Enganche llene el ancho,
    // balanceado, con un máximo de pagos por fila. El último renglón incompleto
    // se estira (flexbox) para no dejar huecos.
    // Pantalla e impresión: hasta 6 por fila. En cantidades intermedias se
    // balancea solo: 7 -> 4+3, 9 -> 5+4, 10 -> 5+5, 12 -> 6+6.
    function columnasOptimasEnganche(n, maxPorFila) {
        if (n <= 1) return 1;
        const filas = Math.ceil(n / maxPorFila);
        return Math.ceil(n / filas);
    }

    function actualizarTablaEnganche() {
        // Guardar valores y fechas actuales antes de limpiar
        const filasActuales = tablaEnganche.querySelectorAll("tr");
        const valoresGuardados = [];
        filasActuales.forEach(fila => {
            const montoInput = fila.querySelector(".monto-pago");
            const fechaInput = fila.querySelector(".fecha-pago");
            valoresGuardados.push({
                monto: montoInput.value,
                fecha: fechaInput.value,
                manual: montoInput.dataset.manual === "true"
            });
        });

        const primerFechaValor = valoresGuardados.length > 0 ? valoresGuardados[0].fecha : null;

        let meses = parseInt(mesesInput.value) || 0;
        let engancheTotal = parseFloat(engancheTotalInput.value.replace(/[^0-9.-]+/g, "")) || 0;
        const esModoManual = modoCalculoEngancheSelect.value === 'manual';

        tablaEnganche.innerHTML = ""; // Limpiar la tabla

        if (meses <= 0 || engancheTotal <= 0) {
            if (document.querySelector("#tablaEnganche tfoot .fila-total .total-numero strong")) {
                document.querySelector("#tablaEnganche tfoot .fila-total .total-numero strong").textContent = "$0.00";
            }
            return;
        }

        // Generar las nuevas filas
        for (let i = 1; i <= meses; i++) {
            const valorPrevio = valoresGuardados[i - 1];
            let montoInicial = "$0.00";
            let fechaInicial = "";
            let esManual = false;

            if (valorPrevio) {
                montoInicial = valorPrevio.monto;
                fechaInicial = valorPrevio.fecha;
                esManual = valorPrevio.manual;
            }

            let row = document.createElement("tr");
            row.innerHTML = `
            <td>Pago ${i}</td>
            <td><input type="text" class="monto-pago" value="${montoInicial}" ${esManual ? 'data-manual="true"' : ''}></td>
            <td><input type="date" class="fecha-pago" value="${fechaInicial}"></td>
        `;
            tablaEnganche.appendChild(row);
        }

        // Columnas automáticas (solo visual): máximo 6 por fila en pantalla e impresión.
        tablaEnganche.style.setProperty("--cols", columnasOptimasEnganche(meses, 6));
        tablaEnganche.style.setProperty("--cols-print", columnasOptimasEnganche(meses, 6));

        // Lógica de redistribución solo para modo manual
        if (esModoManual) {
            const todosLosMontos = Array.from(tablaEnganche.querySelectorAll(".monto-pago"));
            let sumaManual = 0;
            const inputsAutomaticos = [];

            todosLosMontos.forEach(input => {
                if (input.dataset.manual === "true") {
                    sumaManual += parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
                } else {
                    inputsAutomaticos.push(input);
                }
            });

            const restante = engancheTotal - sumaManual;
            const cantidadAutomatica = inputsAutomaticos.length;

            if (cantidadAutomatica > 0) {
                const pagoAutomatico = restante > 0 ? restante / cantidadAutomatica : 0;
                inputsAutomaticos.forEach(input => {
                    input.value = pagoAutomatico.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
                });
            }
        } else { // Lógica original para modo automático
            let pagoMensual = meses > 0 ? engancheTotal / meses : 0;
            tablaEnganche.querySelectorAll(".monto-pago").forEach(input => {
                input.value = pagoMensual.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
            });
        }

        const primerFechaInput = tablaEnganche.querySelector(".fecha-pago");
        if (primerFechaInput) {
            primerFechaInput.addEventListener("change", recalcularFechasEnganche);
            if (primerFechaValor) {
                primerFechaInput.value = primerFechaValor;
                recalcularFechasEnganche();
            }
        }

        asignarEventosPagos();
        validarTotalPagos(); // Asegurarse de que el total se valide al final
    }

    function recalcularFechasEnganche() {
        const todasLasFechas = tablaEnganche.querySelectorAll(".fecha-pago");
        if (todasLasFechas.length < 2) return;

        const primerFechaStr = todasLasFechas[0].value;
        const fechaBase = new Date(primerFechaStr + "T12:00:00");

        for (let i = 1; i < todasLasFechas.length; i++) {
            let nuevaFecha = new Date(fechaBase);
            nuevaFecha.setMonth(fechaBase.getMonth() + i);

            if (nuevaFecha.getDate() !== fechaBase.getDate()) {
                nuevaFecha.setDate(0);
            }

            todasLasFechas[i].value = nuevaFecha.toISOString().split("T")[0];
        }
    }

    function asignarEventosPagos() {
        const todosLosMontos = tablaEnganche.querySelectorAll(".monto-pago");
        const esModoManual = modoCalculoEngancheSelect.value === 'manual';

        // Limpiar eventos anteriores y re-clonar los nodos para asegurar un estado limpio
        todosLosMontos.forEach(input => {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
        });

        const nuevosMontos = tablaEnganche.querySelectorAll(".monto-pago");

        nuevosMontos.forEach(input => {
            if (esModoManual) {
                input.readOnly = false; // Asegurarse de que sea editable
                input.addEventListener("blur", function () {
                    let valor = parseFloat(this.value.replace(/[^0-9.-]+/g, "")) || 0;
                    this.value = valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
                    recalcularPagosAutomaticos(this);
                });
            } else {
                input.readOnly = true; // Asegurarse de que sea solo lectura
            }
        });

        // Asignar evento a la primera fecha solo si hay filas
        const primerFechaInput = tablaEnganche.querySelector(".fecha-pago");
        if (primerFechaInput) {
            // Limpiar evento anterior
            const newFechaInput = primerFechaInput.cloneNode(true);
            primerFechaInput.parentNode.replaceChild(newFechaInput, primerFechaInput);
            newFechaInput.addEventListener("change", recalcularFechasEnganche);
        }

        validarTotalPagos();
    }

    function recalcularPagosAutomaticos(inputModificado) {
        // Marcar el input como modificado para que no sea recalculado
        inputModificado.dataset.manual = "true";

        const todosLosMontos = Array.from(tablaEnganche.querySelectorAll(".monto-pago"));
        const engancheTotal = parseFloat(engancheTotalInput.value.replace(/[^0-9.-]+/g, "")) || 0;

        let sumaManual = 0;
        const inputsAutomaticos = [];

        // Separar inputs manuales de automáticos y sumar los manuales
        todosLosMontos.forEach(input => {
            // Usamos el inputModificado para obtener el valor actual que se está escribiendo
            if (input === inputModificado || input.dataset.manual === "true") {
                if (input !== inputModificado) // Solo marcamos los que no son el actual
                    input.dataset.manual = "true";
                sumaManual += parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
            } else {
                inputsAutomaticos.push(input);
            }
        });

        const restante = engancheTotal - sumaManual;
        const cantidadAutomatica = inputsAutomaticos.length;

        // Si quedan campos por rellenar, distribuir el monto restante
        if (cantidadAutomatica > 0) {
            const pagoAutomatico = restante > 0 ? restante / cantidadAutomatica : 0;
            inputsAutomaticos.forEach(input => {
                // Actualizamos el valor y lo formateamos como moneda
                input.value = pagoAutomatico.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
            });
        }

        validarTotalPagos(); // Validar el total después de cada recálculo
    }

    function validarTotalPagos() {
        const totalPagosElement = document.querySelector("#tablaEnganche tfoot .fila-total .total-numero strong");
        if (!totalPagosElement) return;

        let engancheTotal = parseFloat(engancheTotalInput.value.replace(/[^0-9.-]+/g, "")) || 0;

        let pagos = [...tablaEnganche.querySelectorAll(".monto-pago")].map(el => parseFloat(el.value.replace(/[^0-9.-]+/g, "")) || 0);
        let totalPagosCalculado = pagos.reduce((a, b) => a + b, 0);

        totalPagosElement.textContent = totalPagosCalculado.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        if (Math.abs(totalPagosCalculado - engancheTotal) > 1) {
            totalPagosElement.style.color = "red";
            totalPagosElement.style.fontWeight = "bold";
        } else {
            totalPagosElement.style.color = "black";
            totalPagosElement.style.fontWeight = "bold";
        }
    }

    // --- INICIO: Reset de formulario al cargar ---
    sessionStorage.clear();
    gastosTitulacionManuallyEdited = false;

    // Limpiar campos de captura del usuario
    ["nombreCliente", "letrasNumeros", "letrasNumerosDepa", "creditoBancario", "porcentajeCreditoBancario",
     "creditoInfonavit", "porcentajeCreditoInfonavit", "subcuentaVivienda",
     "comisionApertura", "apartado", "gastosTitulacion", "metrosExcedentes",
     "esquina", "mesesPagarEnganche"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    // Limpiar campos calculados/readonly
    ["precioLista", "bono", "avaluo", "precioTotalCasa", "precioNetoCasa", "precioNetoCasa3",
     "enganche", "gastosTotales", "totalPagar", "engancheTotalPagar",
     "gastosEscrituracion", "valorTerrenoExcedente"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    // Resetear precio metros excedentes a readonly vacío
    const precioMetrosExcedentesInput = document.getElementById("precioMetrosExcedentes");
    if (precioMetrosExcedentesInput) {
        precioMetrosExcedentesInput.value = "";
        precioMetrosExcedentesInput.readOnly = true;
    }

    // Resetear selectores a vacío/default
    document.getElementById("Azular").value = "";
    document.getElementById("prototipo").innerHTML = '<option value="">Seleccione...</option>';
    document.getElementById("modoCalculoEnganche").value = "automatico";
    if (departamentoSelect) departamentoSelect.innerHTML = '<option value="">Seleccione...</option>';

    // Limpiar dataset flags de porcentajes
    if (porcentajeCreditoBancarioInput) {
        delete porcentajeCreditoBancarioInput.dataset.autoPercent;
        delete porcentajeCreditoBancarioInput.dataset.manualPercent;
    }
    if (porcentajeCreditoInfonavitInput) {
        delete porcentajeCreditoInfonavitInput.dataset.autoPercent;
        delete porcentajeCreditoInfonavitInput.dataset.manualPercent;
    }
    if (togglePrecioManual) togglePrecioManual.checked = false;
    if (precioListaInput) precioListaInput.readOnly = true;
    if (bonoInput) bonoInput.readOnly = true;
    if (modoPrecioManualContainer) modoPrecioManualContainer.classList.add("hidden");

    // Restaurar UI al estado inicial (casas, sin departamentos)
    document.body.classList.remove("es-departamento");
    if (departamentoContainer) departamentoContainer.classList.add("hidden");
    if (prototipoContainer) prototipoContainer.classList.remove("hidden");
    document.getElementById("terrenoExcedenteContainer").style.display = "block";
    document.getElementById("esquinaContainer").style.display = "flex";
    document.getElementById("equipamientoContainer").classList.add("hidden");
    document.getElementById("precioTotalContainer").style.display = "none";
    document.getElementById("labelPrecioLista").classList.remove("hidden");
    document.getElementById("labelPrecioListaDepa").classList.add("hidden");
    document.getElementById("labelPrecioTotalCasa").classList.remove("hidden");
    document.getElementById("labelPrecioTotalDepartamento").classList.add("hidden");
    document.getElementById("labelPrecioNetoCasa").classList.remove("hidden");
    document.getElementById("labelPrecioNetoDepartamento").classList.add("hidden");
    document.getElementById("labelPrecioNetoCasa3").classList.remove("hidden");
    document.getElementById("labelPrecioNetoDepartamento3").classList.add("hidden");
    // --- FIN: Reset de formulario al cargar ---

    // Disparar el evento change del plan de ventas al cargar para aplicar visibilidad inicial
    // Se ejecuta aquí para evitar usar tablaEnganche antes de su inicialización.
    document.getElementById("planVenta").dispatchEvent(new Event("change"));

    actualizarTablaEnganche();

    document.addEventListener("DOMContentLoaded", function () {
        actualizarCalculoFinal();
        actualizarTablaEnganche();
        validarTotalPagos();
        actualizarModoCompactoPrint();
    });

    document.addEventListener("DOMContentLoaded", function () {
        const fechaCotizacionInput = document.getElementById("fechaCotizacion");
        const fechaVigenciaInput = document.getElementById("fechaVigencia");

        if (fechaCotizacionInput && fechaVigenciaInput) {
            const hoy = new Date();
            const manana = new Date(hoy);
            manana.setDate(hoy.getDate() + 1);

            fechaCotizacionInput.value = hoy.toISOString().split("T")[0];
            fechaVigenciaInput.value = manana.toISOString().split("T")[0];
        }
    });

    const guardarBtn = document.getElementById("guardarBtn");
    if (guardarBtn) {
        guardarBtn.addEventListener("click", function () {
            actualizarValores();
            actualizarFinanciamiento();
            actualizarCalculoFinal();
            validarTotalPagos();
            let pagos = [...document.querySelectorAll(".monto-pago")].map(el => parseFloat(el.value.replace(/[^0-9.-]+/g, "")) || 0);
            let totalPagosCalculado = pagos.reduce((a, b) => a + b, 0);
            document.getElementById("totalPagos").textContent = totalPagosCalculado.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
            validarTotalPagos(totalPagosCalculado);
        });
    }

    const imprimirBtn = document.getElementById("imprimirBtn");
    const compartirImagenBtn = document.getElementById("compartirImagenBtn");
    const compartirPdfBtn = document.getElementById("compartirPdfBtn");

    function limpiarTextoArchivo(texto) {
        return (texto || "")
            .trim()
            .replace(/[\\/:*?"<>|]/g, "")
            .replace(/\s+/g, " ");
    }

    function obtenerTextoSeleccionado(selectId) {
        const select = document.getElementById(selectId);
        if (!select || !select.value) return "";
        return select.options[select.selectedIndex]?.textContent || "";
    }

    function obtenerModeloParaTitulo() {
        const desarrollo = document.getElementById("Azular")?.value || "";
        const selectorModelo = (desarrollo === "Azular1-Depas" || desarrollo === "Lirios2-Depas")
            ? "departamentoSelect"
            : "prototipo";

        return limpiarTextoArchivo(obtenerTextoSeleccionado(selectorModelo));
    }

    function actualizarTituloParaPDF() {
        const cliente = limpiarTextoArchivo(document.getElementById("nombreCliente")?.value);
        let desarrollo = limpiarTextoArchivo(obtenerTextoSeleccionado("Azular"));
        if (desarrollo === "Jardines del Sur 6 - Casas") {
            desarrollo = "Jardines del Sur 6 - Casa";
        }
        const modelo = obtenerModeloParaTitulo();

        const partes = [];
        if (cliente) partes.push(`Cotización para ${cliente}`);
        else partes.push("Cotización");
        if (desarrollo) partes.push(desarrollo);
        if (modelo) partes.push(modelo);

        document.title = partes.join(" · ");
    }
    window.actualizarTituloParaPDF = actualizarTituloParaPDF;

    function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            if (canvas.toBlob) {
                canvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error("No se pudo crear la imagen."));
                }, "image/png");
                return;
            }

            try {
                const dataUrl = canvas.toDataURL("image/png");
                fetch(dataUrl).then(respuesta => respuesta.blob()).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    function descargarBlob(blob, nombreArchivo) {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function valorControlParaCanvas(control) {
        if (control.tagName === "SELECT") {
            return control.options[control.selectedIndex]?.textContent?.trim() || "";
        }

        // Las fechas se guardan como "2026-10-30" y asi salian en la imagen y el
        // PDF compartidos. Al cliente se le manda como 30/10/2026, que es como
        // las ve en pantalla y como se leen aqui.
        if (control.type === "date" && control.value) {
            const [anio, mes, dia] = control.value.split("-");
            if (anio && mes && dia) return `${dia}/${mes}/${anio}`;
        }

        const valor = control.value || "";
        return valor || control.getAttribute("placeholder") || "";
    }

    function justificacionTextoCanvas(textAlign) {
        if (textAlign === "center") return "center";
        if (textAlign === "right" || textAlign === "end") return "flex-end";
        return "flex-start";
    }

    function reemplazarControlesPorTextoParaCanvas(clonedDocument) {
        const view = clonedDocument.defaultView;
        if (!view) return;

        clonedDocument.querySelectorAll("input, select").forEach(control => {
            const estilos = view.getComputedStyle(control);
            if (estilos.display === "none" || control.type === "hidden") return;

            const cajaTexto = clonedDocument.createElement("div");
            cajaTexto.className = `${control.className || ""} control-texto-canvas`.trim();
            if (control.id) cajaTexto.id = control.id;
            cajaTexto.textContent = valorControlParaCanvas(control);

            cajaTexto.style.display = "inline-flex";
            cajaTexto.style.alignItems = "center";
            cajaTexto.style.justifyContent = justificacionTextoCanvas(estilos.textAlign);
            cajaTexto.style.boxSizing = "border-box";
            cajaTexto.style.width = estilos.width;
            cajaTexto.style.height = estilos.height;
            cajaTexto.style.minWidth = estilos.minWidth;
            cajaTexto.style.maxWidth = estilos.maxWidth;
            cajaTexto.style.flexGrow = estilos.flexGrow;
            cajaTexto.style.flexShrink = estilos.flexShrink;
            cajaTexto.style.flexBasis = estilos.flexBasis;
            cajaTexto.style.margin = estilos.margin;
            cajaTexto.style.paddingLeft = estilos.paddingLeft;
            cajaTexto.style.paddingRight = estilos.paddingRight;
            cajaTexto.style.paddingTop = "0";
            cajaTexto.style.paddingBottom = "0";
            cajaTexto.style.border = estilos.border;
            cajaTexto.style.borderRadius = estilos.borderRadius;
            cajaTexto.style.backgroundColor = estilos.backgroundColor;
            cajaTexto.style.color = estilos.color;
            cajaTexto.style.fontFamily = estilos.fontFamily;
            cajaTexto.style.fontSize = estilos.fontSize;
            cajaTexto.style.fontWeight = estilos.fontWeight;
            cajaTexto.style.letterSpacing = estilos.letterSpacing;
            cajaTexto.style.lineHeight = "1";
            cajaTexto.style.whiteSpace = "nowrap";
            cajaTexto.style.overflow = "hidden";
            cajaTexto.style.textOverflow = "clip";

            control.replaceWith(cajaTexto);
        });
    }

    function prepararTitulosParaCanvas(clonedDocument) {
        clonedDocument.querySelectorAll(".bloque h2").forEach(titulo => {
            const contenedor = clonedDocument.createElement("div");
            contenedor.className = "titulo-canvas-wrap";
            const textoTitulo = clonedDocument.createElement("div");
            textoTitulo.className = "titulo-canvas-texto";
            textoTitulo.textContent = titulo.textContent;
            contenedor.appendChild(textoTitulo);
            titulo.replaceWith(contenedor);
        });
    }

    // Cuanto va a medir de alto la captura. OJO: se arma a 1200px de ancho (el
    // diseno de computadora), asi que en un telefono NO sirve medir la pagina
    // tal como se ve: ahi va apilada en una columna y es mucho mas alta. Medirla
    // asi hacia que la prueba de abajo se pasara de prudente y bajara la escala
    // mas de la cuenta — justo lo que Florencio veia menos nitido.
    function altoEstimadoDeCaptura(anchoCaptura) {
        const alto = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const ancho = Math.max(document.documentElement.clientWidth || 0, 1);
        const factor = Math.min(1, Math.max(ancho / anchoCaptura, 0.5));
        return Math.round(alto * factor);
    }

    // Un lienzo que el navegador no aguanto se entrega EN BLANCO. Se mira una
    // banda de abajo, que es donde falla primero.
    function lienzoUtil(canvas) {
        try {
            const ctx = canvas.getContext("2d");
            if (!ctx) return false;
            const alto = Math.min(40, canvas.height);
            const datos = ctx.getImageData(0, canvas.height - alto, Math.min(600, canvas.width), alto).data;
            for (let i = 0; i < datos.length; i += 4) {
                if (datos[i + 3] > 0 && (datos[i] < 250 || datos[i + 1] < 250 || datos[i + 2] < 250)) return true;
            }
            return false;
        } catch (error) {
            return true; // si no se puede mirar, se da por bueno
        }
    }

    // Devuelve la escala mas alta con la que este navegador SI puede generar el
    // lienzo. Safari en iPhone acepta crear lienzos enormes pero los entrega en
    // blanco (su limite ronda los 17 millones de pixeles); por eso no basta con
    // crear el lienzo, hay que pintar y volver a leer una esquina.
    function escalaQueAguantaElNavegador(ancho, alto, deseada) {
        const candidatas = [];
        for (let e = deseada; e >= 1.5; e -= 0.5) candidatas.push(Math.round(e * 100) / 100);
        if (!candidatas.length) candidatas.push(deseada);

        for (const escala of candidatas) {
            const prueba = document.createElement("canvas");
            prueba.width = Math.round(ancho * escala);
            prueba.height = Math.round(alto * escala);
            let sirve = false;
            try {
                const ctx = prueba.getContext("2d");
                if (ctx) {
                    // La esquina de ABAJO A LA DERECHA: es la que se queda en
                    // blanco cuando el lienzo pasa del limite.
                    ctx.fillStyle = "rgb(18, 52, 86)";
                    ctx.fillRect(prueba.width - 2, prueba.height - 2, 2, 2);
                    const d = ctx.getImageData(prueba.width - 1, prueba.height - 1, 1, 1).data;
                    sirve = d[0] === 18 && d[1] === 52 && d[2] === 86;
                }
            } catch (error) {
                sirve = false;
            }
            prueba.width = 0;
            prueba.height = 0;
            if (sirve) return escala;
        }
        return candidatas[candidatas.length - 1];
    }

    async function crearCanvasCotizacion(escala) {
        if (typeof html2canvas !== "function") {
            throw new Error("html2canvas no esta disponible.");
        }

        actualizarTituloParaPDF();
        actualizarModoCompactoPrint();

        const anchoCaptura = 1200;
        escala = escala || 5;

        // La escala la decide EL APARATO, no un numero fijo. Antes habia un tope
        // de 16 millones de pixeles para que Safari en iPhone no degradara la
        // captura; el problema es que ese tope tambien le bajaba la calidad en
        // la computadora, donde no hace falta. Ahora se prueba de verdad: se
        // crea un lienzo del tamano pedido, se pinta una esquina y se lee de
        // vuelta. Si el navegador no puede, devuelve blanco y se baja un
        // escalon. Asi la computadora usa la maxima nitidez y el telefono la
        // mayor que aguante, sin adivinar limites.
        const altoCaptura = altoEstimadoDeCaptura(anchoCaptura);
        if (altoCaptura > 0) {
            escala = escalaQueAguantaElNavegador(anchoCaptura, altoCaptura, escala);
        }
        // El fondo de la captura se LEE del CSS en vez de escribirlo aqui: antes
        // estaba hardcodeado ("#fbf7ef") y al retintar el cotizador con los
        // colores del sitio la imagen y el PDF habrian salido con el fondo viejo
        // mientras la pantalla mostraba el nuevo.
        const fondo = getComputedStyle(document.documentElement)
            .getPropertyValue("--brand-cream").trim() || "#F7FAFC";
        const dibujar = (escalaUsada) => html2canvas(document.body, {
            backgroundColor: fondo,
            scale: escalaUsada,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: anchoCaptura,
            onclone: clonedDocument => {
                clonedDocument.documentElement.style.width = `${anchoCaptura}px`;
                clonedDocument.documentElement.style.overflow = "visible";
                clonedDocument.body.classList.add("generando-imagen");
                clonedDocument.body.style.width = `${anchoCaptura}px`;
                clonedDocument.body.style.maxWidth = `${anchoCaptura}px`;
                clonedDocument.body.style.overflow = "visible";
                // (Ya no se incrustan copias de los logos: todos viven en el mismo
                // dominio que el cotizador, asi que html2canvas los toma sin
                // problema. Comprobado con la imagen compartida real.)
                prepararTitulosParaCanvas(clonedDocument);
                reemplazarControlesPorTextoParaCanvas(clonedDocument);
            }
        });

        // Red de seguridad: si aun asi el lienzo salio en blanco (el calculo de
        // arriba es una estimacion), se repite mas chico en vez de entregar una
        // imagen vacia.
        let canvas = await dibujar(escala);
        if (!lienzoUtil(canvas)) {
            const menor = Math.max(1.5, Math.round(escala * 0.6 * 10) / 10);
            canvas.width = 0;
            canvas.height = 0;
            canvas = await dibujar(menor);
        }
        return canvas;
    }

    async function crearImagenCotizacion() {
        const canvas = await crearCanvasCotizacion();
        return canvasToBlob(canvas);
    }

    async function crearPdfCotizacion() {
        const jsPDFConstructor = window.jspdf?.jsPDF;
        if (typeof jsPDFConstructor !== "function") {
            throw new Error("jsPDF no esta disponible.");
        }

        // Misma captura probada de "Compartir imagen", en pagina a medida.
        // MEDIDO (19 sept 2026) en una cotizacion tipica, peso del PDF:
        //   escala 2.0 (282 DPI) calidad 0.80 → 643 KB   ← como estaba
        //   escala 1.75 (247 DPI) calidad 0.80 → 533 KB
        //   escala 1.5 (212 DPI) calidad 0.80 → 431 KB (se veian sucias las letras)
        //   escala 1.5 (212 DPI) calidad 0.92 → 618 KB  ← este
        //   escala 2.0 (282 DPI) calidad 0.92 → 922 KB
        // Se prioriza la CALIDAD sobre el peso: WhatsApp manda los PDF tal cual,
        // sin recomprimir y con tope de 100 MB, asi que medio mega no estorba;
        // en cambio la calidad baja se ve como manchas alrededor del texto.
        // A 212 DPI se lee e imprime perfecto (una impresora casera trabaja a
        // 150-300 DPI).
        // Si algun dia hace falta un PDF impecable —texto como texto, nitido a
        // cualquier zoom— NO sale de aqui: sale de Imprimir → Guardar como PDF
        // (medido: 505 KB con los logos a la medida). Este boton siempre hara
        // una foto de la hoja.
        const canvas = await crearCanvasCotizacion(1.5);
        const imagenData = canvas.toDataURL("image/jpeg", 0.92);

        // PRUEBA (21 sept 2026): WhatsApp le hace miniatura al PDF que sale de
        // Imprimir —hoja carta exacta, comprimido— y NO al de este boton, que
        // usaba una hoja a la medida de 8.5x13 pulgadas. Probado ya: no es el
        // camino de envio (Florencio lo intento compartiendo desde Chrome,
        // desde Archivos y adjuntandolo desde el propio WhatsApp), asi que solo
        // queda el archivo. Aqui se imita al que si funciona.
        //
        // PROBADO EL 21 SEPT 2026 Y DESCARTADO: la hoja carta NO devuelve la
        // miniatura en WhatsApp, y ademas deja la cotizacion enmarcada y mas
        // chica. Se vuelve a la hoja a la medida. El camino queda escrito por
        // si algun dia hace falta, pero apagado.
        const HOJA_CARTA = false;

        let pdf;
        if (HOJA_CARTA) {
            const ANCHO = 612, ALTO = 792; // carta, en puntos
            pdf = new jsPDFConstructor({
                orientation: "portrait",
                unit: "pt",
                format: "letter",
                compress: true
            });
            // La cotizacion es mas alargada que una hoja carta, asi que se
            // acomoda centrada y deja margen a los lados.
            const ajuste = Math.min(ANCHO / canvas.width, ALTO / canvas.height);
            const ancho = canvas.width * ajuste;
            const alto = canvas.height * ajuste;
            pdf.addImage(imagenData, "JPEG", (ANCHO - ancho) / 2, (ALTO - alto) / 2, ancho, alto);
        } else {
            // Página a la medida exacta de la captura (sin franjas ni bordes):
            // ancho de hoja carta (612pt) y alto proporcional al contenido.
            const anchoPagina = 612;
            const altoPagina = anchoPagina * (canvas.height / canvas.width);
            pdf = new jsPDFConstructor({
                orientation: altoPagina >= anchoPagina ? "portrait" : "landscape",
                unit: "pt",
                format: [anchoPagina, altoPagina]
            });
            pdf.addImage(imagenData, "JPEG", 0, 0, anchoPagina, altoPagina);
        }
        return pdf.output("blob");
    }

    async function compartirODescargarPdf(blob, nombreArchivo) {
        const archivo = typeof File === "function"
            ? new File([blob], nombreArchivo, { type: "application/pdf" })
            : null;

        if (archivo && navigator.canShare && navigator.canShare({ files: [archivo] })) {
            try {
                await navigator.share({
                    files: [archivo],
                    title: document.title || "Cotizacion"
                });
                return "shared";
            } catch (error) {
                if (error?.name === "AbortError") return "cancelled";
                console.warn("No se pudo compartir el PDF, se descargara como respaldo.", error);
            }
        }

        descargarBlob(blob, nombreArchivo);
        return "downloaded";
    }

    async function compartirOCopiarImagen(blob, nombreArchivo) {
        const archivo = typeof File === "function"
            ? new File([blob], nombreArchivo, { type: "image/png" })
            : null;

        if (archivo && navigator.canShare && navigator.canShare({ files: [archivo] })) {
            try {
                await navigator.share({
                    files: [archivo],
                    title: document.title || "Cotizacion"
                });
                return "shared";
            } catch (error) {
                if (error?.name === "AbortError") return "cancelled";
                console.warn("No se pudo compartir la imagen, se intentara copiar o descargar.", error);
            }
        }

        if (navigator.clipboard && window.ClipboardItem) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })
                ]);
                return "copied";
            } catch (error) {
                console.warn("No se pudo copiar la imagen, se descargara como respaldo.", error);
            }
        }

        descargarBlob(blob, nombreArchivo);
        return "downloaded";
    }

    if (imprimirBtn) {
        imprimirBtn.addEventListener("click", function () {
            actualizarTituloParaPDF();
            actualizarModoCompactoPrint();
            window.print();
        });
    } else {
        console.error("⚠️ Error: No se encontró el botón de impresión en el HTML.");
    }

    if (compartirImagenBtn) {
        compartirImagenBtn.addEventListener("click", async function () {
            const textoOriginal = this.textContent;
            actualizarTituloParaPDF();
            const nombreArchivo = `${limpiarTextoArchivo(document.title) || "Cotizacion"}.png`;

            this.disabled = true;
            this.textContent = "Preparando imagen...";

            try {
                const blob = await crearImagenCotizacion();
                this.textContent = "Compartiendo...";
                const resultado = await compartirOCopiarImagen(blob, nombreArchivo);

                if (resultado === "copied") {
                    this.textContent = "Imagen copiada";
                    alert("Imagen copiada.");
                } else if (resultado === "downloaded") {
                    this.textContent = "Imagen descargada";
                    alert("Imagen descargada.");
                } else if (resultado === "shared") {
                    this.textContent = "Compartido";
                    alert("Imagen lista para compartir.");
                } else {
                    this.textContent = textoOriginal;
                }
            } catch (error) {
                console.error("No se pudo generar la imagen de la cotizacion.", error);
                alert("No se pudo generar la imagen. Intenta de nuevo o usa Imprimir.");
                this.textContent = textoOriginal;
            } finally {
                setTimeout(() => {
                    this.disabled = false;
                    this.textContent = textoOriginal;
                }, 1600);
            }
        });
    }

    if (compartirPdfBtn) {
        compartirPdfBtn.addEventListener("click", async function () {
            const textoOriginal = this.textContent;
            actualizarTituloParaPDF();
            const nombreArchivo = `${limpiarTextoArchivo(document.title) || "Cotizacion"}.pdf`;

            this.disabled = true;
            this.textContent = "Preparando PDF...";

            try {
                const blob = await crearPdfCotizacion();
                this.textContent = "Compartiendo...";
                const resultado = await compartirODescargarPdf(blob, nombreArchivo);

                if (resultado === "downloaded") {
                    this.textContent = "PDF descargado";
                    alert("PDF descargado.");
                } else if (resultado === "shared") {
                    this.textContent = "Compartido";
                    alert("PDF listo para compartir.");
                } else {
                    this.textContent = textoOriginal;
                }
            } catch (error) {
                console.error("No se pudo generar el PDF de la cotizacion.", error);
                alert("No se pudo generar el PDF. Intenta de nuevo o usa Imprimir.");
                this.textContent = textoOriginal;
            } finally {
                setTimeout(() => {
                    this.disabled = false;
                    this.textContent = textoOriginal;
                }, 1600);
            }
        });
    }

});

// --- MODOS DE IMPRESIÓN SEGÚN MESES DE ENGANCHE ---
function actualizarModoCompactoPrint() {
    const meses = parseInt(document.getElementById("mesesPagarEnganche")?.value) || 0;
    const body = document.body;

    body.classList.toggle("print-compacto", meses > 10);
    body.classList.toggle("print-ultra", meses > 16);

    // Escala suave para aprovechar mejor una sola hoja carta sin desbordar.
    // m1 ~ 1.08, m15 ~ 1.04, m16 ~ 1.03, m20 ~ 1.02
    let escala = 1;
    if (meses > 0) {
        escala = 1.085 - (meses * 0.0033);
        // La mensualidad estimada (~40 px) y la leyenda de Infonavit (~10 px)
        // agregan contenido a la hoja, así que se le baja un poco a la escala
        // para que siga cabiendo en una.
        // ⚠️ OJO AL VERIFICAR: la impresión automática (Chrome headless →
        // PDF) IGNORA este `zoom`, así que contar páginas ahí no sirve para
        // este ajuste; hay que mirar la vista previa de impresión real.
        const visible = (id) => {
            const el = document.getElementById(id);
            return Boolean(el) && !el.classList.contains("hidden");
        };
        if (visible("mensualidadGastos")) escala -= 0.055;
        if (visible("leyendaInstituto")) escala -= 0.02;
        escala = Math.min(1.08, Math.max(0.95, escala));
    }

    body.style.setProperty("--print-scale", escala.toFixed(3));
}

const mesesInputWatcher = document.getElementById("mesesPagarEnganche");
if (mesesInputWatcher) {
    mesesInputWatcher.addEventListener("input", actualizarModoCompactoPrint);
}
window.addEventListener("beforeprint", actualizarModoCompactoPrint);
window.addEventListener("beforeprint", function () {
    if (typeof window.actualizarTituloParaPDF === "function") {
        window.actualizarTituloParaPDF();
    }
});
actualizarModoCompactoPrint();
// --- FIN MODOS DE IMPRESIÓN ---

// --- INICIO: Autocompletar teléfono del asesor ---
const nombreAsesorSelect = document.getElementById("nombreAsesor");
const telefonoAsesorInput = document.getElementById("telefonoAsesor");

// Solo los asesores vigentes. Se recortaron los otros 6 al mover el cotizador
// al dominio publico: sus nombres y telefonos no tienen por que quedar
// accesibles aqui. Si se agrega uno, va tambien en el <select> de index.html.
const datosAsesores = {
    "Florencio Hurtado": "+52 998 205 9044",
    "Eduardo Gonzalez Nuñez": "+52 998 148 6819",
    "Estefania Sosa": "+52 998 306 4183",
    "Rafael Heredia": "+52 998 136 5090"
};

if (nombreAsesorSelect && telefonoAsesorInput) {
    nombreAsesorSelect.addEventListener("change", function () {
        const asesorSeleccionado = this.value;
        if (datosAsesores[asesorSeleccionado]) {
            telefonoAsesorInput.value = datosAsesores[asesorSeleccionado];
        } else {
            telefonoAsesorInput.value = ""; // Limpiar si no hay un asesor seleccionado
        }
    });
    nombreAsesorSelect.dispatchEvent(new Event("change"));
}
// --- FIN: Autocompletar teléfono del asesor ---
