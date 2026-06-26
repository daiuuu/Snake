// =============================================================
// renderer.js — Todo lo visual: dibujo en Canvas
// Estética dark · glassmorphism · pastel · neon suave
// =============================================================

const TAMANIO_CELDA = 28;
const RADIO_ESQUINA = 7;

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
    }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // ── Tablero ───────────────────────────────────────────────

    dibujarTablero(columnas, filas) {
        const ancho = columnas * TAMANIO_CELDA;
        const alto  = filas    * TAMANIO_CELDA;
        const ctx   = this.ctx;

        // Fondo oscuro con tinte lila muy sutil
        ctx.save();
        this._rectRedondeado(ctx, 0, 0, ancho, alto, 16);
        ctx.fillStyle = '#131020';
        ctx.fill();
        ctx.restore();

        // Cuadrícula de puntos — opacidad mínima, solo da textura
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let col = 0; col <= columnas; col++) {
            for (let row = 0; row <= filas; row++) {
                ctx.beginPath();
                ctx.arc(col * TAMANIO_CELDA, row * TAMANIO_CELDA, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // ── Serpiente ─────────────────────────────────────────────

    dibujarSerpiente(snake) {
        const ctx    = this.ctx;
        const cuerpo = snake.cuerpo;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            const seg      = cuerpo[i];
            const esCabeza = i === 0;
            const px  = seg.x * TAMANIO_CELDA;
            const py  = seg.y * TAMANIO_CELDA;
            const tam = TAMANIO_CELDA - 2;

            const baseColor = esCabeza
                ? (snake.invulnerable ? '#FFF4B5' : COLOR_CABEZA)
                : COLORES_SERPIENTE[i % COLORES_SERPIENTE.length];

            // Glow: pronunciado en la cabeza, sutil en el cuerpo
            ctx.save();
            if (esCabeza) {
                ctx.shadowBlur  = 16;
                ctx.shadowColor = snake.invulnerable
                    ? 'rgba(255, 244, 181, 0.7)'
                    : 'rgba(248, 187, 217, 0.65)';
            } else {
                ctx.shadowBlur  = 4;
                ctx.shadowColor = baseColor;
            }

            ctx.fillStyle = baseColor;
            this._rectRedondeado(ctx, px + 1, py + 1, tam, tam, RADIO_ESQUINA);
            ctx.fill();
            ctx.restore();

            // Highlight de brillo: radial top-left para dar volumen
            ctx.save();
            const hl = ctx.createRadialGradient(
                px + 1 + tam * 0.3, py + 1 + tam * 0.25, 0,
                px + 1 + tam * 0.5, py + 1 + tam * 0.5,  tam * 0.75
            );
            hl.addColorStop(0, esCabeza ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)');
            hl.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = hl;
            this._rectRedondeado(ctx, px + 1, py + 1, tam, tam, RADIO_ESQUINA);
            ctx.fill();
            ctx.restore();

            if (esCabeza) this._dibujarOjos(ctx, px, py, snake.direccionActual);
        }
    }

    _dibujarOjos(ctx, px, py, dir) {
        const tam    = TAMANIO_CELDA - 2;
        const cx     = px + tam / 2 + 1;
        const cy     = py + tam / 2 + 1;
        const ojoR   = 2;
        const offset = 4.5;

        let ox1, oy1, ox2, oy2;
        if      (dir.x ===  1) { ox1 = cx + 4; oy1 = cy - offset; ox2 = cx + 4; oy2 = cy + offset; }
        else if (dir.x === -1) { ox1 = cx - 4; oy1 = cy - offset; ox2 = cx - 4; oy2 = cy + offset; }
        else if (dir.y === -1) { ox1 = cx - offset; oy1 = cy - 4; ox2 = cx + offset; oy2 = cy - 4; }
        else                   { ox1 = cx - offset; oy1 = cy + 4; ox2 = cx + offset; oy2 = cy + 4; }

        ctx.save();
        [[ox1, oy1], [ox2, oy2]].forEach(([ex, ey]) => {
            ctx.fillStyle = 'rgba(12, 8, 25, 0.92)';
            ctx.beginPath();
            ctx.arc(ex, ey, ojoR, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
            ctx.beginPath();
            ctx.arc(ex + 0.6, ey - 0.6, ojoR * 0.42, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    // ── Comida ────────────────────────────────────────────────

    dibujarFrutas(frutas, frutaEspecial) {
        frutas.forEach(f => this._dibujarFruta(f, false));
        if (frutaEspecial) this._dibujarFruta(frutaEspecial, true);
    }

    _dibujarFruta(fruta, especial) {
        const ctx = this.ctx;
        const cx  = fruta.x * TAMANIO_CELDA + TAMANIO_CELDA / 2;
        const cy  = fruta.y * TAMANIO_CELDA + TAMANIO_CELDA / 2;
        const r   = especial ? (TAMANIO_CELDA / 2) - 3 : (TAMANIO_CELDA / 2) - 5;

        // Animación pulse: oscila entre glow mínimo y máximo suavemente
        const pulse = (Math.sin(Date.now() / 600) + 1) / 2; // 0..1

        ctx.save();
        ctx.shadowBlur  = especial ? 12 + pulse * 14 : 5 + pulse * 7;
        ctx.shadowColor = fruta.colorGlow;
        ctx.fillStyle   = fruta.color;
        this._dibujarForma(ctx, cx, cy, r, fruta.forma);
        ctx.fill();
        ctx.restore();
    }

    _dibujarForma(ctx, cx, cy, r, forma) {
        switch (forma) {
            case 'circulo':
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                break;
            case 'diamante':
                ctx.beginPath();
                ctx.moveTo(cx,     cy - r);
                ctx.lineTo(cx + r, cy    );
                ctx.lineTo(cx,     cy + r);
                ctx.lineTo(cx - r, cy    );
                ctx.closePath();
                break;
            case 'estrella':
                this._formaEstrella(ctx, cx, cy, r, 5);
                break;
            case 'triangulo':
                ctx.beginPath();
                ctx.moveTo(cx,             cy - r);
                ctx.lineTo(cx + r * 0.866, cy + r * 0.5);
                ctx.lineTo(cx - r * 0.866, cy + r * 0.5);
                ctx.closePath();
                break;
            case 'corazon':
                this._formaCorazon(ctx, cx, cy, r);
                break;
        }
    }

    _formaEstrella(ctx, cx, cy, r, puntas) {
        const ri = r * 0.42;
        ctx.beginPath();
        for (let i = 0; i < puntas * 2; i++) {
            const angulo = (i * Math.PI / puntas) - Math.PI / 2;
            const radio  = i % 2 === 0 ? r : ri;
            const x = cx + radio * Math.cos(angulo);
            const y = cy + radio * Math.sin(angulo);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    _formaCorazon(ctx, cx, cy, r) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.8);
        ctx.bezierCurveTo(cx - r * 1.8, cy + r * 0.2, cx - r * 1.8, cy - r * 0.9, cx, cy - r * 0.3);
        ctx.bezierCurveTo(cx + r * 1.8, cy - r * 0.9, cx + r * 1.8, cy + r * 0.2, cx, cy + r * 0.8);
        ctx.closePath();
    }

    // ── Flash de invulnerabilidad ─────────────────────────────

    dibujarFlashInvulnerable(tick) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = `rgba(255,244,181,${0.04 + Math.sin(tick * 0.25) * 0.03})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();
    }

    // ── Overlay de pausa ──────────────────────────────────────

    dibujarPausa() {
        const ctx = this.ctx;
        const w   = this.canvas.width;
        const h   = this.canvas.height;

        ctx.save();
        ctx.fillStyle = 'rgba(10, 6, 22, 0.82)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowBlur   = 20;
        ctx.shadowColor  = 'rgba(248, 187, 217, 0.55)';
        ctx.fillStyle    = '#F8BBD9';
        ctx.font         = '700 20px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.letterSpacing = '5px';
        ctx.fillText('PAUSA', w / 2, h / 2 - 14);

        ctx.shadowBlur   = 0;
        ctx.letterSpacing = '0px';
        ctx.font         = '500 12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle    = 'rgba(255, 255, 255, 0.28)';
        ctx.fillText('Presiona P para continuar', w / 2, h / 2 + 16);
        ctx.restore();
    }

    // ── Helper: rectángulo redondeado ─────────────────────────

    _rectRedondeado(ctx, x, y, ancho, alto, radio) {
        ctx.beginPath();
        ctx.moveTo(x + radio, y);
        ctx.lineTo(x + ancho - radio, y);
        ctx.quadraticCurveTo(x + ancho, y,        x + ancho, y + radio);
        ctx.lineTo(x + ancho, y + alto - radio);
        ctx.quadraticCurveTo(x + ancho, y + alto,  x + ancho - radio, y + alto);
        ctx.lineTo(x + radio, y + alto);
        ctx.quadraticCurveTo(x,         y + alto,  x, y + alto - radio);
        ctx.lineTo(x, y + radio);
        ctx.quadraticCurveTo(x,         y,         x + radio, y);
        ctx.closePath();
    }
}
