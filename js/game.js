// =============================================================
// game.js — Núcleo del juego: estados, loop principal y lógica
// =============================================================

const ESTADO = {
    MENU:      'MENU',
    PLAYING:   'PLAYING',
    PAUSED:    'PAUSED',
    GAME_OVER: 'GAME_OVER',
};

const COLUMNAS            = 22;
const FILAS               = 18;
const VEL_INICIAL         = 300; // ms entre ticks al inicio — empieza lento
const VEL_MINIMA          = 80;  // límite máximo de velocidad
const REDUCCION_POR_FRUTA = 5;   // ms que se resta por cada fruta comida
const FRUTAS_POR_NIVEL    = 8;
const TIEMPO_COMBO        = 3000; // ms sin comer para resetear el combo

class Game {
    constructor(canvas) {
        this.canvas   = canvas;
        this.renderer = new Renderer(canvas);
        this.input    = new InputManager();
        this.ui       = new UIManager();
        this.snake    = new Snake(COLUMNAS, FILAS);
        this.food     = new FoodManager(COLUMNAS, FILAS);

        this._estado     = ESTADO.MENU;
        this._tick       = 0;
        this._ultimoTick = 0;

        this.score          = 0;
        this.highScore      = parseInt(localStorage.getItem('snakeHighScore') || '0');
        this.nivel          = 1;
        this.frutasComidas  = 0;
        this.velocidad      = VEL_INICIAL;
        this.combo          = 1;
        this._tiempoUltimaFruta = 0;
        this._timerCombo    = null;

        this._configurarEventos();
        this.ui.actualizarHUD(0, 1, 1, this.highScore);
        this.ui.mostrarMenu();
        this._loop(0);
    }

    // ── Configuración de eventos ──────────────────────────────

    _configurarEventos() {
        this.input.on('pausa',    () => this._togglePausa());
        this.input.on('confirmar',() => this._confirmar());
        this.input.on('escape',   () => { if (this._estado === ESTADO.PLAYING) this._togglePausa(); });

        document.getElementById('btn-jugar').addEventListener('click',     () => this.iniciar());
        document.getElementById('btn-reiniciar').addEventListener('click',  () => this.reiniciar());
    }

    // ── Control de estados ────────────────────────────────────

    iniciar() {
        this._resetearPartida();
        this._estado = ESTADO.PLAYING;
        this.ui.ocultarMenu();
        this.ui.ocultarGameOver();
    }

    reiniciar() {
        this._resetearPartida();
        this._estado = ESTADO.PLAYING;
        this.ui.ocultarGameOver();
    }

    _togglePausa() {
        if (this._estado === ESTADO.PLAYING) this._estado = ESTADO.PAUSED;
        else if (this._estado === ESTADO.PAUSED) this._estado = ESTADO.PLAYING;
    }

    _confirmar() {
        if (this._estado === ESTADO.MENU)      this.iniciar();
        if (this._estado === ESTADO.GAME_OVER) this.reiniciar();
        if (this._estado === ESTADO.PAUSED)    this._togglePausa();
    }

    _gameOver() {
        this._estado = ESTADO.GAME_OVER;
        const esRecord = this.score > this.highScore;
        if (esRecord) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        this.ui.mostrarGameOver(this.score, this.nivel, this.highScore, esRecord);
    }

    _resetearPartida() {
        this.score         = 0;
        this.nivel         = 1;
        this.frutasComidas = 0;
        this.velocidad     = VEL_INICIAL;
        this.combo         = 1;
        this._tiempoUltimaFruta = 0;
        clearTimeout(this._timerCombo);

        this.snake.reset();
        this.food.reset();
        this._generarComida();

        this.ui.actualizarHUD(0, 1, 1, this.highScore);
        this.ui.mostrarEfecto(null);
    }

    // ── Loop principal ────────────────────────────────────────

    _loop(timestamp) {
        requestAnimationFrame((t) => this._loop(t));
        this._tick++;

        const deltaTick = timestamp - this._ultimoTick;

        if (this._estado === ESTADO.PLAYING && deltaTick >= this.velocidad) {
            this._ultimoTick = timestamp;
            this._actualizarLogica();
        }

        this._renderizar();
    }

    // ── Lógica de juego ───────────────────────────────────────

