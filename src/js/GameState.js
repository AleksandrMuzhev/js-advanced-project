export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.currentTurn = 'player';
    this.playerTeam = null;
    this.computerTeam = null;
    this.playerPositions = [];
    this.computerPositions = [];
    this.maxScore = 0;
    this.currentScore = 0;
  }

  static from(object) {
    const state = new GameState();
    state.currentLevel = object.currentLevel || 1;
    state.currentTurn = object.currentTurn || 'player';
    state.playerTeam = object.playerTeam;
    state.computerTeam = object.computerTeam;
    state.playerPositions = object.playerPositions || [];
    state.computerPositions = object.computerPositions || [];
    state.maxScore = object.maxScore || 0;
    state.currentScore = object.currentScore || 0;
    return state;
  }

  toJSON() {
    return {
      currentLevel: this.currentLevel,
      currentTurn: this.currentTurn,
      playerTeam: this.serializeTeam(this.playerTeam),
      computerTeam: this.serializeTeam(this.computerTeam),
      playerPositions: this.serializePositions(this.playerPositions),
      computerPositions: this.serializePositions(this.computerPositions),
      maxScore: this.maxScore,
      currentScore: this.currentScore,
    };
  }

  serializeTeam(team) {
    if (!team || !team.getAll) return { characters: [] };
    return {
      characters: team.getAll().map(char => ({
        type: char.type,
        level: char.level,
        attack: char.attack,
        defence: char.defence,
        health: char.health,
      })),
    };
  }

  serializePositions(positions) {
    return positions.map(pos => ({
      character: {
        type: pos.character.type,
        level: pos.character.level,
        attack: pos.character.attack,
        defence: pos.character.defence,
        health: pos.character.health,
      },
      position: pos.position,
    }));
  }

  updateScore() {
    this.currentScore++;
    if (this.currentScore > this.maxScore) {
      this.maxScore = this.currentScore;
    }
  }
}