import { Fragment } from "react";
import {
  getPropertiesByDev,
  getModelType,
  slugifyModel,
  formatPriceMxn,
  getWhatsAppMessageForModel,
} from "@/app/(desarrollos)/_lib/model-utils";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import styles from "./precios.module.css";

const PHONE_E164 = "529982059044";

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

  // Casas y departamentos se listan por separado: son productos distintos y
  // mezclarlos obliga a leer fila por fila para saber cual es cual. Solo
  // Jardines del Sur 6 tiene los dos; donde hay un solo tipo el subtitulo
  // sobra y no se pinta.
  const grupos = (["Casa", "Departamento"] as const)
    .map((tipo) => ({
      titulo: tipo === "Casa" ? "Casas" : "Departamentos",
      items: props.filter((p) => getModelType(p.nombre_modelo) === tipo),
    }))
    .filter((g) => g.items.length > 0);

  // Red de seguridad: si algun dia un modelo no cae en ninguno de los dos tipos,
  // aparece en su propio grupo en vez de desaparecer de la lista sin avisar.
  const sueltos = props.filter((p) => getModelType(p.nombre_modelo) === null);
  if (sueltos.length > 0) grupos.push({ titulo: "Otros modelos", items: sueltos });

  return (
    <>
      {grupos.map((g) => (
        <div key={g.titulo} className={styles.grupo}>
          {grupos.length > 1 && <h3 className={styles.grupoTitulo}>{g.titulo}</h3>}
          <TablaDeGrupo slug={slug} items={g.items} />
          <Leyenda items={g.items} />
        </div>
      ))}
    </>
  );
}

/**
 * Letra chica al pie de cada tabla, con el MISMO texto que la de las tarjetas
 * (components/PropertyCard.jsx). Se decide por grupo, no por modelo: la nota
 * del lote solo aplica donde hay terreno —las casas— y la del nivel solo donde
 * el precio varia —los departamentos—, asi que cada tabla muestra la suya y
 * ninguna muestra la que no le toca.
 */
function Leyenda({ items }: { items: ReturnType<typeof getPropertiesByDev> }) {
  const hayTerreno = items.some((p) => p.metros_terreno);
  const hayVariable = items.some((p) => p.precio_variable);
  return (
    <div className={styles.leyenda}>
      <p>
        <strong>*</strong> Precio no incluye gastos de escrituración
      </p>
      {hayTerreno && (
        <p>
          <strong>**</strong> Lote tipo. Esquina o excedente varía el costo.
        </p>
      )}
      {hayVariable && (
        <p>
          <strong>**</strong> El precio puede variar según nivel y ubicación
        </p>
      )}
    </div>
  );
}

function TablaDeGrupo({
  slug,
  items,
}: {
  slug: DevSlug;
  items: ReturnType<typeof getPropertiesByDev>;
}) {
  return (
    <div className={styles.tablaWrap}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            {/* El orden es la RESTA: lo que vale, lo que te descuentan, lo
                que pagas. El precio va al final porque es el resultado. Igual
                que la tarjeta de celular, que lo lee de arriba abajo. */}
            <th scope="col">Modelo</th>
            <th scope="col">Valor avalúo</th>
            <th scope="col">Ahorro</th>
            <th scope="col">Precio con descuento *</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const ahorro = p.valor_avaluo ? p.valor_avaluo - p.precio : null;
            const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
              getWhatsAppMessageForModel(p)
            )}`;
            return (
              <Fragment key={p.id}>
              <tr className={styles.filaDatos}>
                <th scope="row">
                  <a href={`/${slug}/${slugifyModel(p.nombre_modelo)}`}>
                    {p.nombre_modelo}
                  </a>
                </th>
                {/* Los data-label alimentan la vista de TARJETAS en celular,
                    donde la tabla se apila (ver el @media de precios.module.css).
                    ⚠️ Los METROS DE CONSTRUCCION se quitaron: quien abre una
                    lista de PRECIOS viene por el precio, y la superficie ya
                    esta en la ficha de cada modelo, a un clic. */}
                <td data-label="Valor avalúo" className={styles.avaluo}>
                  {formatPriceMxn(p.valor_avaluo ?? null)}
                </td>
                <td data-label="Ahorro" className={styles.ahorro}>
                  {ahorro ? `−${formatPriceMxn(ahorro)}` : "—"}
                </td>
                <td data-label="Precio con descuento" className={styles.precio}>
                  <span className={styles.precioValor}>
                    {/* "desde" va ANTES del importe: en español se dice "desde
                        $1,758,830", no al reves. */}
                    {p.precio_variable && (
                      <span className={styles.desde}>desde</span>
                    )}
                    {formatPriceMxn(p.precio)}
                  </span>
                </td>
              </tr>
              <tr className={styles.filaAcciones}>
                <td colSpan={4}>
                  <span className={styles.acciones}>
                    <a href={`/${slug}/${slugifyModel(p.nombre_modelo)}`}>
                      Ver fotos y recorrido 360°
                    </a>
                    {p.precio_variable && (
                      <a href={`#precios-por-nivel-${slug}`}>
                        Ver lista de precios completa
                      </a>
                    )}
                    <a
                      className={styles.cotizar}
                      href={waHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Cotizar ahora
                    </a>
                  </span>
                </td>
              </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
