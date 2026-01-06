# Loto Game

A Vue.js application for playing Loto with player management, balance tracking, and statistics.

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

## Building

```bash
npm run build
```

## Game Rules

1. **Game Start**: All participants contribute a starting amount to the bank
2. **Top (first row)**: All players add the starting amount, except the one who collected the top
3. **Middle (second row)**: The collector takes half of the bank, all others add the starting amount
4. **Bottom (third row)**: The game ends, the collector takes the entire bank

## Features

- Player and balance management
- Game creation and tracking
- Automatic loto card generation
- Manual input of drawn numbers
- Game statistics
- Data persistence in localStorage
- Internationalization (English/Russian)
- Detailed bank history tracking
- Game history with detailed information
