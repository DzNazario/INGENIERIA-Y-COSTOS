/* APP.JS — motor de la interfaz. Normalmente no necesitas editarlo. */
(function () {
  "use strict";

  const $app = document.getElementById("app");
  const $tabs = document.getElementById("pestanas");
  const $buscar = document.getElementById("buscar");

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const slug = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fmt = n => typeof n === "number"
    ? (isFinite(n) ? n.toLocaleString("es-MX", { maximumFractionDigits: 4 }) : "—") : esc(n);

  let favs = [];
  try { favs = JSON.parse(localStorage.getItem("itc-favs") || "[]"); } catch (e) {}
  const guardarFavs = () => { try { localStorage.setItem("itc-favs", JSON.stringify(favs)); } catch (e) {} };

  /* ---------- catálogo plano ---------- */
  const TODOS = [];
  CATALOGO.forEach((sec, si) => sec.items.forEach(it => {
    const [t, ico, ref] = it;
    let tipo = "pendiente";
    if (ref) {
      if (CALCS[ref]) tipo = "calc";
      else if (TABLAS[ref]) tipo = "tabla";
      else if (/^https?:/i.test(ref)) tipo = "enlace";
      else tipo = "archivo";
    }
    TODOS.push({ id: slug(t), t, ico, ref, tipo, sec: sec.seccion, si });
  }));
  const porId = id => TODOS.find(x => x.id === id);

  /* ---------- tarjetas ---------- */
  const ETIQUETA = { calc: "Calculadora", tabla: "Tabla", archivo: "Archivo", enlace: "Enlace", pendiente: "Sin contenido aún" };

  function tarjeta(it) {
    const esFav = favs.includes(it.id);
    return `<li class="tarjeta ${it.tipo}">
      <a class="abrir" href="#/ver/${it.id}">
        <span class="ico" aria-hidden="true">${esc(it.ico)}</span>
        <span class="tit">${esc(it.t)}</span>
        <span class="tipo">${ETIQUETA[it.tipo]}</span>
      </a>
      <button class="fav ${esFav ? "on" : ""}" data-fav="${it.id}" aria-label="Favorito" aria-pressed="${esFav}">${esFav ? "★" : "☆"}</button>
    </li>`;
  }

  function rejilla(lista, vacio) {
    if (!lista.length) return `<p class="vacio">${vacio}</p>`;
    return `<ul class="rejilla">${lista.map(tarjeta).join("")}</ul>`;
  }

  /* ---------- pestañas ---------- */
  function pintarTabs(activa) {
    const nombres = ["★ Favoritos"].concat(CATALOGO.map(s => s.seccion));
    $tabs.innerHTML = nombres.map((n, i) =>
      `<a href="#/seccion/${i}" class="${activa === i ? "act" : ""}">${esc(n)}</a>`).join("");
  }

  /* ---------- vistas ---------- */
  function vistaSeccion(i) {
    i = Number(i) || 0;
    pintarTabs(i);
    if (i === 0) {
      $app.innerHTML = `<h2>Favoritos</h2>` + rejilla(TODOS.filter(x => favs.includes(x.id)),
        "Toca la ☆ de cualquier tarjeta para tenerla aquí a un toque.");
    } else {
      const sec = CATALOGO[i - 1];
      $app.innerHTML = `<h2>${esc(sec.seccion)}</h2>` + rejilla(TODOS.filter(x => x.si === i - 1), "Sin tarjetas.");
    }
  }

  function vistaBusqueda(q) {
    pintarTabs(-1);
    const n = slug(q);
    const r = TODOS.filter(x => slug(x.t).includes(n) || slug(x.sec).includes(n));
    $app.innerHTML = `<h2>Resultados para “${esc(q)}”</h2>` + rejilla(r, "No encontré nada. Prueba con otra palabra.");
  }

  function cabecera(it, extra) {
    return `<p class="migas"><a href="#/seccion/${it.si + 1}">← ${esc(it.sec)}</a></p>
            <h2>${esc(it.t)}</h2>${extra || ""}`;
  }

  function vistaTabla(it) {
    const T = TABLAS[it.ref];
    let orden = { col: -1, asc: true }, filtro = "";
    $app.innerHTML = cabecera(it, `<div class="herr">
        <input id="ft" type="search" placeholder="Filtrar esta tabla…">
        <button id="csv" class="boton">Descargar CSV</button></div>
      <div class="scroll"><table><thead></thead><tbody></tbody></table></div>
      ${T.nota ? `<p class="nota">${esc(T.nota)}</p>` : ""}`);
    const thead = $app.querySelector("thead"), tbody = $app.querySelector("tbody");

    const num = s => parseFloat(String(s).replace(/,/g, ""));
    function pintar() {
      thead.innerHTML = "<tr>" + T.columnas.map((c, i) =>
        `<th data-c="${i}" class="${orden.col === i ? (orden.asc ? "asc" : "desc") : ""}">${esc(c)}</th>`).join("") + "</tr>";
      let f = T.filas.filter(r => slug(r.join(" ")).includes(slug(filtro)));
      if (orden.col >= 0) {
        const c = orden.col;
        f = f.slice().sort((a, b) => {
          const x = num(a[c]), y = num(b[c]);
          const r = (isNaN(x) || isNaN(y)) ? String(a[c]).localeCompare(String(b[c]), "es") : x - y;
          return orden.asc ? r : -r;
        });
      }
      tbody.innerHTML = f.map(r => "<tr>" + r.map(c => `<td>${esc(c)}</td>`).join("") + "</tr>").join("")
        || `<tr><td colspan="${T.columnas.length}">Sin coincidencias.</td></tr>`;
    }
    thead.addEventListener("click", e => {
      const th = e.target.closest("th"); if (!th) return;
      const c = Number(th.dataset.c);
      orden = { col: c, asc: orden.col === c ? !orden.asc : true };
      pintar();
    });
    $app.querySelector("#ft").addEventListener("input", e => { filtro = e.target.value; pintar(); });
    $app.querySelector("#csv").addEventListener("click", () => {
      const lineas = [T.columnas].concat(T.filas).map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(","));
      const blob = new Blob(["\ufeff" + lineas.join("\n")], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = it.id + ".csv"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    pintar();
  }

  function vistaCalc(it) {
    const C = CALCS[it.ref];
    const vals = {};
    C.campos.forEach(c => vals[c.id] = c.def);

    $app.innerHTML = cabecera(it, (C.nota ? `<p class="nota">${esc(C.nota)}</p>` : "") +
      `<form class="calc" onsubmit="return false"></form><div class="resultados" aria-live="polite"></div>`);
    const form = $app.querySelector("form"), res = $app.querySelector(".resultados");

    function campos() {
      form.innerHTML = C.campos.map(c => {
        const id = "c-" + c.id;
        if (c.tipo === "sel") {
          const ops = typeof c.opciones === "function" ? c.opciones(vals) : c.opciones;
          if (!ops.some(o => o[0] === vals[c.id])) vals[c.id] = ops[0] && ops[0][0];
          return `<label data-campo="${c.id}"><span>${esc(c.label)}</span><select id="${id}" data-id="${c.id}">` +
            ops.map(o => `<option value="${esc(o[0])}" ${o[0] === vals[c.id] ? "selected" : ""}>${esc(o[1])}</option>`).join("") +
            `</select></label>`;
        }
        return `<label data-campo="${c.id}"><span>${esc(c.label)}</span>
          <input id="${id}" data-id="${c.id}" type="number" inputmode="decimal" step="any" value="${vals[c.id]}"></label>`;
      }).join("");
      visibilidad();
    }
    function visibilidad() {
      C.campos.forEach(c => {
        const el = form.querySelector(`[data-campo="${c.id}"]`);
        if (el) el.hidden = c.si ? !c.si(vals) : false;
      });
    }
    function calcular() {
      let out = [];
      try { out = C.calcular(vals) || []; } catch (e) { out = [["Error", "Revisa los datos", ""]]; }
      res.innerHTML = out.map(r => `<div class="res"><span>${esc(r[0])}</span><strong>${fmt(r[1])}</strong><em>${esc(r[2] || "")}</em></div>`).join("");
    }
    form.addEventListener("input", e => {
      const id = e.target.dataset.id; if (!id) return;
      vals[id] = e.target.tagName === "SELECT" ? e.target.value : (parseFloat(e.target.value) || 0);
      if (e.target.tagName === "SELECT") campos(); else visibilidad();
      if (e.target.tagName === "SELECT") form.querySelector("#c-" + id).focus();
      calcular();
    });
    campos(); calcular();
  }

  function vistaArchivo(it) {
    const nombre = it.ref.split("/").pop();
    $app.innerHTML = cabecera(it, `<p>Se abre con la aplicación de tu teléfono o computadora (visor de PDF, Excel, Word…).</p>
      <p class="acciones"><a class="boton" href="${esc(it.ref)}" target="_blank" rel="noopener">Abrir archivo</a>
      <a class="boton sec" href="${esc(it.ref)}" download>Descargar</a></p>
      <p class="nota">Archivo esperado: <code>${esc(it.ref)}</code>. Si no abre, aún no lo has copiado a la carpeta <code>archivos</code> del repositorio con el nombre <code>${esc(nombre)}</code>.</p>`);
  }

  function vistaEnlace(it) {
    $app.innerHTML = cabecera(it, `<p class="acciones"><a class="boton" href="${esc(it.ref)}" target="_blank" rel="noopener">Abrir enlace</a></p>`);
  }

  function vistaPendiente(it) {
    $app.innerHTML = cabecera(it, `<p>Esta tarjeta todavía no tiene contenido.</p>
      <p class="nota">Para activarla, en <code>js/datos.js</code> pon como tercer valor de su línea el nombre de una tabla, de una calculadora o la ruta de un archivo (por ejemplo <code>"archivos/${esc(it.id)}.pdf"</code>).</p>`);
  }

  function vistaVer(id) {
    const it = porId(id);
    if (!it) return vistaSeccion(1);
    pintarTabs(it.si + 1);
    ({ tabla: vistaTabla, calc: vistaCalc, archivo: vistaArchivo, enlace: vistaEnlace, pendiente: vistaPendiente })[it.tipo](it);
    window.scrollTo(0, 0);
  }

  /* ---------- rutas ---------- */
  function ruta() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    if (h[0] === "ver") vistaVer(h[1]);
    else if (h[0] === "seccion") vistaSeccion(h[1]);
    else vistaSeccion(1);
  }
  window.addEventListener("hashchange", ruta);

  $buscar.addEventListener("input", () => {
    const q = $buscar.value.trim();
    if (q) vistaBusqueda(q); else ruta();
  });

  $app.addEventListener("click", e => {
    const b = e.target.closest("[data-fav]"); if (!b) return;
    const id = b.dataset.fav, i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1); else favs.push(id);
    guardarFavs();
    if ($buscar.value.trim()) vistaBusqueda($buscar.value.trim()); else ruta();
  });

  ruta();
})();
