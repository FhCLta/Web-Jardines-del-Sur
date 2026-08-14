# Segundo sitio: `jardinesdelsurcancun.com.mx`

> **Estado: DISEÑADO, NO IMPLEMENTADO.** Nada de esta carpeta está conectado al
> build. El sitio en producción (`alttahomescancun.mx`) no se ve afectado por
> estos archivos. Faltan 3 decisiones de Florencio (ver más abajo).

**Antes de tocar nada, lee [RIESGOS.md](RIESGOS.md).** Ahí está el análisis
completo — hay 16 riesgos identificados y 4 de ellos pueden hacer daño real.

---

## Qué se quiere lograr

Publicar un segundo sitio en el dominio `jardinesdelsurcancun.com.mx` que:

1. **No afecte** al sitio actual.
2. **Reutilice la misma información** (precios, inventario, contenido).
3. **Se actualice en paralelo**: un cambio de precio actualiza los dos.

## La arquitectura elegida: un código, dos compilaciones

```
        data/precios.json · data/inventory.json · dev-content.ts
                          (LOS MISMOS ARCHIVOS)
                                    │
                    ┌───────────────┴───────────────┐
              npm run build                  npm run build:jds
                    │                               │
                  out/                          out-jds/
                    │                               │
          alttahomescancun.mx          jardinesdelsurcancun.com.mx
```

**Por qué así y no de otra forma:**

- **No es un repo aparte** → si fueran dos proyectos, los precios se
  desincronizarían el primer mes. El requisito de "actualizarse en paralelo"
  obliga a compartir los archivos de datos, no a copiarlos.
- **No es una carpeta estática en `public/`** (como el cotizador) → eso no leería
  `precios.json` al compilar; habría que mantenerla a mano.
- **Es la misma app de Next**, que se compila dos veces con una variable de
  entorno distinta. Los datos se comparten **por construcción**, no por
  disciplina.

### Lo que ya juega a favor

`lib/site.ts` es **fuente única del dominio** y lo consumen 15 archivos. No hay
dominios escritos a mano regados por el código. Basta con que `SITE_URL` se lea
de una variable de entorno para que canónicas, sitemap, JSON-LD y Open Graph se
ajusten solos en cada compilación.

---

## Cambios necesarios (todos reversibles)

| Archivo | Cambio |
|---|---|
| `lib/site.ts` | leer dominio y config del sitio desde variable de entorno |
| `sites/*.config.ts` | definición de cada sitio (esta carpeta) |
| `next.config.ts` | salida distinta por sitio |
| `firebase.json` | `hosting` pasa de objeto a **lista** con `target` |
| `.firebaserc` | asociar cada `target` con su sitio de Firebase |
| `package.json` | scripts `build:jds` y `deploy:all` |
| Consola de Firebase | crear el sitio 2 y conectarle el dominio |

**El sitio actual no cambia de comportamiento.** Su compilación sigue siendo
`npm run build` → `out/`, con los mismos valores por defecto que hoy.

---

## ⚠️ El requisito más difícil no es técnico

**"Que se actualicen en paralelo" se rompe por olvido, no por código.** Alguien
despliega un sitio y no el otro, y a la semana tienen precios distintos.

Mitigación obligatoria, no opcional:

1. **Un solo comando** que compile y despliegue los dos (`npm run deploy:all`).
   Nunca dos comandos que se puedan olvidar a la mitad.
2. **Extender `scripts/check-precios.mjs`** para que compare los dos `out/`
   compilados y **truene si un precio no coincide**. Es la misma red que ya
   protege al cotizador contra el sitio.

---

## Decisiones pendientes de Florencio

Sin estas tres no se puede implementar:

### 1. ¿Qué páginas lleva el sitio 2?

**Recomendación: solo Jardines del Sur** — silo de JdS6, sus modelos, casas,
departamentos, promociones y JdS7. La Rioja 2 y Lirios Residencial 2 no pintan
nada en un dominio llamado "jardines del sur", y meterlos aumenta la
superposición con el sitio principal sin ganar nada.

### 2. ¿Indexable o `noindex`?

**Es LA decisión que define si esto ayuda o hace daño.**

| Opción | Riesgo SEO | Para qué sirve |
|---|---|---|
| **`noindex`** ← recomendada | **Ninguno** | Anuncios y compartir el link. Se mide en Ads |
| Canónica cruzada al sitio 1 | Bajo-medio | Indexable pero consolidando en el sitio 1 |
| Indexable independiente | **ALTO** | Compite contra tu propio #1 |

Hoy `alttahomescancun.mx` es **#1 en "jardines del sur 7"** con 47.7% de CTR.
Eso es lo que se pone en juego. Ver R1 en RIESGOS.md.

**Recomendación:** arrancar con `noindex` y dejarlo como bandera en la config,
igual que se hizo con `MOSTRAR_FOLLETO_PDF`. Cambiar de opinión después es una
palabra.

### 3. ¿Medición junta o separada?

Si el sitio 2 usa el mismo GTM, la misma conversión de Google Ads y el mismo
dataset de Meta, **los datos se mezclan y ya no se puede saber cuál convierte
mejor** — que era justo el motivo de hacer el segundo sitio. Ver R8, R9 y R10.

---

## Orden de implementación (cuando haya decisiones)

1. Crear el sitio en Firebase (`firebase hosting:sites:create`) y **probarlo en
   su URL `.web.app`** — riesgo cero, el dominio no se toca todavía.
2. Config por sitio + `SITE_URL` por variable de entorno.
3. `firebase.json` a multisitio con targets.
4. Scripts `build:jds` y `deploy:all` + extender `check-precios.mjs`.
5. Separar la medición (R8-R10).
6. Excluir el cotizador del sitio 2 (R6).
7. Revisar todo en la URL `.web.app`.
8. **Solo al final**, y si convence: quitar la redirección del `.com.mx` y
   conectarlo. Reversible.

Los pasos 1 a 7 **no tocan ningún dominio** y no afectan nada en producción.
