/* ==========================================================================
   DATOS.JS  —  AQUÍ ES DONDE MODIFICAS TU APP (no necesitas tocar nada más)
   --------------------------------------------------------------------------
   1) CATALOGO: las secciones y tarjetas que ves en pantalla.
      Cada tarjeta es una línea:   ["Título", "icono", "referencia"]

      La "referencia" decide qué hace la tarjeta al tocarla:
        · nombre de una tabla de TABLAS   → abre esa tabla
        · nombre de una calculadora       → abre esa calculadora (ver calculadoras.js)
        · "archivos/mi-archivo.pdf"       → abre el archivo (PDF, Excel, Word, imagen…)
        · "https://…"                     → abre un enlace
        · vacío ""                        → tarjeta "pendiente" (la ves, pero aún sin contenido)

   2) TABLAS: tablas técnicas. Copia un bloque y cambia los datos.
   3) Los archivos van en la carpeta /archivos de tu repositorio.
   ========================================================================== */

const CATALOGO = [
  {
    seccion: "Tablas técnicas",
    items: [
      ["Ángulos, “Z”, “T” y cuadrados", "∟", ""],
      ["P.T.R.", "▢", ""],
      ["Áreas", "⬡", "calc-areas"],
      ["Pesos volumétricos", "⬚", "tabla-pesosvol"],
      ["Canal CPS y “U”", "⊏", ""],
      ["Soleras de fierro", "▭", ""],
      ["Perfiles tubulares", "◫", ""],
      ["Volúmenes", "⌭", "calc-volumenes"],
      ["Canal Monten", "⎡", ""],
      ["Tuberías", "○", ""],
      ["Peso de cables desnudos", "◍", ""],
      ["Momentos y cortantes", "⏛", ""],
      ["Láminas", "〰", ""],
      ["Varilla, redondo y alambrón", "⌀", "tabla-varilla"],
      ["Peso cadenas", "⛓", ""],
      ["Proporcionamiento de concreto", "◩", ""],
      ["Malla electrosoldada y castillos", "▦", ""],
      ["Vigueta IPR, “I” y “H”", "Ⅰ", ""],
      ["Tablas bridas clase 150 a 2,500 #", "◎", ""],
      ["Equivalencias pulg. – milímetros", "⇄", "tabla-pulmm"],
      ["Placa de acero A-36 y antiderrapante", "▰", "calc-placa"],
      ["Especificación tubería de acero, perímetros, peso", "◐", ""],
      ["Rendimientos recubrimientos / pinturas", "🖌", ""],
      ["Tabla de dimensiones y propiedades de perfiles (IMCA)", "▤", ""],
      ["Rejilla electrosoldada", "▥", ""],
      ["Dimensiones placas bloqueo (comales)", "◔", ""],
      ["Movimientos de tierras", "⛰", ""],
      ["Perfiles inoxidables", "▱", ""],
      ["Alambre galvanizado", "➰", ""],
      ["Especificación clavos", "⸋", ""],
      ["Malla ciclón", "⬗", ""],
      ["Malla electrosoldada", "▦", ""],
      ["Equivalencia BTU – toneladas", "❄", "calc-btu"],
      ["Proporciones morteros", "🧱", ""]
    ]
  },
  {
    seccion: "Cuantificadores, convertidores y consumos",
    items: [
      ["Consumo oxígeno-acetileno tubería", "🔥", ""],
      ["Consumos oxígeno-acetileno, soldadura en placas", "🔥", ""],
      ["No. de cables por ducto", "◉", "calc-cables"],
      ["Calculadora de conversión de unidades", "🧮", "calc-unidades"],
      ["Consumo soldadura tubería", "⚡", ""],
      ["Consumos soldadura placas", "⚡", ""],
      ["Cuantificador varilla corrugada, alambre recocido y galvanizado", "⫽", ""],
      ["Convertidor Kg/Ml – Lb/Ft, Pulg – mm", "⇄", "calc-pulgmm"],
      ["Cuantificador ductos aire acondicionado", "▭", ""],
      ["Dimensiones y pesos de conexiones", "⌐", ""],
      ["Largo cortes perfiles varios", "✂", "calc-cortes"],
      ["Conversión de pulg. a pie tablón", "🪵", "calc-tablon"],
      ["No. de varillas por lecho", "∷", "calc-lecho"],
      ["Consumos tubos PVC y cobre", "⌇", ""],
      ["Cuantificador acero", "🏗", "calc-acero"]
    ]
  },
  {
    seccion: "Leyes, manuales y costos",
    items: [
      ["Manual de Precios Unitarios (Didier Ramírez Celis)", "📘", "archivos/manual-precios-unitarios.pdf"],
      ["Manual de uso general (Opus)", "📘", "archivos/manual-opus-uso-general.pdf"],
      ["Manual de Opus Planet", "📘", "archivos/manual-opus-planet.pdf"],
      ["Manual de Opus 2010", "📘", "archivos/manual-opus-2010.pdf"],
      ["Neodata 2009", "📘", "archivos/neodata-2009.pdf"],
      ["Manual Neodata Precios Unitarios 2012", "📘", "archivos/neodata-2012-manual.pdf"],
      ["El ABC del analista de precios unitarios", "📘", "archivos/abc-analista-precios-unitarios.pdf"],
      ["Ley de Obra Pública", "⚖", "archivos/ley-obra-publica.pdf"],
      ["Reglamento de la Ley de Obra Pública", "⚖", "archivos/reglamento-ley-obra-publica.pdf"],
      ["Ley de Adquisiciones", "⚖", "archivos/ley-adquisiciones.pdf"],
      ["Reglamento de la Ley de Adquisiciones", "⚖", "archivos/reglamento-ley-adquisiciones.pdf"],
      ["Ley de Petróleos Mexicanos", "⚖", "archivos/ley-pemex.pdf"],
      ["Reglamento de PEMEX", "⚖", "archivos/reglamento-pemex.pdf"],
      ["Ley Federal del Trabajo", "⚖", "archivos/ley-federal-del-trabajo.pdf"],
      ["Ley del IMSS", "⚖", "archivos/ley-imss.pdf"]
    ]
  },
  {
    seccion: "FSR y sobrecostos",
    items: [
      ["FSR general", "🧮", "calc-fsr"],
      ["FSR 14 x 14", "🧮", ""],
      ["Sobrecostos estándar (Ind., Fin., Util., C.A.)", "🧮", "calc-sobrecostos"],
      ["Datos M2 const. IMSS", "🏠", ""]
    ]
  }
];

