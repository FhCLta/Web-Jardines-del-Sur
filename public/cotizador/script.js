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

        if (seleccion && datosAzular[seleccion]) {
            datosAzular[seleccion].modelos.forEach(modelo => {
                let option = document.createElement("option");
                option.value = modelo;
                option.textContent = modelo;
                prototipoSelect.appendChild(option);
            });

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
            
            const [modelo, planta] = seleccion.split("-");
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

    const imagenesSegurasCanvas = {
        "Logo Sadasi.webp": "data:image/webp;base64,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",
        "Logo Altta Homes.webp": "data:image/webp;base64,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"
    };

    function prepararImagenesSegurasParaCanvas(clonedDocument) {
        clonedDocument.querySelectorAll("img").forEach(img => {
            const src = decodeURIComponent(img.getAttribute("src") || img.src || "");
            Object.entries(imagenesSegurasCanvas).forEach(([nombreArchivo, dataUrl]) => {
                if (src.includes(nombreArchivo)) {
                    img.removeAttribute("crossorigin");
                    img.src = dataUrl;
                }
            });
        });
    }

    function valorControlParaCanvas(control) {
        if (control.tagName === "SELECT") {
            return control.options[control.selectedIndex]?.textContent?.trim() || "";
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

    async function crearCanvasCotizacion(escala) {
        if (typeof html2canvas !== "function") {
            throw new Error("html2canvas no esta disponible.");
        }

        actualizarTituloParaPDF();
        actualizarModoCompactoPrint();

        const anchoCaptura = 1200;
        escala = escala || 5;
        // El fondo de la captura se LEE del CSS en vez de escribirlo aqui: antes
        // estaba hardcodeado ("#fbf7ef") y al retintar el cotizador con los
        // colores del sitio la imagen y el PDF habrian salido con el fondo viejo
        // mientras la pantalla mostraba el nuevo.
        const fondo = getComputedStyle(document.documentElement)
            .getPropertyValue("--brand-cream").trim() || "#F7FAFC";
        return html2canvas(document.body, {
            backgroundColor: fondo,
            scale: escala,
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
                prepararImagenesSegurasParaCanvas(clonedDocument);
                prepararTitulosParaCanvas(clonedDocument);
                reemplazarControlesPorTextoParaCanvas(clonedDocument);
            }
        });
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
        // Escala 2 (no 5): en pagina de 612pt de ancho rinde ~280 DPI;
        // reduce mucho el peso del PDF sin pérdida visible de nitidez.
        const canvas = await crearCanvasCotizacion(2);
        const imagenData = canvas.toDataURL("image/jpeg", 0.8);

        // Página a la medida exacta de la captura (sin franjas ni bordes):
        // ancho de hoja carta (612pt) y alto proporcional al contenido.
        const anchoPagina = 612;
        const altoPagina = anchoPagina * (canvas.height / canvas.width);
        const pdf = new jsPDFConstructor({
            orientation: altoPagina >= anchoPagina ? "portrait" : "landscape",
            unit: "pt",
            format: [anchoPagina, altoPagina]
        });

        pdf.addImage(imagenData, "JPEG", 0, 0, anchoPagina, altoPagina);
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
        escala = Math.min(1.08, Math.max(0.98, escala));
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
    "Eduardo Gonzalez Nuñez": "+52 998 148 6819"
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
