// Horario de citas — UN SOLO LUGAR. De aquí salen los horarios que ofrece el
// calendario Y el texto que lo describe en la página, para que nunca digan
// cosas distintas. Dado por Florencio el 9 nov 2026: las oficinas cierran a
// las 7 pm y la última cita es a las 6, para que el cliente tenga una hora.

export const HORARIO = {
  /** Lunes (1) a sábado (6). */
  semana: { desde: 9 * 60, hasta: 18 * 60 },
  /** Domingo (0). */
  domingo: { desde: 10 * 60, hasta: 18 * 60 },
  /** Minutos entre una cita y la siguiente. */
  intervalo: 30,
  /** Cuántos días con horario se ofrecen. */
  dias: 14,
  /** Hoy solo se ofrecen horas que empiecen al menos esto después de ahora. */
  anticipacion: 60,
};

const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "9:00 a. m." · "1:30 p. m." */
export function horaLarga(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

/** "9:00" · "1:30" — en los botones, ya agrupados en mañana y tarde. */
export function horaCorta(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(minutos % 60).padStart(2, "0")}`;
}

/** Texto del horario para la página: "de 9:00 a. m. a 6:00 p. m." */
export function rangoTexto(r: { desde: number; hasta: number }): string {
  return `de ${horaLarga(r.desde)} a ${horaLarga(r.hasta)}`;
}

export type Dia = {
  /** "2026-11-11" */
  fecha: string;
  /** "Hoy" · "Mañana" · "Mié" */
  etiqueta: string;
  /** "11 nov" */
  numero: string;
  /** "miércoles 11 de noviembre" */
  largo: string;
  /** Minutos desde medianoche de cada cita disponible. */
  horas: number[];
};

/**
 * Los próximos días con citas, en hora de Cancún (UTC−5 todo el año), sin
 * importar la zona horaria del teléfono del cliente. Se calcula en el
 * navegador: en el servidor saldría congelado el día de la compilación.
 */
export function proximosDias(ahora: Date = new Date()): Dia[] {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Cancun",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(ahora)
      .map((p) => [p.type, p.value])
  );
  const hoy = Date.UTC(Number(partes.year), Number(partes.month) - 1, Number(partes.day));
  const minutosAhora = Number(partes.hour) * 60 + Number(partes.minute);

  const dias: Dia[] = [];
  for (let i = 0; dias.length < HORARIO.dias && i < HORARIO.dias + 7; i++) {
    const d = new Date(hoy + i * 864e5);
    const semana = d.getUTCDay();
    const rango = semana === 0 ? HORARIO.domingo : HORARIO.semana;
    const horas: number[] = [];
    for (let m = rango.desde; m <= rango.hasta; m += HORARIO.intervalo) {
      if (i === 0 && m < minutosAhora + HORARIO.anticipacion) continue;
      horas.push(m);
    }
    if (!horas.length) continue;
    const mes = MESES[d.getUTCMonth()];
    dias.push({
      fecha: d.toISOString().slice(0, 10),
      etiqueta: i === 0 ? "Hoy" : i === 1 ? "Mañana" : DIAS_CORTOS[semana],
      numero: `${d.getUTCDate()} ${mes.slice(0, 3)}`,
      largo: `${DIAS_LARGOS[semana]} ${d.getUTCDate()} de ${mes}`,
      horas,
    });
  }
  return dias;
}
