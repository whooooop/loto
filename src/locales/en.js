// English translations

export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    update: 'Update',
    add: 'Add',
    remove: 'Remove',
    reset: 'Reset',
    undo: 'Undo',
    start: 'Start',
    finish: 'Finish',
    winner: 'Winner',
    unknown: 'Unknown'
  },
  app: {
    title: '🎲 Loto Game',
    createNewGame: 'Create a new game to start'
  },
  game: {
    setup: 'New Game Setup',
    startBet: 'Starting Bet',
    enterAmount: 'Enter amount',
    selectPlayers: 'Select Players',
    selectAll: 'Select All',
    startGame: 'Start Game',
    gameFinished: 'Game Finished!',
    newGame: 'Start New Game',
    gameBoard: 'Game Board',
    undoLastAction: 'Undo Last Action',
    noActionsToUndo: 'No actions to undo',
    collectedTop: 'Collected Top',
    collectedMiddle: 'Collected Middle',
    collectedBottom: 'Collected Bottom',
    top: 'Top',
    middle: 'Middle',
    bottom: 'Bottom'
  },
  player: {
    management: 'Player Management',
    playerName: 'Player Name',
    initialBalance: 'Initial Balance',
    addPlayer: 'Add Player',
    balance: 'Balance',
    changeBalance: 'Change Balance',
    contributions: 'Contributions',
    noCollectedRows: 'No collected rows',
    editName: 'Edit Name',
    editNameHint: 'Double-click to edit name'
  },
  bank: {
    title: 'Game Bank',
    currentBank: 'Current Bank',
    historyTitle: 'Bank History',
    startingContributions: 'Starting Contributions',
    initialBank: 'Initial Bank',
    finalBank: 'Final Bank',
    bankChange: 'Bank Change',
    playerContributed: '{name} contributed {amount}₽',
    playerWithdrew: '{name} withdrew {amount}₽',
    playerWithdrewAll: '{name} withdrew all {amount}₽',
    collectedTopAllAdded: '{name} collected top - all added starting bet',
    collectedMiddleTookHalf: '{name} collected middle - took half of bank',
    othersAddedStartingBet: 'Others added starting bet',
    collectedBottomGameFinished: '{name} collected bottom - game finished, took entire bank'
  },
  statistics: {
    title: 'Statistics',
    currentGame: 'Current Game',
    overallStats: 'Overall Statistics',
    gameHistory: 'Game History',
    totalGames: 'Total Games',
    playerStats: 'Player Statistics',
    wins: 'Wins',
    earnings: 'Earnings',
    noCompletedGames: 'No completed games',
    startDate: 'Start Date',
    players: 'Players',
    gameDetails: 'Game Details',
    gameDate: 'Game Date'
  },
  confirm: {
    title: 'Confirmation',
    collectTop: '{name} collected top?\nAll other players will add starting bet.',
    collectMiddle: '{name} collected middle?\nPlayer will take half of bank ({amount}₽), others will add starting bet.',
    collectBottom: '{name} collected bottom?\nGame will end, player will take entire bank ({amount}₽).',
    yesCollectedTop: 'Yes, collected top',
    yesCollectedMiddle: 'Yes, collected middle',
    yesCollectedBottom: 'Yes, collected bottom'
  },
  validation: {
    playerNameRequired: 'Player name is required',
    playerNameEmpty: 'Player name cannot be empty',
    playerNameTooLong: 'Player name is too long (max 50 characters)',
    balanceRequired: 'Balance is required',
    balanceMustBeNumber: 'Balance must be a number',
    balanceOutOfRange: 'Balance is out of valid range',
    duplicatePlayerName: 'Player with this name already exists',
    startBetRequired: 'Starting bet must be greater than 0',
    startBetPositive: 'Starting bet must be a positive number',
    startBetTooLarge: 'Starting bet is too large',
    minTwoPlayers: 'At least 2 players must be selected',
    maxTenPlayers: 'Maximum 10 players in one game'
  },
  log: {
    gameStarted: 'Game started. Bet: {bet}₽, players: {count}',
    collectedTop: '{name} collected top',
    collectedMiddle: '{name} collected middle (took {amount}₽)',
    collectedBottom: '{name} collected bottom (took {amount}₽) - game finished',
    eventLog: 'Event Log',
    noEvents: 'No events'
  },
  reset: {
    fullReset: 'Full Data Reset',
    confirmReset: 'Confirm Reset',
    confirmMessage: 'Are you sure you want to delete all data?',
    warning: 'This action cannot be undone!',
    yesReset: 'Yes, reset everything'
  },
  balance: {
    title: 'Player Balances',
    noPlayers: 'No players'
  }
}

