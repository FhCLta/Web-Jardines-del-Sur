import styles from "./niveles.module.css";
import { formatPriceMxn } from "./model-utils";
import {
  ejeDeVariantes,
  etiquetaVariante,
  type VarianteDepartamento,
} from "@/lib/precios";

/** "edificio P-4" -> "Edificio P-4". Los encabezados van en mayuscula inicial. */
function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const NIVEL_LABEL: Record<string, string> = {
  PB: "Planta baja",
  "1": "Nivel 1",
  "2": "Nivel 2",
  "3": "Nivel 3",
};

type Props = {
  /** Variantes del desarrollo, tal como las devuelve getVariantesDepartamentos. */
  variantes: VarianteDepartamento[];
  /** Solo este modelo. Lo usa la ficha; el catálogo los pinta todos. */
  modelo?: string;
  waHref: string;
  /**
   * El nombre del modelo como encabezado de cada bloque. En el catálogo hace
   * falta para distinguir una tabla de otra; en la ficha el modelo ya es el
   * <h1> de la página y repetirlo sobra.
   */
  showModelName?: boolean;
  /**
   * Ancla de la seccion. Por defecto "precios-por-nivel", que es a donde apunta
   * la nota del hero de las fichas. El hub /precios pinta VARIAS tablas en la
   * misma pagina —una por desarrollo— y ahi hay que darle un id distinto a cada
   * una: dos elementos con el mismo id rompen el anclaje y el HTML.
   */
  id?: string;
};

/**
 * Tabla de precios por nivel (y vista, donde la hay).
 *
 * Vive en dos pantallas: el catálogo de departamentos, que pinta una tabla por
 * modelo, y la ficha de cada modelo de precio variable, que pinta solo la suya.
 *
 * ⚠️ NO todos los desarrollos parten igual: en Jardines 6 el precio cambia por
 * VISTA, en el Capua de Lirios por EDIFICIO y en el Cedro Plus de Lirios el
 * nivel basta. Por eso el título, la entradilla y las columnas se arman a
 * partir del eje que EXISTE en los datos (`ejeDeVariantes`), en vez de darlo
 * por hecho — una tabla que anuncia "y vista" sin vistas es un rótulo que
 * miente, y una que ignora el eje se come filas en silencio.
 */
