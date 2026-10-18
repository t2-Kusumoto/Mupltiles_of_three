# ⏳ Multiples-Of-Three

[日本語版はこちら (Japanese README)](README.ja.md)

---

> # ⚠️ NOTICE: This is a casual time-killer game!
> **This game is created purely for casual "killing time" (暇つぶし)!**  
> A simple, fast-paced mental arithmetic and brain-training action puzzle you can easily play in your PC browser during spare moments.

---

## 🎮 Overview

**Multiples-Of-Three** is a puzzle game where you quickly find and eliminate "multiples of 3" from a 4×4 grid of 16 randomly displayed numbers (1 to 300).

The cell numbers and colors are reshuffled (refreshed) every 3 seconds. Spot the multiples of 3 quickly, tap to lock them, and wipe them all out at once with the "Clear" button! As you clear cells, a beautiful monthly flower illustration hidden behind them is revealed.

#### 🎨 Color Universal Design (CUD) Considerations

*External link: What is Color Universal Design (CUD)?*: [Color Universal Design Organization (CUDO)](https://cudo.jp/?page_id=74)

To ensure easy distinction for all users with diverse color vision, a color scheme based on Japanese CUD recommended palettes is adopted:
- Light Sky Blue (`#bfe4ff`)
- Cream Yellow (`#ffff80`)
- Light Pink (`#ffcabf`)
- Mint Green (`#77d9a8`)

Text is consistently styled in high-contrast dark color (`#111111`) against background colors, ensuring effortless readability for everyone.

---

## 🚀 How to Run Locally

Runs solely on HTML / CSS / JavaScript (Vanilla) with no build tools or package managers required.  
Simply double-click `index.html` inside the downloaded or cloned folder, or drag and drop it into your browser.

Or run via a local HTTP server:
```bash
# Clone the repository
git clone https://github.com/<your-username>/multiples_of_three.git
cd multiples_of_three

# Start with any local HTTP server (e.g., Python)
python3 -m http.server 8000
```

---

## 🕹️ How to Play

1. **Start the Game**: Click the "Start" button. After a 3-second countdown, the 59-second gameplay timer begins.
2. **Find Multiples of 3**: Click any multiple of 3 (e.g., 3, 12, 45, 99, 150, etc.).
   - The clicked cell enters a "locked state" and is excluded from the 3-second number refreshes.
   - *Note*: Locked cells intentionally look identical to normal cells. Rely on your memory as you play!
3. **Clear in Bulk (Clear)**: Click the "Clear" button to eliminate all locked cells at once.
   - Cleared cells become semi-transparent, revealing the illustration underneath.
4. **Victory Condition**: Clear all 16 cells within the 59-second time limit to achieve Game Clear!

---

## 🏆 Scoring Rules

### ➕ Score Additions

The numbers displayed on cleared cells are added to the SCORE.

* **Multi-Clear Bonus (Clear Button)**:
  Clearing 3 or more cells simultaneously awards an exponential bonus score (rounded to the nearest integer):
  $$\text{Added Score} = \text{round}\left( (\text{Sum of Cleared Values}) \times 1.01^{N - 2} \right)$$
  - **1 cell cleared**: $1.0\times$ (Standard: no bonus)
  - **2 cells cleared**: $1.0\times$ (Standard: no bonus)
  - **3 cells simultaneously cleared**: **$1.01\times$**
  - **4 cells simultaneously cleared**: **$1.0201\times$** ($1.01^2$)
  - **5 cells simultaneously cleared**: **approx. $1.0303\times$** ($1.01^3$)
  - *(increases further with each additional cell)*

* **Remaining Time Bonus (Time Bonus)**:
  Clearing all cells (or when the game ends by reaching the Strike limit) awards **51 points** per remaining second:
  $$\text{Time Bonus} = \text{Remaining Seconds} \times 51$$

---

### ➖ Deductions & Strikes (Mistakes) Rules

* **Clicking a non-multiple of 3**:
  - The cell's number is **deducted** from your score.
  - **Strikes (Mistakes) +1**.
* **Re-clicking an already-locked cell**:
  - The cell's number is **deducted** from your score.
  - **Strikes (Mistakes) +1**.
* **Strike Limit**:
  - Reaching **6 Mistakes (6 Strikes)** immediately results in GAME OVER (Remaining time bonus is still awarded).

---

## 📄 License

This software is released under the **[MIT License](LICENSE)**, one of the most permissive open-source licenses. You are free to modify, duplicate, and redistribute it for both commercial and non-commercial purposes.
