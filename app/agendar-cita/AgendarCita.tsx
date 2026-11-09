"use client";

// El calendario de citas. NO aparta horarios ni guarda nada: arma un mensaje
// con lo que el cliente eligió y lo abre en WhatsApp; Florencio confirma en
// ese chat (plan A, 9 nov 2026). El plan B —con servidor y Google Calendar,
// para que un horario tomado deje de ofrecerse— está en docs/agendar-cita.md.

import { useEffect, useMemo, useState } from "react";
import styles from "./agendar.module.css";
import { horaCorta, horaLarga, proximosDias, type Dia } from "./horario";

export type Oficina = {
  id: string;
  nombre: string;
  /** Como se lee dentro del mensaje: "las casas muestra de La Rioja 2". */
  enMensaje: string;
  direccion: string;
  mapa: string;
};

export type Desarrollo = {
  slug: string;
  nombre: string;
  /** Dónde se atiende; null = el cliente elige. Con oficina fija, el
   *  calendario solo muestra esa: Lirios no se agenda en La Rioja por error. */
  oficina: string | null;
  nota?: string;
};

export default function AgendarCita({
  oficinas,
  desarrollos,
  telefono,
  inicial,
  desdeGoogle: desdeGoogleInicial = false,
}: {
  oficinas: Oficina[];
  desarrollos: Desarrollo[];
  telefono: string;
  /** Desarrollo de la página (/agendar-cita/<desarrollo> o /cita/…). */
  inicial?: string;
  desdeGoogle?: boolean;
}) {
  const devInicial = desarrollos.find((d) => d.slug === inicial);
  const [dias, setDias] = useState<Dia[] | null>(null);
  const [desarrollo, setDesarrollo] = useState<string>(devInicial?.slug ?? "");
  const [oficina, setOficina] = useState<string>(devInicial?.oficina ?? "");
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [desdeGoogle, setDesdeGoogle] = useState(desdeGoogleInicial);
  const [aviso, setAviso] = useState("");

  // Los días dependen de HOY en Cancún: se calculan al abrir la página, no al
  // compilarla. De la dirección se lee: ?desarrollo= (página general),
  // ?desde=google, y lo que el cliente ya había llenado si llegó aquí desde la
  // página de otro desarrollo (?fecha=&hora=&nombre=, ver elegirDesarrollo).
  useEffect(() => {
    const proximos = proximosDias();
    setDias(proximos);
    const q = new URLSearchParams(window.location.search);
    const elegido = desarrollos.find((d) => d.slug === q.get("desarrollo"));
    if (elegido) {
      setDesarrollo(elegido.slug);
      if (elegido.oficina) setOficina(elegido.oficina);
    }
    if (q.get("desde") === "google") setDesdeGoogle(true);
    const conDia = proximos.find((d) => d.fecha === q.get("fecha"));
    if (conDia) {
      setFecha(conDia.fecha);
      const h = Number(q.get("hora"));
      if (conDia.horas.includes(h)) setHora(h);
    }
    const n = q.get("nombre");
    if (n) setNombre(n);
  }, [desarrollos]);

  const dev = desarrollos.find((d) => d.slug === desarrollo);
  const ofi = oficinas.find((o) => o.id === oficina);
  const dia = dias?.find((d) => d.fecha === fecha);

  const elegirDesarrollo = (slug: string) => {
    // En la página de un desarrollo, el título y los textos son de ESE
    // desarrollo: elegir otro lleva a su página (reportado por Florencio, 9 nov
    // 2026: en la de Jardines del Sur 6 se elegía La Rioja 2 y todo seguía
    // diciendo Jardines del Sur 6). Se conserva lo que ya llenó.
    if (inicial && slug !== inicial) {
      const q = new URLSearchParams();
      if (slug === "aun-no-se") q.set("desarrollo", slug);
      if (desdeGoogle) q.set("desde", "google");
      if (fecha) q.set("fecha", fecha);
      if (hora !== null) q.set("hora", String(hora));
      if (nombre.trim()) q.set("nombre", nombre.trim());
      const ruta = slug === "aun-no-se" ? "/agendar-cita" : `/agendar-cita/${slug}`;
      const consulta = q.toString();
      window.location.assign(consulta ? `${ruta}?${consulta}` : ruta);
      return;
    }
    setDesarrollo(slug);
    const d = desarrollos.find((x) => x.slug === slug);
    if (d?.oficina) setOficina(d.oficina);
    setAviso("");
  };

  const elegirDia = (f: string) => {
    setFecha(f);
    const nuevo = dias?.find((d) => d.fecha === f);
    if (hora !== null && !nuevo?.horas.includes(hora)) setHora(null);
    setAviso("");
  };

  const falta = !dev
    ? "Elige el desarrollo que te interesa."
    : !ofi
    ? "Elige dónde te recibimos."
    : !dia
    ? "Elige el día de tu cita."
    : hora === null
    ? "Elige la hora."
    : !nombre.trim()
    ? "Escribe tu nombre."
    : "";

  const href = useMemo(() => {
    if (falta || !dev || !ofi || !dia || hora === null) return undefined;
    // Corto, como lo pidió Florencio (9 nov 2026): desarrollo, día, hora y
    // nombre; sin dirección. La oficina solo se nombra cuando el cliente la
    // eligió ("Aún no lo decido"); en los demás ya se sabe cuál es.
    const para = dev.slug === "aun-no-se" ? "conocer los desarrollos de Altta Homes" : dev.nombre;
    const donde = dev.oficina ? "" : ` en ${ofi.enMensaje}`;
    // "a. m." ya termina en punto: sin esto salía "10:00 a. m.." .
    const cuando = `${horaLarga(hora)}${donde}`;
    const texto =
      `Hola, quiero agendar una cita para ${para} el ${dia.largo} a las ` +
      `${cuando}${cuando.endsWith(".") ? "" : "."} Mi nombre es ${nombre.trim()}.` +
      (desdeGoogle ? " Vi su perfil en Google." : "");
    return `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
  }, [falta, dev, ofi, dia, hora, nombre, desdeGoogle, telefono]);

  const manana = dia?.horas.filter((m) => m < 12 * 60) ?? [];
  const tarde = dia?.horas.filter((m) => m >= 12 * 60) ?? [];

  const botonHora = (m: number) => (
    <button
      key={m}
      type="button"
      className={`${styles.chip} ${hora === m ? styles.chipActivo : ""}`}
      aria-pressed={hora === m}
      onClick={() => {
        setHora(m);
        setAviso("");
      }}
    >
      {horaCorta(m)}
    </button>
  );

  return (
    <div className={styles.tarjeta}>
      <fieldset className={styles.paso}>
        <legend className={styles.pasoTitulo}>
          <span className={styles.pasoNum}>1</span> ¿Qué desarrollo te interesa?
        </legend>
        <div className={styles.opciones}>
          {desarrollos.map((d) => (
            <button
              key={d.slug}
              type="button"
              className={`${styles.chip} ${styles.chipAncho} ${desarrollo === d.slug ? styles.chipActivo : ""}`}
              aria-pressed={desarrollo === d.slug}
              onClick={() => elegirDesarrollo(d.slug)}
            >
              {d.nombre}
            </button>
          ))}
        </div>
        {dev?.nota && <p className={styles.nota}>{dev.nota}</p>}
      </fieldset>

      <fieldset className={styles.paso}>
        <legend className={styles.pasoTitulo}>
          <span className={styles.pasoNum}>2</span> ¿Dónde te recibimos?
        </legend>
        <div className={styles.oficinas}>
          {(dev?.oficina ? oficinas.filter((o) => o.id === dev.oficina) : oficinas).map((o) => (
            <button
              key={o.id}
              type="button"
              className={`${styles.oficina} ${oficina === o.id ? styles.oficinaActiva : ""}`}
              aria-pressed={oficina === o.id}
              onClick={() => {
                setOficina(o.id);
                setAviso("");
              }}
            >
              <strong>{o.nombre}</strong>
              <span>{o.direccion}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.paso}>
        <legend className={styles.pasoTitulo}>
          <span className={styles.pasoNum}>3</span> Elige el día
        </legend>
        {dias ? (
          <div className={styles.dias}>
            {dias.map((d) => (
              <button
                key={d.fecha}
                type="button"
                className={`${styles.dia} ${fecha === d.fecha ? styles.chipActivo : ""}`}
                aria-pressed={fecha === d.fecha}
                aria-label={d.largo}
                onClick={() => elegirDia(d.fecha)}
              >
                <span className={styles.diaEtiqueta}>{d.etiqueta}</span>
                <span className={styles.diaNumero}>{d.numero}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.cargando}>Cargando los próximos días…</p>
        )}
      </fieldset>

      <fieldset className={styles.paso}>
        <legend className={styles.pasoTitulo}>
          <span className={styles.pasoNum}>4</span> Elige la hora
        </legend>
        {dia ? (
          <>
            {manana.length > 0 && (
              <>
                <p className={styles.grupo}>Por la mañana</p>
                <div className={styles.horas}>{manana.map(botonHora)}</div>
              </>
            )}
            {tarde.length > 0 && (
              <>
                <p className={styles.grupo}>Por la tarde</p>
                <div className={styles.horas}>{tarde.map(botonHora)}</div>
              </>
            )}
          </>
        ) : (
          <p className={styles.cargando}>Primero elige el día.</p>
        )}
      </fieldset>

      <fieldset className={styles.paso}>
        <legend className={styles.pasoTitulo}>
          <span className={styles.pasoNum}>5</span> Tu nombre
        </legend>
        <input
          className={styles.campo}
          type="text"
          name="nombre"
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setAviso("");
          }}
        />
      </fieldset>

      {dev && ofi && dia && hora !== null && (
        <p className={styles.resumen}>
          <span>{dia.largo}</span> · <span>{horaLarga(hora)}</span> · <span>{ofi.nombre}</span>
        </p>
      )}

      <a
        className={`btn btn-primary ${styles.enviar} ${href ? "" : styles.enviarPendiente}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!href}
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
            setAviso(falta);
          }
        }}
      >
        Enviar mi cita por WhatsApp
      </a>
      <p className={styles.aviso} role="status">
        {aviso || "Se abre WhatsApp con tu cita ya escrita: envíala y te la confirmamos en ese mismo chat."}
      </p>
    </div>
  );
}
