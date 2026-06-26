// =============================================================
// utils.js — Funciones auxiliares reutilizables
// Centralizar utilidades evita repetir lógica en múltiples archivos.
// =============================================================

/**
 * Genera un número entero aleatorio entre min y max (inclusive).
 * Se usa para posicionar frutas en el tablero.
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica si dos objetos {x, y} tienen la misma posición.
 * Comparar coordenadas de esta forma evita errores de referencia.
 */
function mismaPosicion(a, b) {
    return a.x === b.x && a.y === b.y;
}

/**
 * Clamp: limita un valor dentro de un rango [min, max].
 * Útil para que efectos o velocidades no salgan de sus límites.
 */
function clamp(valor, min, max) {
    return Math.min(Math.max(valor, min), max);
}

/**
 * Interpola linealmente entre dos valores.
 * Se usa para animaciones suaves (lerp = linear interpolation).
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Convierte un color HEX a un objeto {r, g, b}.
 * Necesario para aplicar transparencias y efectos glow con Canvas.
 */
function hexARgb(hex) {
    const resultado = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return resultado ? {
        r: parseInt(resultado[1], 16),
        g: parseInt(resultado[2], 16),
        b: parseInt(resultado[3], 16)
    } : null;
}

/**
 * Formatea un número con ceros a la izquierda para el HUD.
 * Ejemplo: pad(42, 5) → "00042"
 */
function pad(numero, longitud = 5) {
    return String(numero).padStart(longitud, '0');
}
