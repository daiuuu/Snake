// =============================================================
// ui.js — Pantallas de Bienvenida, Game Over y HUD del DOM
// =============================================================

class UIManager {
    constructor() {
        this.elScore     = document.getElementById('score-valor');
        this.elNivel     = document.getElementById('nivel-valor');
        this.elCombo     = document.getElementById('combo-valor');
        this.elHighScore = document.getElementById('highscore-valor');

        this.pantallaBienvenida = document.getElementById('pantalla-bienvenida');
        this.pantallaGameOver   = document.getElementById('pantalla-gameover');

        this.elScoreFinal     = document.getElementById('go-score');
        this.elNivelFinal     = document.getElementById('go-nivel');
        this.elHighScoreFinal = document.getElementById('go-highscore');
        this.elEsRecord       = document.getElementById('go-record');
        this.elEfecto         = document.getElementById('efecto-activo');
    }

    actualizarHUD(score, nivel, combo, highScore) {
        this.elScore.textContent     = pad(score);
        this.elNivel.textContent     = nivel;
        this.elHighScore.textContent = pad(highScore);

        if (combo > 1) {
            this.elCombo.textContent = `x${combo}`;
            this.elCombo.parentElement.classList.add('activo');
        } else {
            this.elCombo.textContent = '';
            this.elCombo.parentElement.classList.remove('activo');
        }
    }

    mostrarEfecto(nombre) {
        if (!this.elEfecto) return;
        if (nombre) {
            const NOMBRES = {
                invulnerable: 'INVULNERABLE',
                velocidad:    'TURBO',
                lento:        'CALMA',
                puntos:       'BONUS',
            };
            this.elEfecto.textContent = NOMBRES[nombre] || nombre.toUpperCase();
            this.elEfecto.classList.add('visible');
        } else {
            this.elEfecto.classList.remove('visible');
        }
    }

    mostrarMenu() {
        this.pantallaBienvenida.classList.remove('oculto');
        this.pantallaGameOver.classList.add('oculto');
    }

    ocultarMenu() {
        this.pantallaBienvenida.classList.add('oculto');
    }

    mostrarGameOver(score, nivel, highScore, esRecord) {
        this.elScoreFinal.textContent     = pad(score);
        this.elNivelFinal.textContent     = nivel;
        this.elHighScoreFinal.textContent = pad(highScore);
        this.elEsRecord.style.display     = esRecord ? 'block' : 'none';
        this.pantallaGameOver.classList.remove('oculto');
    }

    ocultarGameOver() {
        this.pantallaGameOver.classList.add('oculto');
    }
}