export default function NivelesTable({
  variantes,
  modelo,
  waHref,
  showModelName = true,
  id = "precios-por-nivel",
}: Props) {
  const filas = modelo ? variantes.filter((v) => v.modelo === modelo) : variantes;
  if (filas.length === 0) return null;

  const modelos = [...new Set(filas.map((v) => v.modelo))];
  // Encabezado y entradilla de la seccion: hablan de TODAS las tablas que se
  // pintan debajo, asi que el eje se saca del conjunto. Si dos modelos usaran
  // ejes distintos gana el primero, y cada tabla igual dice el suyo.
  const ejeGeneral = ejeDeVariantes(filas);
  const sufijoEje =
    ejeGeneral?.campo === "vista"
      ? " y vista"
      : ejeGeneral?.campo === "edificio"
      ? " y edificio"
      : "";

  return (
    <section className={styles.nivelesSection} id={id}>
      <div className="container">
        <h2 className={styles.nivelesTitle}>
          {`Precios por nivel${sufijoEje}`}
        </h2>
        {/* ⚠️ NO escribir aquí "sin tener que preguntar" ni equivalentes.
            Decía eso y le quitaba al cliente el motivo para escribir, que
            es justo para lo que existe esta página. La transparencia va en
            el PRECIO; el motivo de contacto es la DISPONIBILIDAD, que sí
            cambia y solo se confirma con el asesor. */}
        <p className={styles.nivelesLead}>
          En los departamentos el precio cambia según el nivel
          {ejeGeneral?.campo === "vista" ? " y la vista" : ""}
          {ejeGeneral?.campo === "edificio" ? " y el edificio" : ""}. Aquí están
          todos, para que compares
          con calma: <strong>todos ya traen el descuento aplicado</strong>, no
          hay que restarle nada. Lo que cambia cada semana es{" "}
          <strong>qué unidades siguen libres</strong> — eso te lo confirmamos al
          momento.
        </p>

        {modelos.map((m) => {
          const delModelo = filas.filter((v) => v.modelo === m);
          const niveles = [...new Set(delModelo.map((v) => v.nivel))];
          const desde = Math.min(...delModelo.map((v) => v.precio));
          const avaluoTope = Math.max(...delModelo.map((v) => v.avaluo));
          // El eje se calcula POR MODELO: en Jardines 6 el Capua da al parque
          // o al estacionamiento y el Cedro Plus a la alberca o al
          // estacionamiento; en Lirios el Capua parte por edificio y el Cedro
          // Plus no parte. Con una lista global, cada tabla pintaba una columna
          // vacía de la variante que no le corresponde.
          const eje = ejeDeVariantes(delModelo);
          const columnas = eje?.valores ?? [];
          return (
            <div key={m} className={styles.nivelesBlock}>
              <h3 className={styles.nivelesModelo}>
                {showModelName && m}
                <span className={styles.nivelesRef}>
                  Valor avalúo hasta <strong>{formatPriceMxn(avaluoTope)}</strong>
                </span>
                <span className={styles.nivelesDesde}>
                  precio con descuento desde {formatPriceMxn(desde)}
                </span>
              </h3>
              <div className={styles.nivelesTableWrap}>
                <table className={styles.nivelesTable}>
                  <thead>
                    {/* Fila de grupo: dice UNA vez que las columnas de vista
                        son precios con descuento, en lugar de alargar cada
                        encabezado. Solo cuando hay mas de una vista; con una
                        sola columna el rotulo va directo en ella. */}
                    {columnas.length > 1 && (
                      <tr className={styles.nivelesGroupRow}>
                        <th />
                        <th />
                        <th
                          scope="colgroup"
                          colSpan={columnas.length}
                          className={styles.nivelesGroupHead}
                        >
                          Precio con descuento
                        </th>
                      </tr>
                    )}
                    <tr>
                      <th scope="col">Nivel</th>
                      {/* El avalúo es del NIVEL: las dos vistas del mismo
                          piso comparten valor comercial. */}
                      <th scope="col">Valor avalúo</th>
                      {eje ? (
                        columnas.map((v) => (
                          <th key={v} scope="col">
                            {capitalizar(etiquetaVariante(eje.campo, v))}
                          </th>
                        ))
                      ) : (
                        <th scope="col">Precio con descuento</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {niveles.map((nivel) => {
                      const enNivel = delModelo.filter((v) => v.nivel === nivel);
                      const roof = enNivel.some((v) => /ROOF/i.test(v.prototipo));
                      return (
                        <tr key={nivel}>
                          <th scope="row">
                            {NIVEL_LABEL[nivel] ?? nivel}
                            {roof && (
                              <span className={styles.nivelesRoof}>Roof garden</span>
                            )}
                          </th>
                          {/* data-label alimenta la vista de TARJETAS en
                              celular, donde esto deja de ser tabla y cada
                              nivel se apila (ver niveles.module.css). */}
                          <td className={styles.nivelesAvaluo} data-label="Valor avalúo">
                            {formatPriceMxn(enNivel[0].avaluo)}
                            {eje && (
                              <span className={styles.marcaDescuento}>
                                Precio con descuento
                              </span>
                            )}
                          </td>
                          {eje ? (
                            columnas.map((valor) => {
                              const v = enNivel.find(
                                (x) => x[eje.campo] === valor
                              );
                              return (
                                <td
                                  key={valor}
                                  data-label={capitalizar(
                                    etiquetaVariante(eje.campo, valor)
                                  )}
                                >
                                  {v ? formatPriceMxn(v.precio) : "—"}
                                </td>
                              );
                            })
                          ) : (
                            <td data-label="Precio con descuento">
                              {formatPriceMxn(enNivel[0].precio)}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <p className={styles.nivelesNota}>
          Precios netos con descuento aplicado, sujetos a disponibilidad y a
          cambio sin previo aviso. No incluyen gastos de escrituración.{" "}
          <a href={waHref} target="_blank" rel="noreferrer">
            Consulta qué unidades siguen disponibles por WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