    _actualizarLogica() {
        const nuevaDir = this.input.consumirDireccion();
        this.snake.cambiarDireccion(nuevaDir);

        // Calculamos la próxima posición de la cabeza para verificar colisión con comida antes de mover
        const nuevaCabeza = {
            x: this.snake.cabeza.x + this.snake.direccion.x,
            y: this.snake.cabeza.y + this.snake.direccion.y,
        };
        const resultado = this.food.verificarColision(nuevaCabeza);

        const colision = this.snake.mover(resultado !== null);
        if (colision) {
            this._gameOver();
            return;
        }

        if (resultado) this._procesarComida(resultado);

        this.ui.actualizarHUD(this.score, this.nivel, this.combo, this.highScore);
        this.ui.mostrarEfecto(this.snake.efectoActivo);
    }

    _procesarComida({ fruta, especial }) {
        this.score += fruta.puntos * this.combo;

        if (especial) {
            if (fruta.efecto !== 'puntos') {
                this.snake.activarEfecto(fruta.efecto, fruta.duracion);
            }
            if (fruta.efecto === 'velocidad') {
                this._ajustarVelocidad(-30);
                setTimeout(() => this._recalcularVelocidad(), fruta.duracion);
            }
            if (fruta.efecto === 'lento') {
                this._ajustarVelocidad(50);
                setTimeout(() => this._recalcularVelocidad(), fruta.duracion);
            }
        } else {
            this.frutasComidas++;
            // Aumentamos la velocidad con cada fruta para una progresión continua y suave
            this._recalcularVelocidad();
            this._verificarSubidaNivel();
            const ocupadas = [...this.snake.obtenerPosiciones(), ...this.food.obtenerPosicionesOcupadas()];
            this.food.intentarFrutaEspecial(ocupadas);
            this._generarComida();
        }

        this._actualizarCombo();
    }

    _actualizarCombo() {
        const ahora = Date.now();
        this.combo = ahora - this._tiempoUltimaFruta < TIEMPO_COMBO
            ? Math.min(this.combo + 1, 5)
            : 1;
        this._tiempoUltimaFruta = ahora;

        clearTimeout(this._timerCombo);
        this._timerCombo = setTimeout(() => {
            this.combo = 1;
            this.ui.actualizarHUD(this.score, this.nivel, this.combo, this.highScore);
        }, TIEMPO_COMBO);
    }

    _verificarSubidaNivel() {
        if (this.frutasComidas >= this.nivel * FRUTAS_POR_NIVEL) {
            this.nivel++;
        }
    }

    // La velocidad crece de forma continua: 5ms menos por cada fruta comida.
    // Así la progresión es suave y perceptible desde la primera fruta.
    _recalcularVelocidad() {
        this.velocidad = Math.max(VEL_MINIMA, VEL_INICIAL - this.frutasComidas * REDUCCION_POR_FRUTA);
    }

    _ajustarVelocidad(delta) {
        this.velocidad = clamp(this.velocidad + delta, VEL_MINIMA, VEL_INICIAL + 60);
    }

    _generarComida() {
        const ocupadas = [...this.snake.obtenerPosiciones(), ...this.food.obtenerPosicionesOcupadas()];
        this.food.generarFruta(ocupadas);
    }

    // ── Renderizado ───────────────────────────────────────────

    _renderizar() {
        const r = this.renderer;
        r.limpiar();
        r.dibujarTablero(COLUMNAS, FILAS);

        if (this._estado === ESTADO.PLAYING || this._estado === ESTADO.PAUSED) {
            if (this.snake.invulnerable) r.dibujarFlashInvulnerable(this._tick);
            r.dibujarFrutas(this.food.frutas, this.food.frutaEspecial);
            r.dibujarSerpiente(this.snake);
            if (this._estado === ESTADO.PAUSED) r.dibujarPausa();
        }
    }
}

// Punto de entrada: inicializamos cuando el DOM está listo.
document.addEventListener('DOMContentLoaded', () => {
    const canvas  = document.getElementById('game-canvas');
    canvas.width  = COLUMNAS * TAMANIO_CELDA;
    canvas.height = FILAS    * TAMANIO_CELDA;

    window.juego = new Game(canvas);
});
