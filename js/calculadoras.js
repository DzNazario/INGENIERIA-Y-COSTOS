/* ==========================================================================
   CALCULADORAS.JS  —  cómo agregar una calculadora nueva
   --------------------------------------------------------------------------
   Copia cualquier bloque de CALCS y cambia:
     titulo   : nombre que se ve arriba
     nota     : texto pequeño opcional
     campos   : los datos que se piden
                { id, label, def }                       → número
                { id, label, tipo:"sel", opciones:[[valor,"Texto"],…], def }
                { …, si: v => v.modo === "x" }           → solo se muestra si se cumple
     calcular : función que recibe v (los valores) y devuelve una lista de
                resultados:  [["Etiqueta", número, "unidad"], …]
   Después pon el nombre del bloque (ej. "calc-areas") como referencia
   de una tarjeta en datos.js.
   ========================================================================== */

const UNIDADES = {
  "Longitud":  { m: 1, cm: 0.01, mm: 0.001, km: 1000, "pulg": 0.0254, "pie": 0.3048, "yarda": 0.9144 },
  "Área":      { "m²": 1, "cm²": 1e-4, "ha": 1e4, "pie²": 0.09290304, "pulg²": 6.4516e-4 },
  "Volumen":   { "m³": 1, "litro": 0.001, "cm³": 1e-6, "pie³": 0.028316847, "galón US": 0.003785412, "pulg³": 1.6387064e-5 },
  "Masa":      { kg: 1, g: 0.001, "ton": 1000, "lb": 0.45359237, "oz": 0.0283495231 },
  "Fuerza":    { N: 1, kN: 1000, kgf: 9.80665, lbf: 4.4482216 },
  "Presión":   { Pa: 1, kPa: 1000, MPa: 1e6, "kg/cm²": 98066.5, psi: 6894.757, bar: 1e5 }
};

const opcionesDe = (cat) => Object.keys(UNIDADES[cat]).map(u => [u, u]);
/* Área con aislamiento por calibre AWG/kcmil, cable THHN/THWN-2 (pulg²).
   Verifica contra la tabla de tu norma. Puedes agregar o corregir filas. */
const AWG_THHN = [
  ["14", 0.0097], ["12", 0.0133], ["10", 0.0211], ["8", 0.0366],
  ["6", 0.0507], ["4", 0.0824], ["3", 0.0973], ["2", 0.1158],
  ["1", 0.1562], ["1/0", 0.1855], ["2/0", 0.2223], ["3/0", 0.2679],
  ["4/0", 0.3237], ["250 kcmil", 0.3970], ["300 kcmil", 0.4608],
  ["350 kcmil", 0.5242], ["400 kcmil", 0.5863], ["500 kcmil", 0.7073]
];

/* Área interior del tubo EMT por medida comercial en pulgadas (pulg²). */
const TUBO_EMT = [
  ["1/2", 0.304], ["3/4", 0.533], ["1", 0.864], ["1 1/4", 1.496],
  ["1 1/2", 2.036], ["2", 3.356], ["2 1/2", 5.858], ["3", 8.846],
  ["3 1/2", 11.545], ["4", 14.753]
];/* Área con aislamiento por calibre AWG/kcmil, cable THHN/THWN-2 (pulg²).
   Verifica contra la tabla de tu norma. Puedes agregar o corregir filas. */
const AWG_THHN = [
  ["14", 0.0097], ["12", 0.0133], ["10", 0.0211], ["8", 0.0366],
  ["6", 0.0507], ["4", 0.0824], ["3", 0.0973], ["2", 0.1158],
  ["1", 0.1562], ["1/0", 0.1855], ["2/0", 0.2223], ["3/0", 0.2679],
  ["4/0", 0.3237], ["250 kcmil", 0.3970], ["300 kcmil", 0.4608],
  ["350 kcmil", 0.5242], ["400 kcmil", 0.5863], ["500 kcmil", 0.7073]
];

