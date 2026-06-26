// =============================================================
// food.js — Lógica de frutas normales y especiales
// Sin emojis: cada fruta tiene un color y una forma geométrica
// que el renderer dibuja con Canvas API.
// =============================================================

// Frutas normales — círculos de distintos colores de la paleta pastel
const FRUTAS = [
    { tipo: 'baya1', puntos: 10, color: '#FFCFD2', colorGlow: '#F1C0E8', forma: 'circulo'  },
    { tipo: 'baya2', puntos: 20, color: '#FDE4CF', colorGlow: '#FBF8CC', forma: 'circulo'  },
    { tipo: 'baya3', puntos: 30, color: '#CFBAF0', colorGlow: '#A3C4F3', forma: 'circulo'  },
    { tipo: 'baya4', puntos: 15, color: '#FBF8CC', colorGlow: '#98F5E1', forma: 'circulo'  },
    { tipo: 'baya5', puntos: 25, color: '#B9FBC0', colorGlow: '#8EECF5', forma: 'circulo'  },
];

// Frutas especiales — formas distintas para reconocerlas de un vistazo
const FRUTAS_ESPECIALES = [
    { tipo: 'estrella', puntos: 50,  color: '#FBF8CC', colorGlow: '#FDE4CF', forma: 'estrella',  efecto: 'invulnerable', duracion: 5000 },
    { tipo: 'rayo',     puntos: 30,  color: '#FDE4CF', colorGlow: '#FFCFD2', forma: 'triangulo', efecto: 'velocidad',    duracion: 4000 },
    { tipo: 'diamante', puntos: 100, color: '#8EECF5', colorGlow: '#90DBF4', forma: 'diamante',  efecto: 'puntos',       duracion: 0    },
    { tipo: 'corazon',  puntos: 20,  color: '#F1C0E8', colorGlow: '#FFCFD2', forma: 'corazon',   efecto: 'lento',        duracion: 4000 },
];

class FoodManager {
    constructor(columnas, filas) {
        this.columnas = columnas;
        this.filas    = filas;

        this.frutas        = [];
        this.frutaEspecial = null;
        this._timerEspecial = null;
    }

    // Genera una posición aleatoria que no colisione con nada ya ocupado.
    _posicionLibre(ocupadas) {
        let pos;
        let intentos = 0;
        do {
            pos = {
                x: randomInt(0, this.columnas - 1),
                y: randomInt(0, this.filas - 1)
            };
            intentos++;
            if (intentos > 500) break;
        } while (ocupadas.some(o => mismaPosicion(o, pos)));
        return pos;
    }

    generarFruta(ocupadas) {
        const plantilla = FRUTAS[randomInt(0, FRUTAS.length - 1)];
        const pos       = this._posicionLibre(ocupadas);
        this.frutas.push({ ...plantilla, ...pos });
    }

    // Intenta aparicion de una fruta especial con la probabilidad indicada.
    intentarFrutaEspecial(ocupadas, probabilidad = 0.15) {
        if (this.frutaEspecial) return;
        if (Math.random() > probabilidad) return;

        const plantilla    = FRUTAS_ESPECIALES[randomInt(0, FRUTAS_ESPECIALES.length - 1)];
        const pos          = this._posicionLibre(ocupadas);
        this.frutaEspecial = { ...plantilla, ...pos };

        // La fruta especial desaparece sola si nadie la come en 8 segundos
        this._timerEspecial = setTimeout(() => {
            this.frutaEspecial = null;
        }, 8000);
    }

    // Verifica si la cabeza toca alguna fruta. Devuelve la fruta comida o null.
    verificarColision(cabeza) {
        for (let i = 0; i < this.frutas.length; i++) {
            if (mismaPosicion(cabeza, this.frutas[i])) {
                return { fruta: this.frutas.splice(i, 1)[0], especial: false };
            }
        }

        if (this.frutaEspecial && mismaPosicion(cabeza, this.frutaEspecial)) {
            const comida = this.frutaEspecial;
            clearTimeout(this._timerEspecial);
            this.frutaEspecial = null;
            return { fruta: comida, especial: true };
        }

        return null;
    }

    // Devuelve posiciones de toda la comida activa para evitar solapamientos.
    obtenerPosicionesOcupadas() {
        const pos = this.frutas.map(f => ({ x: f.x, y: f.y }));
        if (this.frutaEspecial) pos.push({ x: this.frutaEspecial.x, y: this.frutaEspecial.y });
        return pos;
    }

    reset() {
        this.frutas        = [];
        this.frutaEspecial = null;
        clearTimeout(this._timerEspecial);
    }
}
