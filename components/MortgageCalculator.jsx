"use client";

// Ejercicio de cotización hipotecaria estimada.
// LÓGICA (calibrada con el cotizador interno de Florencio + simuladores de
// la banca jul-2026):
// - El banco presta hasta ~90% SOBRE EL AVALÚO, que en estos desarrollos es
//   mayor que el precio de venta → el crédito puede cubrir PRECIO + GASTOS
//   de escrituración → la mayoría de los modelos se estrenan SIN enganche.
// - Gastos de escrituración = 8.5% sobre el AVALÚO (el % más alto de la
//   tabla real, para nunca prometer de menos).
// - Mensualidad = amortización francesa (verificada al centavo contra BBVA)
//   + seguros con factores reales (~0.6‰ vida sobre crédito + ~0.2‰ daños
//   sobre avalúo).
// - En DEPARTAMENTOS el precio mostrado es el de la variante más barata
//   (ver VARIANT_NOTE) — gancho: otros niveles/vistas se cotizan por WhatsApp.

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MortgageCalculator.module.css";

const PHONE_E164 = "529982059044";

const LTV_ON_APPRAISAL = 0.9; // el banco presta ~90% sobre el avalúo
const CLOSING_COSTS_PCT = 0.085; // gastos de escrituración sobre el AVALÚO
const LIFE_INSURANCE_FACTOR = 0.0006; // mensual, sobre el saldo del crédito
const DAMAGE_INSURANCE_FACTOR = 0.0002; // mensual, sobre el avalúo
const ADMIN_FEE_FACTOR = 0.0003; // comisión de administración mensual (0.30‰ del crédito, como BBVA)
const SUGGESTED_PAYMENT_TO_INCOME = 0.5; // regla 50/50: mensualidad ≤ 50% del ingreso

const TERMS = [5, 10, 15, 20];

// Cuánto avanza el slider de aportación por escalón.
const CASH_STEP = 5000;

// Valor centinela del selector para el modo "otra propiedad". No puede chocar
// con ningún id del inventario (esos son tipo "jds6-capua").
const MANUAL_ID = "__manual__";

// Departamentos: a qué nivel/vista corresponde el precio publicado.
// MANTENIMIENTO: si cambia el precio del inventario, actualizar la etiqueta.
const VARIANT_NOTE = {
  "jds6-capua": "Nivel 3 · vista estacionamiento",
  "jds6-cedro-plus": "Nivel 2 · vista alberca",
  "lirios2-cedro-plus": "Nivel 2",
};

const fmtMXN = (n) => `$${Math.round(n).toLocaleString("es-MX")}`;

// Campos de dinero del modo manual: por dentro se guardan SOLO dígitos y por
// fuera se muestran agrupados ("2,500,000"). Por eso son type="text" con
// inputMode="numeric" y no type="number": un input numérico no puede pintar
// separadores de miles (y encima mete flechitas de spinner).
const digitsOnly = (s) => String(s).replace(/\D/g, "");
const fmtGrouped = (s) => {
  const d = digitsOnly(s);
  return d ? Number(d).toLocaleString("es-MX") : "";
};

// Porcentaje con DOS decimales, recortando los ceros de cola: 89.9384 → "89.94",
// 90 → "90". Con dos decimales el rótulo cuadra al multiplicarlo por el avalúo
// (diferencia máxima ~$270 en $5M); con uno se iba hasta $1,060 y con cero
// —el "90%" original— hasta $1,700.
const fmtPct = (n) => String(Number(n.toFixed(2)));

