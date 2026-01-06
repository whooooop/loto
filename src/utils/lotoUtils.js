// Loto game utilities

// Generate a random loto card (3 rows, 5 numbers each)
// Numbers range from 1 to 90
export function generateLotoCard() {
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1)
  const shuffled = [...allNumbers].sort(() => Math.random() - 0.5)
  
  const card = []
  for (let row = 0; row < 3; row++) {
    const rowNumbers = shuffled.slice(row * 5, (row + 1) * 5).sort((a, b) => a - b)
    card.push(rowNumbers)
  }
  
  return card
}

// Check if a row is collected (all numbers in the row are in drawnNumbers)
export function isRowCollected(row, drawnNumbers) {
  return row.every(num => drawnNumbers.includes(num))
}

// Check which rows are collected
export function getCollectedRows(card, drawnNumbers) {
  const collected = []
  if (isRowCollected(card[0], drawnNumbers)) {
    collected.push('top')
  }
  if (isRowCollected(card[1], drawnNumbers)) {
    collected.push('middle')
  }
  if (isRowCollected(card[2], drawnNumbers)) {
    collected.push('bottom')
  }
  return collected
}

// Validate if a number is valid (1-90)
export function isValidNumber(number) {
  const num = parseInt(number)
  return !isNaN(num) && num >= 1 && num <= 90
}

// Format number for display
export function formatNumber(number) {
  return number.toString().padStart(2, '0')
}