/* ==========================================================================
   TABLAS
   Formato:  "tabla-nombre": { titulo, columnas:[…], filas:[[…],[…]], nota }
   Para agregar una: copia un bloque, cámbiale el nombre y úsalo como
   "referencia" en una tarjeta del CATALOGO.
   ========================================================================== */
const TABLAS = {

  "tabla-varilla": {
    titulo: "Varilla corrugada: diámetros, pesos y áreas",
    columnas: ["No.", "Diámetro (pulg)", "Diámetro (mm)", "Peso (kg/m)", "Área (cm²)"],
    filas: [
      ["2",  "1/4",  "6.4",  "0.248", "0.32"],
      ["3",  "3/8",  "9.5",  "0.557", "0.71"],
      ["4",  "1/2",  "12.7", "0.996", "1.27"],
      ["5",  "5/8",  "15.9", "1.560", "1.98"],
      ["6",  "3/4",  "19.1", "2.250", "2.85"],
      ["8",  "1",    "25.4", "3.975", "5.07"],
      ["10", "1 1/4","31.8", "6.225", "7.94"],
      ["12", "1 1/2","38.1", "8.938", "11.40"]
    ],
    nota: "Valores nominales de uso común. Confirma con la ficha de tu proveedor o la norma que te aplique."
  },

  "tabla-pesosvol": {
    titulo: "Pesos volumétricos (valores típicos de referencia)",
    columnas: ["Material", "kg/m³"],
    filas: [
      ["Acero", "7,850"],
      ["Cobre", "8,960"],
      ["Aluminio", "2,700"],
      ["Concreto reforzado", "2,400"],
      ["Agua", "1,000"],
      ["PVC rígido", "1,400"]
    ],
    nota: "Agrega aquí los materiales que uses con el valor de tu proyecto o norma."
  },

  "tabla-pulmm": {
    titulo: "Equivalencias pulgadas – milímetros",
    columnas: ["Fracción", "Pulgadas (decimal)", "Milímetros"],
    filas: (function () {
      const f = [];
      for (let n = 1; n <= 64; n++) {            // de 1/16" hasta 4" en pasos de 1/16
        const dec = n / 16;
        let num = n, den = 16;
        while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2; }
        const ent = Math.floor(num / den), resto = num % den;
        const txt = resto === 0 ? String(ent) : (ent ? ent + " " : "") + resto + "/" + den;
        f.push([txt + '"', dec.toFixed(4), (dec * 25.4).toFixed(2)]);
      }
      return f;
    })(),
    nota: "1 pulgada = 25.4 mm exactos."
  }

};
