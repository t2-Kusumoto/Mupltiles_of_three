# ⏳ Multiples-Of-Three

[🇯🇵 日本語版ドキュメントはこちら (Japanese README)](README.ja.md)

---

> # ⚠️ NOTICE: CASUAL TIME-KILLER GAME (暇つぶし用)
> **THIS GAME IS INTENDED PURELY FOR KILLING TIME / CASUAL FUN!**  
> A simple, fast-paced mental arithmetic and memory action puzzle designed for short breaks and quick brain exercises on any browser or smartphone.

---

## 🎮 Overview

**Multiples-Of-Three** is an action puzzle game where you find and clear multiples of 3 from a 4×4 grid of random numbers (1 to 300) before time runs out.

As cells refresh their numbers and colors every 3 seconds, you must spot multiples of 3, lock them in, and press the **Clear** button to eliminate them and reveal the seasonal flower hidden beneath!

---

## 🕹️ How to Play

1. **Start the Game**: Tap the **Start** button. A 3-second countdown will start, and the 59-second gameplay timer will begin.
2. **Find Multiples of 3**: Tap any cell containing a multiple of 3 (e.g., 3, 12, 45, 99, 150).
   - The cell becomes **Locked** (its value will NOT change during the 3-second cycle).
   - *Note*: Locked cells intentionally look the same as active cells, testing your memory!
3. **Clear Locked Cells**: Tap the **Clear** button to wipe out all locked cells at once.
   - Cleared cells become semi-transparent, uncovering the background illustration.
4. **Win Condition**: Clear all 16 cells before the 59-second timer expires.

---

## 🏆 Scoring & Rules

### ➕ Score Additions

* **Multi-Clear Bonus (Clear Button)**:
  Clearing 3 or more locked cells simultaneously earns an exponential bonus:
  $$\text{Added Score} = \text{round}\left( (\text{Sum of Cleared Values}) \times 1.01^{N - 2} \right)$$
  - **1 cell cleared**: $1.0\times$ (Sum of cell value)
  - **2 cells cleared**: $1.0\times$ (Sum of cell values)
  - **3 cells cleared**: **$1.01\times$** bonus
  - **4 cells cleared**: **$1.0201\times$** bonus ($1.01^2$)
  - **5 cells cleared**: **$1.0303\times$** bonus ($1.01^3$)
  - *(and so forth for higher combos)*

* **Time Bonus**:
  If you clear all 16 cells (or reach the strike limit) before time runs out, remaining seconds are multiplied by **51** and added to your score:
  $$\text{Time Bonus} = \text{Remaining Seconds} \times 51$$

---

### ➖ Penalties & Strikes

* **Non-Multiple of 3**: Tapping a number that is NOT a multiple of 3:
  - Subtracts that number from your score.
  - Adds **+1 Strike**.
* **Tapping Already-Locked Cells**: Tapping a cell that you already locked:
  - Subtracts that number from your score.
  - Adds **+1 Strike**.
* **Strike Limit**: Reaching **6 Strikes** immediately triggers **GAME OVER** (Remaining time bonus is still awarded).

---

## 🎨 Color Universal Design (CUD)

This game adheres to **Color Universal Design (CUD)** principles:
- High-contrast, colorblind-friendly palette recommended by Japanese CUD guidelines:
  - Light Sky Blue (`#bfe4ff`)
  - Cream Yellow (`#ffff80`)
  - Light Pink (`#ffcabf`)
  - Mint Green (`#77d9a8`)
- High-contrast text colors and distinct tactile button designs ensure complete accessibility for all color vision types.

---

## 🚀 How to Run Locally

No build tools or package managers required! Just static HTML, CSS, and vanilla JavaScript.

```bash
# Clone the repository
git clone https://github.com/<your-username>/multiples_of_three.git
cd multiples_of_three

# Run with any static HTTP server (Python example)
python3 -m http.server 8000
```

Open your browser and navigate to `http://localhost:8000/`.

---

## 📄 License

This project is released under the **[MIT License](LICENSE)** — one of the most permissive and free open source licenses. Feel free to use, modify, distribute, and enjoy!
