// =============================================================
// input.js — Gestión de entradas del teclado y toque táctil
// Separar el input de la lógica permite cambiar controles sin
// tocar el núcleo del juego.
// =============================================================

class InputManager {
    constructor() {
        // Dirección pendiente: se aplica en el próximo tick del juego,
        // no inmediatamente, para evitar giros fantasma a alta velocidad.
        this.direccionPendiente = null;
        this.callbacks = {};

        // Coordenadas del inicio del swipe en móvil
        this._touchStart = null;

        this._iniciarEscuchas();
    }

    // Registra una función callback asociada a un evento con nombre clave.
    on(evento, fn) {
        this.callbacks[evento] = fn;
    }

    _emitir(evento, datos) {
        if (this.callbacks[evento]) this.callbacks[evento](datos);
    }

    _iniciarEscuchas() {
        document.addEventListener('keydown', (e) => this._manejarTecla(e));

        // Soporte táctil para móviles
        document.addEventListener('touchstart', (e) => this._touchStartHandler(e), { passive: true });
        document.addEventListener('touchend',   (e) => this._touchEndHandler(e),   { passive: true });
    }

    _manejarTecla(e) {
        const MAPA_DIRECCIONES = {
            ArrowUp:    { x: 0,  y: -1 },
            ArrowDown:  { x: 0,  y:  1 },
            ArrowLeft:  { x: -1, y:  0 },
            ArrowRight: { x: 1,  y:  0 },
        };

        if (MAPA_DIRECCIONES[e.key]) {
            // Evitar que las flechas hagan scroll en la página
            e.preventDefault();
            this.direccionPendiente = MAPA_DIRECCIONES[e.key];
            return;
        }

        // Teclas de control de estado del juego
        switch (e.key) {
            case 'p':
            case 'P':
                this._emitir('pausa');
                break;
            case 'Enter':
                this._emitir('confirmar');
                break;
            case 'Escape':
                this._emitir('escape');
                break;
        }
    }

    _touchStartHandler(e) {
        const t = e.touches[0];
        this._touchStart = { x: t.clientX, y: t.clientY };
    }

    _touchEndHandler(e) {
        if (!this._touchStart) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - this._touchStart.x;
        const dy = t.clientY - this._touchStart.y;

        // Solo registramos el swipe si supera un umbral mínimo
        const UMBRAL = 30;
        if (Math.abs(dx) < UMBRAL && Math.abs(dy) < UMBRAL) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.direccionPendiente = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        } else {
            this.direccionPendiente = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        }

        this._touchStart = null;
    }

    // Devuelve y limpia la dirección pendiente para el siguiente frame.
    consumirDireccion() {
        const d = this.direccionPendiente;
        this.direccionPendiente = null;
        return d;
    }
}
