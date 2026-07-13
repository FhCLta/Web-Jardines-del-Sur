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

// Departamentos: a qué nivel/vista corresponde el precio publicado.
// MANTENIMIENTO: si cambia el precio del inventario, actualizar la etiqueta.
const VARIANT_NOTE = {
  "jds6-capua": "Nivel 3 · vista estacionamiento",
  "jds6-cedro-plus": "Nivel 2 · vista alberca",
  "lirios2-cedro-plus": "Nivel 2",
};

const fmtMXN = (n) => `$${Math.round(n).toLocaleString("es-MX")}`;

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

  const model = models.find((m) => m.id === modelId) || models[0];
  const price = model?.price || 0;
  const appraisal = model?.avaluo || price;
  const variantNote = VARIANT_NOTE[model?.id];

  // Mínimo de efectivo del modelo: lo que el crédito (90% del avalúo)
  // no alcanza a cubrir de precio + gastos. La aportación no puede bajar
  // de este piso; al cambiar de modelo se reinicia al mínimo.
  const closingCosts = appraisal * CLOSING_COSTS_PCT;
  const creditMax = appraisal * LTV_ON_APPRAISAL;
  const totalCost = price + closingCosts;
  const requiredCash = Math.max(0, Math.ceil(totalCost - creditMax));
  const maxCash = Math.ceil(requiredCash + price * 0.3);

  useEffect(() => {
    setCash(requiredCash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const cashTotal = Math.min(Math.max(cash, requiredCash), maxCash);

  const calc = useMemo(() => {
    const principal = Math.max(0, totalCost - cashTotal);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const base =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    const insurance =
      principal * LIFE_INSURANCE_FACTOR +
      appraisal * DAMAGE_INSURANCE_FACTOR +
      principal * ADMIN_FEE_FACTOR;
    const total = base + insurance;
    return {
      principal,
      base,
      insurance,
      total,
      suggestedIncome: total / SUGGESTED_PAYMENT_TO_INCOME,
      noDownPayment: requiredCash === 0,
    };
  }, [totalCost, cashTotal, appraisal, requiredCash, years, rate]);

  const waMessage = `Hola, hice el ejercicio de cotización en el sitio de Altta Homes. Me interesa ${model?.name} en ${model?.dev}${variantNote ? ` (${variantNote})` : ""} — precio ${fmtMXN(price)}. Me estimó ${fmtMXN(calc.total)} al mes a ${years} años${cashTotal === 0 ? ", sin enganche (el crédito sobre avalúo cubre precio y gastos)" : ` con ${fmtMXN(cashTotal)} de efectivo inicial`}.${hasInfonavit ? " Tengo crédito Infonavit y me interesa saber si me conviene Cofinavit o Apoyo Infonavit." : ""} ¿Me ayudas con una cotización exacta?`;
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
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.dev} — {fmtMXN(m.price)}
              </option>
            ))}
          </select>
          {variantNote && (
            <span className={styles.fieldHint}>
              Precio correspondiente al <strong>{variantNote}</strong>. Hay más
              niveles y vistas disponibles — cotízalos por WhatsApp.
            </span>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Aportación en efectivo: <strong>{fmtMXN(cashTotal)}</strong>
          </span>
          <input
            className={styles.slider}
            type="range"
            min={requiredCash}
            max={maxCash}
            step="5000"
            value={cashTotal}
            onChange={(e) => setCash(Number(e.target.value))}
          />
          <span className={styles.fieldHint}>
            {requiredCash === 0
              ? "Este modelo no la necesita: el crédito sobre avalúo cubre precio y gastos. Si aportas algo, tu mensualidad baja."
              : `Mínimo para este modelo: ${fmtMXN(requiredCash)} (el crédito cubre el resto). Si aportas más, tu mensualidad baja.`}
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
        {calc.noDownPayment && (
          <p className={styles.badge}>
            <span aria-hidden="true">⭐</span>
            <span>
              Estrenas <strong>sin enganche</strong> — el crédito cubre precio y gastos
            </span>
          </p>
        )}

        <p className={styles.resultsEyebrow}>Mensualidad estimada*</p>
        <p className={styles.resultsTotal}>
          {fmtMXN(calc.total)}
          <span className={styles.resultsPerMonth}> /mes</span>
        </p>

        <ul className={styles.breakdown}>
          <li>
            <span>Precio del modelo</span>
            <strong>{fmtMXN(price)}</strong>
          </li>
          <li>
            <span>Avalúo bancario</span>
            <strong>{fmtMXN(appraisal)}</strong>
          </li>
          <li>
            <span>Gastos de escrituración (~8.5% del avalúo)</span>
            <strong>{fmtMXN(closingCosts)}</strong>
          </li>
          <li>
            <span>Crédito bancario estimado</span>
            <strong>{fmtMXN(calc.principal)}</strong>
          </li>
          <li className={styles.breakdownDivider} aria-hidden="true" />
          <li>
            <span>Efectivo para estrenar</span>
            <strong className={cashTotal === 0 ? styles.zero : undefined}>
              {cashTotal === 0 ? "$0" : fmtMXN(cashTotal)}
            </strong>
          </li>
          <li>
            <span>Ingreso sugerido</span>
            <strong>{fmtMXN(calc.suggestedIncome)}</strong>
          </li>
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
      </div>
    </div>
  );
}