export default function MortgageCalculator({ models, initialModelId = null }) {
  const [modelId, setModelId] = useState(
    initialModelId && models.some((m) => m.id === initialModelId)
      ? initialModelId
      : models[0]?.id
  );
  const [cash, setCash] = useState(0);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(10.25);
  const [hasInfonavit, setHasInfonavit] = useState(false);
  // Modo manual: sirve para los departamentos cuyas variantes (nivel/vista) no
  // están en el inventario y para cualquier otra propiedad. Además abre la
  // página a búsquedas genéricas de "calculadora hipotecaria", muchas más que
  // las de nuestros modelos.
  const [customAppraisal, setCustomAppraisal] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const isManual = modelId === MANUAL_ID;

  // Modelos agrupados por desarrollo para los <optgroup> del selector.
  // Conserva el orden en que vienen del inventario.
  const modelsByDev = useMemo(() => {
    const groups = new Map();
    for (const m of models) {
      if (!groups.has(m.dev)) groups.set(m.dev, []);
      groups.get(m.dev).push(m);
    }
    return [...groups];
  }, [models]);

  const model = isManual ? null : models.find((m) => m.id === modelId) || models[0];
  // ⚠️ SIN RESPALDO SILENCIOSO. Antes, con el avalúo vacío se usaba el precio de
  // venta y la tabla calculaba igual — pero rotulaba esos números como "% del
  // avalúo" y "8.5% del avalúo" cuando en realidad salían del precio. Como
  // además el placeholder era un monto con formato ("2,800,000"), parecía un
  // valor capturado y no había forma de notarlo. Ahora, sin avalúo no se
  // calcula nada: se le pide al cliente que lo escriba (y si no lo conoce, el
  // texto de ayuda le dice que ponga ahí el mismo precio de venta).
  const manualPrice = Number(customPrice) || 0;
  const manualAppraisal = Number(customAppraisal) || 0;
  const manualReady = manualPrice > 0 && manualAppraisal > 0;
  const price = isManual ? manualPrice : model?.price || 0;
  const appraisal = isManual ? manualAppraisal : model?.avaluo || price;
  // Hay descuento real solo si el avalúo supera al precio (mismo criterio que
  // PropertyCard). Hoy los 11 modelos del inventario lo cumplen; el guard es
  // para que un modelo nuevo sin avalúo no muestre un descuento inexistente.
  const hasDiscount = appraisal > price;
  const variantNote = VARIANT_NOTE[model?.id];

  // Mínimo de efectivo del modelo: lo que el crédito (90% del avalúo)
  // no alcanza a cubrir de precio + gastos. La aportación no puede bajar
  // de este piso; al cambiar de modelo se reinicia al mínimo.
  const closingCosts = appraisal * CLOSING_COSTS_PCT;
  const creditMax = appraisal * LTV_ON_APPRAISAL;
  const totalCost = price + closingCosts;
  const requiredCash = Math.max(0, Math.ceil(totalCost - creditMax));
  // SIN TOPE ARTIFICIAL: el máximo es cubrirlo TODO (precio + gastos), o sea
  // pago de contado. Antes el techo era "el mínimo + 30% del precio", un
  // número puesto a ojo y sin regla de negocio detrás: al cliente que traía
  // más ahorro se le recortaba la aportación EN SILENCIO (`Math.min` de
  // abajo) y nunca se le decía por qué. En la vida real puedes poner desde el
  // mínimo hasta el último peso, y la calculadora tiene que poder hacer lo
  // mismo.
  const maxCash = Math.ceil(totalCost);
  // El slider avanza de CASH_STEP en CASH_STEP desde el mínimo, así que el
  // último escalón casi nunca cae justo sobre el total ($1,945,000 de
  // $1,948,380). Se estira la barra al siguiente múltiplo y el VALOR se limita
  // a `maxCash` → el final del slider siempre es el total exacto y nunca
  // quedan unos miles "faltando" para completar.
  const sliderMax =
    requiredCash + Math.ceil((maxCash - requiredCash) / CASH_STEP) * CASH_STEP;

  useEffect(() => {
    setCash(requiredCash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const cashTotal = Math.min(Math.max(cash, requiredCash), maxCash);

  const calc = useMemo(() => {
    const principal = Math.max(0, totalCost - cashTotal);
    // Pago de contado: la aportación cubre precio + gastos y no queda crédito.
    // Sin crédito NO hay mensualidad ni seguros: el de vida, el de daños y la
    // comisión de administración los exige el banco como condición del
    // préstamo, así que sin préstamo no existen. Calcularlos igual pintaría
    // una "mensualidad" de ~$357 (el seguro de daños sobre el avalúo) a quien
    // ya pagó la casa completa.
    // El `totalCost > 0` no es decorativo: en modo manual, con los campos
    // vacíos, el principal también es 0 — sin el guard la calculadora
    // anunciaría un "pago de contado" de $0 antes de que el cliente escriba
    // un solo número.
    const isCash = totalCost > 0 && principal <= 0;
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const base = isCash
      ? 0
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    const insurance = isCash
      ? 0
      : principal * LIFE_INSURANCE_FACTOR +
        appraisal * DAMAGE_INSURANCE_FACTOR +
        principal * ADMIN_FEE_FACTOR;
    const total = base + insurance;
    return {
      principal,
      base,
      insurance,
      total,
      isCash,
      suggestedIncome: total / SUGGESTED_PAYMENT_TO_INCOME,
      noDownPayment: requiredCash === 0,
      // Qué porcentaje del avalúo representa el crédito. Se calcula, no se
      // escribe a mano: el tope es 90%, pero baja si el cliente aporta
      // efectivo o si precio + gastos ya caben por debajo de ese 90%.
      // ⚠️ CON UN DECIMAL, NO REDONDEADO A ENTERO. Redondeando, un crédito de
      // 89.94% se rotulaba "90%" y al multiplicar 0.90 × avalúo el cliente
      // encontraba $1,700 de diferencia — un rótulo que no cuadra tira la
      // credibilidad de toda la tabla. El .0 sí se recorta ("90%", no "90.0%").
      ltvPct: appraisal > 0 ? (principal / appraisal) * 100 : 0,
    };
  }, [totalCost, cashTotal, appraisal, requiredCash, years, rate]);

  // Qué dice la línea chica bajo "Crédito bancario estimado". Tiene que decir
  // la VERDAD en los tres escenarios; una sola frase mentía:
  //  a) sin aportación  → el crédito sí cubre precio + gastos (sin enganche).
  //  b) topado en 90%   → el crédito NO alcanza; el faltante lo pone el cliente
  //     (Flamboyán, Casa Noni de ambos devs, Cedro Plus de Lirios).
  //  c) aportación voluntaria → el crédito cubre lo que queda tras el efectivo.
  //  d) contado → no hay crédito; el % del avalúo sería 0 y "cubre el resto"
  //     no significaría nada.
  // El % siempre con 2 decimales para que cuadre al multiplicarlo por el avalúo.
  const atCap = calc.ltvPct >= 89.995;
  const creditSub = calc.isCash
    ? "No necesitas crédito: tu aportación cubre precio y gastos"
    : cashTotal === 0
      ? `Cubre precio y gastos · ${fmtPct(calc.ltvPct)}% del avalúo (tope 90%)`
      : atCap
        ? "El máximo que presta el banco: 90% del avalúo · el resto lo cubre tu aportación"
        : `Cubre el resto tras tu aportación · ${fmtPct(calc.ltvPct)}% del avalúo (tope 90%)`;

  // Qué le llega a Florencio por WhatsApp. En contado NO aplica el "X al mes a
  // N años" (no hay mensualidad ni plazo): ese caso manda el monto total.
  const waInfonavit = hasInfonavit
    ? " Tengo crédito Infonavit y me interesa saber si me conviene Cofinavit o Apoyo Infonavit."
    : "";
  const waResultado = calc.isCash
    ? `Lo hice pagando de CONTADO: ${fmtMXN(totalCost)} en total (precio + gastos de escrituración), sin crédito.`
    : `Me estimó ${fmtMXN(calc.total)} al mes a ${years} años${
        cashTotal === 0
          ? isManual
            ? ", sin enganche"
            : ", sin enganche (el crédito sobre avalúo cubre precio y gastos)"
          : ` con ${fmtMXN(cashTotal)} de efectivo inicial`
      }.`;
  const waMessage = isManual
    ? // El link de WhatsApp de la caja manual está visible ANTES de que el
      // cliente escriba nada ("¿No conoces el avalúo? … escríbenos"). Sin este
      // caso el mensaje salía con "precio $0 … $0 al mes".
      !manualReady
      ? `Hola, quiero cotizar una propiedad en el sitio de Altta Homes pero no tengo a la mano el valor de avalúo.${waInfonavit} ¿Me ayudas?`
      : `Hola, hice el ejercicio de cotización en el sitio de Altta Homes con mis propios valores: precio ${fmtMXN(price)} y avalúo ${fmtMXN(appraisal)}. ${waResultado}${waInfonavit} ¿Me ayudas con una cotización exacta?`
    : `Hola, hice el ejercicio de cotización en el sitio de Altta Homes. Me interesa ${model?.name} en ${model?.dev}${variantNote ? ` (${variantNote})` : ""} — precio ${fmtMXN(price)}. ${waResultado}${waInfonavit} ¿Me ayudas con una cotización exacta?`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className={styles.calculator}>
      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Modelo</span>
          <select
            className={styles.select}
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
          >
            {/* Agrupado por desarrollo: un <select> nativo no envuelve texto,
                lo CORTA. Con el desarrollo y el precio dentro de cada opción
                ("Casa Ceiba · Jardines del Sur 6 — $2,150,000") se salía de la
                pantalla en celular. El desarrollo va ahora en el <optgroup>
                (se escribe una vez) y el precio ya se ve abajo, en el desglose
                "Precio del modelo" — así la opción siempre cabe. */}
            {modelsByDev.map(([dev, devModels]) => (
              <optgroup key={dev} label={dev}>
                {devModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <optgroup label="Otra propiedad">
              <option value={MANUAL_ID}>Ingresar mis propios valores</option>
            </optgroup>
          </select>
          {variantNote && (
            <span className={styles.fieldHint}>
              Precio correspondiente al <strong>{variantNote}</strong>. Hay más
              niveles y vistas disponibles — cotízalos por WhatsApp.
            </span>
          )}
        </label>

        {isManual && (
          <div className={styles.manualBox}>
            <div className={styles.manualGrid}>
              <label className={styles.manualField}>
                <span className={styles.fieldLabel}>Precio de venta</span>
                <div className={styles.manualInputWrap}>
                  <span className={styles.manualPrefix}>$</span>
                  <input
                    className={styles.manualInput}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Ej. 2,500,000"
                    value={fmtGrouped(customPrice)}
                    onChange={(e) => setCustomPrice(digitsOnly(e.target.value))}
                  />
                </div>
                <span className={styles.fieldHint}>
                  Lo que realmente pagas por la vivienda, ya con descuentos o
                  promociones aplicados.
                </span>
              </label>

              <label className={styles.manualField}>
                <span className={styles.fieldLabel}>Valor de avalúo</span>
                <div className={styles.manualInputWrap}>
                  <span className={styles.manualPrefix}>$</span>
                  <input
                    className={styles.manualInput}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Ej. 2,800,000"
                    value={fmtGrouped(customAppraisal)}
                    onChange={(e) =>
                      setCustomAppraisal(digitsOnly(e.target.value))
                    }
                  />
                </div>
                {/* Antes decía "si no lo conoces, déjalo vacío" y por dentro se
                    usaba el precio de venta — pero el desglose seguía rotulando
                    ese número como "% del avalúo". Calculaba sobre el precio y
                    lo llamaba avalúo. Ahora se le pide escribirlo explícito: lo
                    que ve es lo que es. */}
                <span className={styles.fieldHint}>
                  Lo que un perito dice que vale en el mercado. Es sobre este
                  valor que el banco presta.{" "}
                  <strong>
                    Si no lo conoces, escribe aquí el mismo precio de venta
                  </strong>{" "}
                  — el cálculo sale conservador.
                </span>
              </label>
            </div>

            <p className={styles.manualNote}>
              ¿No conoces el avalúo? Escribe el mismo precio de venta para un
              cálculo conservador, o{" "}
              <a href={waHref} target="_blank" rel="noreferrer">
                escríbenos por WhatsApp
              </a>{" "}
              y lo revisamos juntos.
            </p>
          </div>
        )}

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Aportación en efectivo: <strong>{fmtMXN(cashTotal)}</strong>
          </span>
          <input
            className={styles.slider}
            type="range"
            min={requiredCash}
            max={sliderMax}
            step={CASH_STEP}
            value={cashTotal}
            /* El clamp a `maxCash` es lo que hace que el final de la barra
               caiga en el total EXACTO y no en el último múltiplo de 5,000. */
            onChange={(e) => setCash(Math.min(Number(e.target.value), maxCash))}
          />
          <span className={styles.fieldHint}>
            {requiredCash === 0
              ? "Este modelo no la necesita: el crédito sobre avalúo cubre precio y gastos. Si aportas algo, tu mensualidad baja."
              : `Mínimo para este modelo: ${fmtMXN(requiredCash)} (el crédito cubre el resto). Si aportas más, tu mensualidad baja.`}{" "}
            Puedes subirla hasta cubrir el total y comprar de contado.
          </span>
        </label>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Plazo</span>
          <div className={styles.termButtons} role="group" aria-label="Plazo en años">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.termBtn} ${years === t ? styles.termBtnActive : ""}`}
                onClick={() => setYears(t)}
              >
                {t} años
              </button>
            ))}
          </div>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Tasa de referencia: <strong>{rate.toFixed(2)}%</strong> anual fija
          </span>
          <input
            className={styles.slider}
            type="range"
            min="9.5"
            max="12"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <span className={styles.fieldHint}>
            Rango típico de la banca en 2026. La tasa final depende de tu perfil
            y de cada institución.
          </span>
        </label>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>¿Cuentas con crédito Infonavit?</span>
          <div className={styles.termButtons} role="group" aria-label="¿Cuentas con crédito Infonavit?">
            <button
              type="button"
              className={`${styles.termBtn} ${hasInfonavit ? styles.termBtnActive : ""}`}
              onClick={() => setHasInfonavit(true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={`${styles.termBtn} ${!hasInfonavit ? styles.termBtnActive : ""}`}
              onClick={() => setHasInfonavit(false)}
            >
              No
            </button>
          </div>
        </div>

        {hasInfonavit && (
          <div className={styles.infonavitNote}>
            <strong>Buena noticia:</strong> con <strong>Cofinavit</strong>, tu
            crédito Infonavit se suma al del banco y tu capacidad de compra
            sube. Y con <strong>Apoyo Infonavit</strong>, tus aportaciones
            patronales se van directo a pagar tu crédito bancario — podrías
            terminarlo años antes. Cuál te conviene depende de tu
            precalificación: te la revisamos gratis por WhatsApp.
          </div>
        )}
      </div>

      <div className={styles.results}>
        {/* En manual no se pinta una tabla hasta tener AMBOS datos: sin avalúo
            los cálculos no existen (el banco presta sobre él). Se dice cuál
            falta, no un genérico "llena los campos". */}
        {isManual && !manualReady ? (
          <p className={styles.awaitingInput}>
            {manualPrice <= 0 && manualAppraisal <= 0 ? (
              <>
                Escribe el <strong>precio de venta</strong> y el{" "}
                <strong>valor de avalúo</strong> de la propiedad, y aquí
                aparecerá tu mensualidad estimada, el crédito que necesitas y
                cuánto efectivo tendrías que aportar.
              </>
            ) : manualAppraisal <= 0 ? (
              <>
                Falta el <strong>valor de avalúo</strong>. El banco presta sobre
                ese valor, así que sin él no se puede estimar tu crédito.{" "}
                <strong>Si no lo conoces, escribe el mismo precio de venta.</strong>
              </>
            ) : (
              <>
                Falta el <strong>precio de venta</strong> de la propiedad.
              </>
            )}
          </p>
        ) : (
        <>
        {/* En contado el badge de "sin enganche" se contradice solo: no hay
            crédito que cubra nada porque ya pagaste todo. */}
        {calc.isCash ? (
          <p className={styles.badge}>
            <span aria-hidden="true">⭐</span>
            <span>
              Pago de <strong>contado</strong> — sin crédito y sin mensualidad
            </span>
          </p>
        ) : (
          calc.noDownPayment && (
            <p className={styles.badge}>
              <span aria-hidden="true">⭐</span>
              <span>
                Estrenas <strong>sin enganche</strong> — el crédito cubre precio y gastos
              </span>
            </p>
          )
        )}

        {/* En contado el número grande deja de ser la mensualidad (sería "$0
            /mes", que no informa nada) y pasa a ser lo que de verdad
            desembolsas: precio + gastos de escrituración. */}
        <p className={styles.resultsEyebrow}>
          {calc.isCash ? "Pago único de contado*" : "Mensualidad estimada*"}
        </p>
        <p className={styles.resultsTotal}>
          {calc.isCash ? fmtMXN(totalCost) : fmtMXN(calc.total)}
          <span className={styles.resultsPerMonth}>
            {calc.isCash ? " en total" : " /mes"}
          </span>
        </p>

        <ul className={styles.breakdown}>
          {/* Mismo orden y mismos términos que las tarjetas de precio del sitio
              (PropertyCard): primero "Valor avalúo", debajo "Precio con
              descuento". El cliente ya los vio así en la ficha del modelo, y
              leer cuánto VALE antes de cuánto PAGA hace evidente el ahorro.
              Si un modelo no trae avalúo, se cae al label neutro y la fila del
              avalúo no se pinta (si no, saldría el mismo número dos veces). */}
          {/* En MANUAL siempre se pinta: el cliente acaba de escribir ese
              número (y si no conocía el avalúo, le pedimos poner ahí el mismo
              precio de venta). Ocultarlo cuando avalúo == precio hacía que su
              dato se esfumara y pareciera que el cálculo lo ignoraba.
              En los modelos del inventario se mantiene el criterio de
              PropertyCard: sin descuento real, no hay fila que mostrar. */}
          {(isManual || hasDiscount) && (
            <li>
              <span className={styles.breakdownLabel}>
                Valor avalúo
                <em className={styles.breakdownSub}>
                  Su valor comercial: lo que realmente vale
                </em>
              </span>
              <strong>{fmtMXN(appraisal)}</strong>
            </li>
          )}
          <li>
            <span className={styles.breakdownLabel}>
              {hasDiscount
                ? "Precio con descuento"
                : isManual
                ? "Precio de venta"
                : "Precio del modelo"}
              {(isManual || hasDiscount) && (
                <em className={styles.breakdownSub}>Lo que pagas por ella</em>
              )}
            </span>
            <strong>{fmtMXN(price)}</strong>
          </li>
          <li>
            <span>Gastos de escrituración (~8.5% del avalúo)</span>
            <strong>{fmtMXN(closingCosts)}</strong>
          </li>
          <li>
            <span className={styles.breakdownLabel}>
              Crédito bancario estimado
              <em className={styles.breakdownSub}>{creditSub}</em>
            </span>
            <strong>{fmtMXN(calc.principal)}</strong>
          </li>
          <li className={styles.breakdownDivider} aria-hidden="true" />
          <li>
            <span>Efectivo para estrenar</span>
            <strong className={cashTotal === 0 ? styles.zero : undefined}>
              {cashTotal === 0 ? "$0" : fmtMXN(cashTotal)}
            </strong>
          </li>
          {/* Sin mensualidad no hay ingreso que sugerir (saldría "$0" y el
              cliente lo leería como "no necesitas ingresos"). */}
          {!calc.isCash && (
            <li>
              <span>Ingreso sugerido</span>
              <strong>{fmtMXN(calc.suggestedIncome)}</strong>
            </li>
          )}
        </ul>

        <a className={`btn btn-primary ${styles.cta}`} href={waHref} target="_blank" rel="noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Recibe tu cotización exacta por WhatsApp
        </a>

        <p className={styles.disclaimer}>
          *Ejercicio de cotización estimado con fines informativos, calibrado
          con simuladores de la banca (2026). No constituye una oferta de
          crédito ni preaprobación. El crédito sobre avalúo, la tasa, seguros,
          gastos y condiciones finales los determina cada institución según tu
          perfil y el proyecto. Precios y disponibilidad sujetos a cambio.
          Aplican restricciones.
        </p>
        </>
        )}
      </div>
    </div>
  );
}
