# 🐍 Snake

**Snake Pastel Edition** es una reinterpretación moderna del clásico juego Snake, desarrollada con **HTML5, CSS3 y JavaScript Vanilla**, utilizando la **Canvas API** para el renderizado del tablero.

El proyecto combina la mecánica tradicional del juego con una estética **dark + glassmorphism** y una paleta de colores pastel, incorporando efectos especiales, sistema de niveles, combos y frutas con habilidades únicas para ofrecer una experiencia más dinámica.

---

## ✨ Características

* 🎮 Jugabilidad clásica de Snake.
* 🍓 Frutas normales con diferentes puntajes.
* ⭐ Frutas especiales con efectos temporales:

  * **Invulnerabilidad** (atraviesa paredes y evita colisiones con el cuerpo).
  * **Turbo** (incrementa la velocidad).
  * **Calma** (reduce la velocidad temporalmente).
  * **Bonus** (otorga una gran cantidad de puntos).
* 🔥 Sistema de combos al comer varias frutas consecutivas.
* 📈 Niveles progresivos.
* ⚡ Incremento gradual de dificultad mediante aumento de velocidad.
* 🏆 Guardado automático del récord utilizando **LocalStorage**.
* ⏸ Sistema de pausa.
* 📱 Controles táctiles mediante gestos (swipe) para dispositivos móviles.
* 🎨 Interfaz moderna con diseño responsive.

---

## 🛠 Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript (ES6)
* Canvas API
* LocalStorage

---

## 📂 Estructura del proyecto

```text
Snake Pastel Edition
│
├── index.html
│
├── css/
│   └── style.css
│
└── js/
    ├── game.js
    ├── snake.js
    ├── food.js
    ├── renderer.js
    ├── input.js
    ├── ui.js
    └── utils.js
```

---

## 📄 Descripción de los módulos

### game.js

Contiene el núcleo del juego. Administra los estados (menú, partida, pausa y game over), el ciclo principal, el puntaje, los niveles, la velocidad y la interacción entre todos los componentes.

### snake.js

Implementa toda la lógica de la serpiente:

* Movimiento.
* Crecimiento.
* Colisiones.
* Dirección.
* Efectos especiales.

### food.js

Gestiona la generación de frutas normales y especiales, evitando superposiciones y controlando su aparición y desaparición.

### renderer.js

Responsable del dibujo completo utilizando Canvas:

* Tablero.
* Serpiente.
* Frutas.
* Sombras.
* Glow.
* Animaciones.
* Pantalla de pausa.

### input.js

Administra todas las entradas del usuario:

* Teclado.
* Flechas.
* Pausa.
* Confirmaciones.
* Gestos táctiles para dispositivos móviles.

### ui.js

Actualiza toda la interfaz HTML:

* HUD.
* Puntaje.
* Nivel.
* Combo.
* Récord.
* Menú inicial.
* Pantalla de Game Over.
* Indicadores de efectos especiales.

### utils.js

Contiene funciones auxiliares reutilizables para generación de números aleatorios, comparación de posiciones, formateo de puntajes y otras operaciones comunes.

---

## 🎮 Controles

### Computadora

| Tecla     | Acción                          |
| --------- | ------------------------------- |
| ⬆ ⬇ ⬅ ➡   | Mover la serpiente              |
| **P**     | Pausar/Reanudar                 |
| **Enter** | Confirmar (iniciar o reiniciar) |
| **Esc**   | Pausar                          |

### Dispositivos móviles

* Deslizar hacia arriba.
* Deslizar hacia abajo.
* Deslizar hacia la izquierda.
* Deslizar hacia la derecha.

---

## 🍓 Sistema de frutas

### Frutas normales

Aparecen continuamente durante la partida y otorgan diferentes cantidades de puntos.

### Frutas especiales

Poseen una probabilidad de aparición y desaparecen automáticamente si no son recogidas.

| Fruta       | Efecto                            |
| ----------- | --------------------------------- |
| ⭐ Estrella  | Invulnerabilidad                  |
| ⚡ Triángulo | Turbo                             |
| 💎 Diamante | Bonus de puntos                   |
| ❤️ Corazón  | Reduce temporalmente la velocidad |

---

## 🏆 Sistema de puntuación

El puntaje aumenta según:

* Valor base de la fruta.
* Multiplicador del combo.
* Bonus por frutas especiales.

El récord máximo queda almacenado automáticamente en el navegador utilizando **LocalStorage**.

---

## 📈 Progresión

La dificultad aumenta progresivamente mediante:

* Incremento de velocidad.
* Sistema de niveles.
* Aparición aleatoria de frutas especiales.
* Sistema de combos.

---


## 🚀 Cómo ejecutar el proyecto

1. Clonar el repositorio.

```bash
git clone https://github.com/daiuuu/snake-pastel-edition.git
```

2. Ingresar al proyecto.

```bash
cd snake-pastel-edition
```

3. Abrir el archivo **index.html** en cualquier navegador moderno.

No requiere instalación de dependencias ni servidores externos.

---

## 📌 Objetivos del proyecto

* Practicar programación orientada a objetos en JavaScript.
* Aplicar renderizado con Canvas API.
* Implementar un bucle de juego (Game Loop).
* Organizar el código de manera modular.
* Desarrollar una interfaz moderna utilizando HTML y CSS.
* Mejorar la experiencia de usuario mediante animaciones, efectos visuales y diseño responsive.

---

## 👩‍💻 Autora

**Daiana Soria Piola**
