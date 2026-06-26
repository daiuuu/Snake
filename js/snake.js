// =============================================================
// snake.js — Lógica pura de la serpiente (sin dibujo)
// =============================================================

// Colores de la paleta pastel para el cuerpo (segmentos alternos)
const COLORES_SERPIENTE = ['#B8E7FF', '#C8F5C6', '#D8C5FF'];
const COLOR_CABEZA      = '#F8BBD9';

class Snake {
    constructor(columnas, filas) {
        this.columnas = columnas;
        this.filas    = filas;
        this.reset();
    }

    reset() {
        const cx = Math.floor(this.columnas / 2);
        const cy = Math.floor(this.filas / 2);
        this.cuerpo = [
            { x: cx,     y: cy },
            { x: cx - 1, y: cy },
            { x: cx - 2, y: cy },
        ];
        this.direccion       = { x: 1, y: 0 };
        this.direccionActual = { x: 1, y: 0 };
        this.invulnerable    = false;
        this.efectoActivo    = null;
        this._timerEfecto    = null;
    }

    get cabeza() { return this.cuerpo[0]; }
    get longitud() { return this.cuerpo.length; }

    // Solo acepta la nueva dirección si no es el opuesto exacto de la actual.
    // Esto evita que la serpiente se doble 180° sobre sí misma.
    cambiarDireccion(nueva) {
        if (!nueva) return;
        const esOpuesto = nueva.x === -this.direccionActual.x &&
                          nueva.y === -this.direccionActual.y;
        if (!esOpuesto) this.direccion = nueva;
    }

    // Mueve la serpiente una celda. Devuelve true si hay colisión fatal.
    mover(creciendo = false) {
        this.direccionActual = { ...this.direccion };

        const nuevaCabeza = {
            x: this.cabeza.x + this.direccion.x,
            y: this.cabeza.y + this.direccion.y,
        };

        // Controlamos que la serpiente no salga del tablero para terminar la partida.
        if (this._fueraDeLimites(nuevaCabeza)) {
            // Con invulnerabilidad activa, la serpiente atraviesa paredes (efecto de teletransporte)
            if (this.invulnerable) {
                nuevaCabeza.x = (nuevaCabeza.x + this.columnas) % this.columnas;
                nuevaCabeza.y = (nuevaCabeza.y + this.filas)    % this.filas;
            } else {
                return true;
            }
        }

        const cuerpoSinCola = creciendo ? this.cuerpo : this.cuerpo.slice(0, -1);
        if (!this.invulnerable && cuerpoSinCola.some(s => mismaPosicion(s, nuevaCabeza))) {
            return true;
        }

        this.cuerpo.unshift(nuevaCabeza);
        if (!creciendo) this.cuerpo.pop();

        return false;
    }

    // Activa un efecto especial con duración limitada.
    activarEfecto(efecto, duracion) {
        clearTimeout(this._timerEfecto);
        this.efectoActivo = efecto;
        if (efecto === 'invulnerable') this.invulnerable = true;

        if (duracion > 0) {
            this._timerEfecto = setTimeout(() => {
                this.efectoActivo = null;
                this.invulnerable = false;
            }, duracion);
        }
    }

    _fueraDeLimites(pos) {
        return pos.x < 0 || pos.x >= this.columnas ||
               pos.y < 0 || pos.y >= this.filas;
    }

    obtenerPosiciones() {
        return this.cuerpo.map(s => ({ x: s.x, y: s.y }));
    }
}