/* Área interior del tubo EMT por medida comercial en pulgadas (pulg²). */
const TUBO_EMT = [
  ["1/2", 0.304], ["3/4", 0.533], ["1", 0.864], ["1 1/4", 1.496],
  ["1 1/2", 2.036], ["2", 3.356], ["2 1/2", 5.858], ["3", 8.846],
  ["3 1/2", 11.545], ["4", 14.753]
];
const CALCS = {

  "calc-unidades": {
    titulo: "Conversión de unidades",
    campos: [
      { id: "cat", label: "Magnitud", tipo: "sel", opciones: Object.keys(UNIDADES).map(k => [k, k]), def: "Longitud" },
      { id: "x", label: "Valor", def: 1 },
      { id: "de", label: "De", tipo: "sel", opciones: v => opcionesDe(v.cat), def: "m" },
      { id: "a", label: "A", tipo: "sel", opciones: v => opcionesDe(v.cat), def: "pie" }
    ],
    calcular: v => {
      const t = UNIDADES[v.cat];
      if (!t[v.de] || !t[v.a]) return [];
      return [["Resultado", v.x * t[v.de] / t[v.a], v.a]];
    }
  },

  "calc-pulgmm": {
    titulo: "Convertidor pulg – mm y kg/m – lb/pie",
    campos: [
      { id: "modo", label: "Conversión", tipo: "sel", def: "pm", opciones: [
        ["pm", "Pulgadas → mm"], ["mp", "mm → pulgadas"],
        ["kl", "kg/m → lb/pie"], ["lk", "lb/pie → kg/m"] ] },
      { id: "x", label: "Valor", def: 1 }
    ],
    calcular: v => ({
      pm: [["Milímetros", v.x * 25.4, "mm"]],
      mp: [["Pulgadas", v.x / 25.4, "pulg"]],
      kl: [["Libras por pie", v.x * 0.671969, "lb/pie"]],
      lk: [["Kilogramos por metro", v.x / 0.671969, "kg/m"]]
    })[v.modo]
  },

  "calc-tablon": {
    titulo: "Conversión a pie tablón",
    nota: "Pie tablón = grueso (pulg) × ancho (pulg) × largo (pie) ÷ 12.",
    campos: [
      { id: "g", label: "Grueso (pulg)", def: 2 },
      { id: "an", label: "Ancho (pulg)", def: 4 },
      { id: "l", label: "Largo", def: 8.2 },
      { id: "ul", label: "Unidad del largo", tipo: "sel", def: "pie", opciones: [["pie", "pies"], ["m", "metros"], ["pulg", "pulgadas"]] },
      { id: "n", label: "Piezas", def: 1 }
    ],
    calcular: v => {
      const pies = v.ul === "pie" ? v.l : v.ul === "m" ? v.l / 0.3048 : v.l / 12;
      const pt = v.g * v.an * pies / 12 * v.n;
      return [["Pies tablón", pt, "pt"], ["Volumen", pt * 0.00235974, "m³"]];
    }
  },

  "calc-acero": {
    titulo: "Cuantificador de acero (varilla)",
    nota: "Los pesos salen de la tabla “Varilla” en datos.js: si la editas, aquí se actualiza.",
    campos: [
      { id: "no", label: "Varilla No.", tipo: "sel", def: "3",
        opciones: () => TABLAS["tabla-varilla"].filas.map(f => [f[0], "No. " + f[0] + " (" + f[1] + "\")"]) },
      { id: "l", label: "Longitud por pieza (m)", def: 12 },
      { id: "n", label: "Número de piezas", def: 10 },
      { id: "d", label: "Desperdicio (%)", def: 0 }
    ],
    calcular: v => {
      const fila = TABLAS["tabla-varilla"].filas.find(f => f[0] === v.no);
      if (!fila) return [];
      const pm = parseFloat(fila[3]);
      const m = v.l * v.n * (1 + v.d / 100);
      return [["Metros totales", m, "m"], ["Peso", m * pm, "kg"], ["Peso", m * pm / 1000, "ton"]];
    }
  },

  "calc-placa": {
    titulo: "Peso de placa de acero",
    nota: "Densidad del acero A-36: 7,850 kg/m³ (editable).",
    campos: [
      { id: "e", label: "Espesor (mm)", def: 6.35 },
      { id: "a", label: "Ancho (m)", def: 1.22 },
      { id: "l", label: "Largo (m)", def: 2.44 },
      { id: "n", label: "Piezas", def: 1 },
      { id: "rho", label: "Densidad (kg/m³)", def: 7850 }
    ],
    calcular: v => {
      const kg = v.e / 1000 * v.a * v.l * v.rho * v.n;
      return [["Área total", v.a * v.l * v.n, "m²"], ["Peso por m²", v.e / 1000 * v.rho, "kg/m²"], ["Peso total", kg, "kg"]];
    }
  },

  "calc-btu": {
    titulo: "Equivalencia BTU – toneladas de refrigeración",
    nota: "1 tonelada de refrigeración = 12,000 BTU/h = 3.517 kW.",
    campos: [
      { id: "modo", label: "Conversión", tipo: "sel", def: "bt", opciones: [["bt", "BTU/h → toneladas"], ["tb", "Toneladas → BTU/h"]] },
      { id: "x", label: "Valor", def: 24000 }
    ],
    calcular: v => v.modo === "bt"
      ? [["Toneladas", v.x / 12000, "TR"], ["Potencia", v.x / 12000 * 3.517, "kW"]]
      : [["BTU por hora", v.x * 12000, "BTU/h"], ["Potencia", v.x * 3.517, "kW"]]
  },

  "calc-areas": {
    titulo: "Áreas",
    campos: [
      { id: "f", label: "Figura", tipo: "sel", def: "rec", opciones: [
        ["rec", "Rectángulo"], ["cir", "Círculo"], ["tri", "Triángulo"], ["tra", "Trapecio"], ["ani", "Corona circular"]] },
      { id: "a", label: "Base / lado (m)", def: 2, si: v => ["rec", "tri", "tra"].includes(v.f) },
      { id: "b", label: "Altura / otro lado (m)", def: 3, si: v => ["rec", "tri", "tra"].includes(v.f) },
      { id: "c", label: "Base menor (m)", def: 1, si: v => v.f === "tra" },
      { id: "d", label: "Diámetro (m)", def: 1, si: v => ["cir", "ani"].includes(v.f) },
      { id: "d2", label: "Diámetro interior (m)", def: 0.5, si: v => v.f === "ani" }
    ],
    calcular: v => {
      const A = { rec: v.a * v.b, cir: Math.PI * v.d ** 2 / 4, tri: v.a * v.b / 2,
                  tra: (v.a + v.c) / 2 * v.b, ani: Math.PI * (v.d ** 2 - v.d2 ** 2) / 4 }[v.f];
      const out = [["Área", A, "m²"]];
      if (v.f === "cir") out.push(["Perímetro", Math.PI * v.d, "m"]);
      if (v.f === "rec") out.push(["Perímetro", 2 * (v.a + v.b), "m"]);
      return out;
    }
  },

  "calc-volumenes": {
    titulo: "Volúmenes",
    campos: [
      { id: "f", label: "Cuerpo", tipo: "sel", def: "pri", opciones: [
        ["pri", "Prisma rectangular"], ["cil", "Cilindro"], ["con", "Cono"], ["esf", "Esfera"]] },
      { id: "a", label: "Largo (m)", def: 2, si: v => v.f === "pri" },
      { id: "b", label: "Ancho (m)", def: 1, si: v => v.f === "pri" },
      { id: "d", label: "Diámetro (m)", def: 1, si: v => ["cil", "con", "esf"].includes(v.f) },
      { id: "h", label: "Altura (m)", def: 1, si: v => ["pri", "cil", "con"].includes(v.f) }
    ],
    calcular: v => {
      const V = { pri: v.a * v.b * v.h, cil: Math.PI * v.d ** 2 / 4 * v.h,
                  con: Math.PI * v.d ** 2 / 4 * v.h / 3, esf: Math.PI * v.d ** 3 / 6 }[v.f];
      return [["Volumen", V, "m³"], ["Capacidad", V * 1000, "litros"]];
    }
  },

  "calc-cables": {
    titulo: "No. de cables por ducto (AWG y pulgadas)",
    nota: "Ocupación máxima usual: 53 % (1 cable), 31 % (2 cables), 40 % (3 o más). Áreas de cable para THHN/THWN-2 y tubo EMT. Con otro tipo de cable o de tubo (PVC, pared gruesa), elige “Otro” y captura las medidas. Verifica con tu norma vigente.",
    campos: [
      { id: "tubo", label: "Tubo (medida comercial, pulg)", tipo: "sel", def: "3/4",
        opciones: () => TUBO_EMT.map(t => [t[0], t[0] + '" EMT']).concat([["otro", "Otro (capturar diámetro interior)"]]) },
      { id: "di", label: "Diámetro interior del tubo (pulg)", def: 0.824, si: v => v.tubo === "otro" },
      { id: "awg", label: "Calibre del cable (AWG)", tipo: "sel", def: "12",
        opciones: () => AWG_THHN.map(a => [a[0], isNaN(a[0]) ? a[0] : a[0] + " AWG"]).concat([["otro", "Otro (capturar diámetro exterior)"]]) },
      { id: "dc", label: "Diámetro exterior del cable (pulg)", def: 0.15, si: v => v.awg === "otro" },
      { id: "n", label: "Cables que quieres meter", def: 6 }
    ],
    calcular: v => {
      const Ad = v.tubo === "otro" ? Math.PI * v.di ** 2 / 4 : TUBO_EMT.find(t => t[0] === v.tubo)[1];
      const Ac = v.awg === "otro" ? Math.PI * v.dc ** 2 / 4 : AWG_THHN.find(a => a[0] === v.awg)[1];
      const lim = v.n === 1 ? 53 : v.n === 2 ? 31 : 40;
      const ocup = v.n * Ac / Ad * 100;
      return [
        ["Área interior del tubo", Ad, "pulg²"],
        ["Área de un cable", Ac, "pulg²"],
        ["Máx. cables con 40 % (3 o más)", Math.floor(0.40 * Ad / Ac), "cables"],
        ["Máx. cables con 31 % (2)", Math.floor(0.31 * Ad / Ac), "cables"],
        ["Máx. cables con 53 % (1)", Math.floor(0.53 * Ad / Ac), "cables"],
        ["Ocupación con " + v.n + " cables", ocup, "%"],
        ["Límite permitido", lim, "%"],
        ["¿Cumple?", ocup <= lim ? "Sí" : "No", ""]
      ];
    }
  },

  "calc-lecho": {
    titulo: "No. de varillas por lecho",
    campos: [
      { id: "b", label: "Ancho de la sección (cm)", def: 30 },
      { id: "r", label: "Recubrimiento (cm)", def: 2.5 },
      { id: "e", label: "Diámetro del estribo (cm)", def: 0.95 },
      { id: "d", label: "Diámetro de la varilla (cm)", def: 1.27 },
      { id: "s", label: "Separación libre mínima (cm)", def: 2.5 }
    ],
    calcular: v => {
      const libre = v.b - 2 * (v.r + v.e);
      const n = Math.floor((libre + v.s) / (v.d + v.s));
      return [["Ancho libre", libre, "cm"], ["Varillas por lecho", Math.max(n, 0), "pzas"]];
    }
  },

  "calc-cortes": {
    titulo: "Largo y cortes de perfiles",
    campos: [
      { id: "L", label: "Largo del tramo comercial (m)", def: 6.10 },
      { id: "c", label: "Largo de cada corte (m)", def: 1.25 },
      { id: "k", label: "Pérdida por corte (mm)", def: 3 },
      { id: "n", label: "Piezas requeridas", def: 40 }
    ],
    calcular: v => {
      const porTramo = Math.floor((v.L + v.k / 1000) / (v.c + v.k / 1000));
      if (porTramo < 1) return [["Aviso", "El corte es más largo que el tramo", ""]];
      const tramos = Math.ceil(v.n / porTramo);
      const usado = v.n * v.c + (v.n - tramos) * 0;
      return [["Cortes por tramo", porTramo, "pzas"], ["Tramos necesarios", tramos, "tramos"],
              ["Metros comprados", tramos * v.L, "m"], ["Metros útiles", usado, "m"],
              ["Desperdicio", (1 - usado / (tramos * v.L)) * 100, "%"]];
    }
  },

  "calc-fsr": {
    titulo: "Factor de Salario Real (FSR)",
    nota: "Fórmula usual: FSR = Ps × (Tp / Tl) + (Tp / Tl). Ps es la suma de obligaciones patronales (IMSS, Infonavit, SAR, etc.) como fracción: 0.30 = 30 %. Captúrala según tu cálculo.",
    campos: [
      { id: "dias", label: "Días del año", def: 365 },
      { id: "agui", label: "Aguinaldo (días)", def: 15 },
      { id: "vac", label: "Vacaciones (días)", def: 12 },
      { id: "prima", label: "Prima vacacional (%)", def: 25 },
      { id: "dom", label: "Domingos / descansos", def: 52 },
      { id: "fest", label: "Festivos y otros días no laborados", def: 7 },
      { id: "ps", label: "Ps (fracción)", def: 0 }
    ],
    calcular: v => {
      const Tp = v.dias + v.agui + v.vac * v.prima / 100;
      const Tl = v.dias - v.dom - v.fest - v.vac;
      const r = Tp / Tl;
      return [["Tp (días pagados)", Tp, "días"], ["Tl (días laborados)", Tl, "días"],
              ["Tp / Tl", r, ""], ["FSR", v.ps * r + r, ""]];
    }
  },

  "calc-sobrecostos": {
    titulo: "Sobrecostos: indirectos, financiamiento, utilidad y cargos adicionales",
    nota: "Se aplican en cascada: indirectos sobre el costo directo, financiamiento sobre (CD + indirectos), utilidad sobre (CD + ind. + fin.) y cargos adicionales sobre el precio previo.",
    campos: [
      { id: "cd", label: "Costo directo ($)", def: 1000 },
      { id: "ind", label: "Indirectos (%)", def: 0 },
      { id: "fin", label: "Financiamiento (%)", def: 0 },
      { id: "uti", label: "Utilidad (%)", def: 0 },
      { id: "ca", label: "Cargos adicionales (%)", def: 0 }
    ],
    calcular: v => {
      const i = v.cd * v.ind / 100;
      const f = (v.cd + i) * v.fin / 100;
      const u = (v.cd + i + f) * v.uti / 100;
      const pre = v.cd + i + f + u;
      const c = pre * v.ca / 100;
      return [["Indirectos", i, "$"], ["Financiamiento", f, "$"], ["Utilidad", u, "$"],
              ["Cargos adicionales", c, "$"], ["Precio unitario", pre + c, "$"],
              ["Sobrecosto total", (pre + c) / v.cd * 100 - 100, "%"]];
    }
  }

};
