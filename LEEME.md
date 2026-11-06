# Ingeniería Técnica y Costos

App web estática (sin servidor, sin instalar nada). Funciona sin internet una vez abierta.

## Publicar en GitHub Pages
1. Crea un repositorio en GitHub y sube **todo el contenido de esta carpeta** (que `index.html` quede en la raíz).
2. En el repositorio: **Settings → Pages → Branch: main / (root) → Save**.
3. En un minuto tendrás la dirección `https://TU-USUARIO.github.io/TU-REPO/`.
4. En el teléfono ábrela y usa **Agregar a pantalla de inicio** (Android/Chrome o iPhone/Safari). Queda como app y se guarda para uso sin conexión.

## Usarla local (sin GitHub)
- Abre `index.html` con doble clic: todo funciona excepto el modo sin conexión de instalación (eso requiere https o localhost).
- O copia la carpeta al teléfono y ábrela con cualquier navegador/administrador de archivos.

## Qué editar (todo está en 2 archivos)
| Quiero… | Dónde |
|---|---|
| Agregar, quitar o renombrar una tarjeta | `js/datos.js` → `CATALOGO` (una línea por tarjeta) |
| Llenar una tabla | `js/datos.js` → `TABLAS` (copia un bloque) |
| Agregar una calculadora | `js/calculadoras.js` → `CALCS` (copia un bloque) |
| Agregar un PDF/Excel/Word | Súbelo a `archivos/` y pon su ruta en la tarjeta |
| Cambiar colores | `css/estilos.css`, primeras líneas (`:root`) |

Ejemplo de tarjeta: `["Ley del IMSS", "⚖", "archivos/ley-imss.pdf"]`

Las tarjetas con referencia vacía `""` aparecen como "Sin contenido aún".

## Después de cambiar algo en GitHub
Si el teléfono no muestra el cambio, abre `sw.js` y cambia `VERSION = "itc-v1"` por `"itc-v2"`, etc.

## Importante
Los datos incluidos (pesos de varilla, pesos volumétricos, FSR, etc.) son valores de referencia comunes: verifícalos con tu norma, proveedor o cálculo antes de usarlos en un presupuesto. Si subes leyes o manuales con derechos de autor (Opus, Neodata, libros), hazlo en un repositorio **privado** o solo para uso personal.
