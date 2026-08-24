import {
  getPropertiesByDev,
  getModelType,
  slugifyModel,
  formatPriceMxn,
} from "@/app/(desarrollos)/_lib/model-utils";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import { getVariantesDepartamentos } from "@/lib/precios";
import styles from "./precios.module.css";

/**
 * Tabla comparativa de precios de un desarrollo.
 *
 * ⚠️ ESTO NO ES LA CUADRICULA DEL SILO CON OTRO NOMBRE. El silo muestra
 * tarjetas con foto, pensadas para enamorar; aquí el formato es una tabla
 * escaneable pensada para COMPARAR, y publica tres datos que no estan en
 * ninguna otra pagina del sitio:
 *
 *   - el AHORRO en pesos (valor avaluo − precio), que hoy el cliente tiene que
 *     restar de cabeza;
 *   - todos los modelos del desarrollo en una sola vista ordenada por precio,
 *     en vez de repartidos entre /casas y /departamentos.
 *
 * ⚠️ HUBO una columna de PRECIO POR M² y se QUITO a proposito (decision de
 * Florencio). Era exacta en casas —un precio, un area— pero enganosa en
 * departamentos por dos motivos: el numero salia del precio mas bajo cuando el
 * rango real de Capua va de $20,610 a $23,411 el m², y sobre todo el Cedro Plus
 * con roof garden no mide los 104.06 m² publicados sino 121.13, con lo que el
 * calculo lo mostraba como el mas caro por metro cuando en realidad es el mas
 * barato. Un dato que se contradice a si mismo confunde mas de lo que ayuda.
 * Si algun dia se retoma, primero hay que confirmar el area real del roof.
 *
 * Si algun dia esta tabla se convierte en un listado de tarjetas como el del
 * silo, deja de tener razon de existir: seria la misma pagina dos veces.
 */
export default function TablaPrecios({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  const props = getPropertiesByDev(dev.name)
    .slice()
    .sort((a, b) => a.precio - b.precio);
  if (props.length === 0) return null;

  // Cuantas variantes de nivel/vista tiene cada modelo, para poder decirlo en
  // el enlace ("ver los 8 precios") en vez de mandar a ciegas.
  const variantes = getVariantesDepartamentos(slug);
  const cuantas = (modelo: string) =>
    variantes.filter(
      (v) => v.modelo === modelo.replace(/^Departamento /i, "").toUpperCase()
    ).length;

  return (
    <div className={styles.tablaWrap}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th scope="col">Modelo</th>
            <th scope="col">Construcción</th>
            <th scope="col">Valor avalúo</th>
            <th scope="col">Precio con descuento</th>
            <th scope="col">Ahorro</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => {
            const tipo = getModelType(p.nombre_modelo);
            const ahorro = p.valor_avaluo ? p.valor_avaluo - p.precio : null;
            return (
              <tr key={p.id}>
                <th scope="row">
                  <a href={`/${slug}/${slugifyModel(p.nombre_modelo)}`}>
                    {p.nombre_modelo}
                  </a>
                  {tipo && <span className={styles.tipo}>{tipo}</span>}
                  {/* En los departamentos el precio de la fila es un "desde":
                      sin esta salida, el que quiere el precio de SU nivel se
                      queda atorado. */}
                  {p.precio_variable && cuantas(p.nombre_modelo) > 0 && (
                    <a
                      className={styles.verLista}
                      href={`/precios/${slug}#precios-por-nivel`}
                    >
                      Ver los {cuantas(p.nombre_modelo)} precios por nivel →
                    </a>
                  )}
                </th>
                {/* Los data-label alimentan la vista de TARJETAS en celular,
                    donde la tabla se apila (ver el @media de precios.module.css). */}
                <td data-label="Construcción">
                  {p.metros_construccion ? `${p.metros_construccion} m²` : "—"}
                </td>
                <td data-label="Valor avalúo" className={styles.avaluo}>
                  {formatPriceMxn(p.valor_avaluo ?? null)}
                </td>
                <td data-label="Precio con descuento" className={styles.precio}>
                  {/* "desde" va ANTES del importe: en celular la celda se
                      vuelve una sola linea y detras se leia "$1,758,830 MXN
                      desde", al reves de como se dice en español. */}
                  {p.precio_variable && <span className={styles.desde}>desde</span>}
                  {formatPriceMxn(p.precio)}
                </td>
                <td data-label="Ahorro" className={styles.ahorro}>
                  {ahorro ? `−${formatPriceMxn(ahorro)}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
