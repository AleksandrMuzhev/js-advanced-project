import themes from './themes';
import cursors from './cursors';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import MovementController from './MovementController';
import CombatController from './CombatController';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = null;
    this.computerTeam = null;
    this.playerPositions = [];
    this.computerPositions = [];
    this.allPositions = [];
    this.currentLevel = 1;
    this.currentTurn = 'player';
    this.selectedCharacter = null;
    this.movementController = new MovementController(8);
    this.availableMoves = [];
    this.availableAttacks = [];
    this.maxScore = 0;
    this.currentScore = 0;

    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  saveGame() {
    const gameState = new GameState();
    gameState.currentLevel = this.currentLevel;
    gameState.currentTurn = this.currentTurn;
    gameState.playerTeam = this.playerTeam;
    gameState.computerTeam = this.computerTeam;
    gameState.playerPositions = this.playerPositions;
    gameState.computerPositions = this.computerPositions;
    gameState.maxScore = this.maxScore;
    gameState.currentScore = this.currentScore;

    this.stateService.save(gameState);
    this.gamePlay.showMessage('Game saved successfully!');
  }

  async loadGame() {
    try {
      const savedState = this.stateService.load();
      if (!savedState) {
        this.gamePlay.showError('No saved game found!');
        return;
      }

      this.currentLevel = savedState.currentLevel;
      this.currentTurn = savedState.currentTurn;
      this.maxScore = savedState.maxScore || 0;
      this.currentScore = savedState.currentScore || 0;

      // Восстанавливаем команды
      this.playerTeam = this.restoreTeam(savedState.playerTeam);
      this.computerTeam = this.restoreTeam(savedState.computerTeam);

      // Восстанавливаем позиции
      this.playerPositions = this.restorePositions(savedState.playerPositions);
      this.computerPositions = this.restorePositions(savedState.computerPositions);
      this.allPositions = [...this.playerPositions, ...this.computerPositions];

      // Применяем тему уровня
      const theme = this.getThemeByLevel(this.currentLevel);
      this.gamePlay.drawUi(theme);
      this.redrawPositions();

      this.selectedCharacter = null;
      this.availableMoves = [];
      this.availableAttacks = [];

      this.gamePlay.showMessage('Game loaded successfully!');
    } catch (e) {
      this.gamePlay.showError('Failed to load game: ' + e.message);
    }
  }

  // Восстановление команды из сохранения
  restoreTeam(savedTeam) {
    const characterClasses = {
      bowman: Bowman,
      swordsman: Swordsman,
      magician: Magician,
      vampire: Vampire,
      undead: Undead,
      daemon: Daemon,
    };

    if (!savedTeam || !savedTeam.characters) {
      return null;
    }

    const characters = savedTeam.characters.map(savedChar => {
      const CharacterClass = characterClasses[savedChar.type];
      if (!CharacterClass) return null;

      const character = new CharacterClass(1); // Создаем с уровнем 1
      character.level = savedChar.level;
      character.attack = savedChar.attack;
      character.defence = savedChar.defence;
      character.health = savedChar.health;
      character.type = savedChar.type;

      return character;
    }).filter(char => char !== null);

    const Team = require('./Team').default;
    return new Team(characters);
  }

  // Восстановление позиций из сохранения
  restorePositions(savedPositions) {
    const characterClasses = {
      bowman: Bowman,
      swordsman: Swordsman,
      magician: Magician,
      vampire: Vampire,
      undead: Undead,
      daemon: Daemon,
    };

    if (!savedPositions) return [];

    return savedPositions.map(savedPos => {
      const CharacterClass = characterClasses[savedPos.character.type];
      if (!CharacterClass) return null;

      const character = new CharacterClass(1);
      character.level = savedPos.character.level;
      character.attack = savedPos.character.attack;
      character.defence = savedPos.character.defence;
      character.health = savedPos.character.health;
      character.type = savedPos.character.type;

      const PositionedCharacter = require('./PositionedCharacter').default;
      return new PositionedCharacter(character, savedPos.position);
    }).filter(pos => pos !== null);
  }

  init() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.startNewGame();
  }

  startNewGame() {
    this.currentLevel = 1;
    this.currentTurn = 'player';
    this.selectedCharacter = null;
    this.availableMoves = [];
    this.availableAttacks = [];
    this.currentScore = 0;
    this.maxScore = 0;

    // Очищаем подсветку, если есть
    if (this.gamePlay && this.gamePlay.cells) {
      for (let i = 0; i < this.gamePlay.cells.length; i++) {
        this.gamePlay.deselectCell(i);
      }
    }

    this.initLevel();
  }

  initLevel() {
    const theme = this.getThemeByLevel(this.currentLevel);
    this.gamePlay.drawUi(theme);

    this.generateTeams();
    this.placeCharacters();
    this.redrawPositions();
  }

  getThemeByLevel(level) {
    const themeMap = {
      1: themes.prairie,
      2: themes.desert,
      3: themes.arctic,
      4: themes.mountain,
    };
    return themeMap[level] || themes.mountain;
  }

  generateTeams() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const computerTypes = [Vampire, Undead, Daemon];

    this.playerTeam = generateTeam(playerTypes, this.currentLevel, 3);
    this.computerTeam = generateTeam(computerTypes, this.currentLevel, 3);
  }

  placeCharacters() {
    this.playerPositions = [];
    this.computerPositions = [];

    // Player positions: columns 0-1 (first two columns)
    const playerPositionsIndices = [0, 1, 8, 9, 16, 17];
    // Computer positions: columns 6-7 (last two columns)
    const computerPositionsIndices = [6, 7, 14, 15, 22, 23];

    const playerChars = this.playerTeam.getAll();
    const computerChars = this.computerTeam.getAll();

    for (let i = 0; i < playerChars.length; i++) {
      this.playerPositions.push(new PositionedCharacter(playerChars[i], playerPositionsIndices[i]));
    }

    for (let i = 0; i < computerChars.length; i++) {
      this.computerPositions.push(new PositionedCharacter(computerChars[i], computerPositionsIndices[i]));
    }

    this.allPositions = [...this.playerPositions, ...this.computerPositions];
  }

  redrawPositions() {
    this.gamePlay.redrawPositions(this.allPositions);
  }

  async onCellClick(index) {
    if (this.currentTurn === 'computer') {
      this.gamePlay.showError("It's computer's turn!");
      return;
    }

    const character = this.getCharacterByPosition(index);

    // Выбор персонажа
    if (character && this.isPlayerCharacter(character.character)) {
      this.selectCharacter(character);
      return;
    }

    // Перемещение или атака
    if (this.selectedCharacter) {
      // Проверяем, является ли цель атакой
      const targetCharacter = this.getCharacterByPosition(index);

      if (targetCharacter && !this.isPlayerCharacter(targetCharacter.character)) {
        // Атака
        await this.performAttack(this.selectedCharacter, targetCharacter, index);
      } else if (this.availableMoves.includes(index)) {
        // Перемещение
        await this.performMove(this.selectedCharacter, index);
      } else {
        this.gamePlay.showError("Invalid action!");
      }
    }
  }

  selectCharacter(character) {
    // Снимаем выделение с предыдущего
    if (this.selectedCharacter) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      // Очищаем подсветку доступных ходов
      this.clearHighlights();
    }

    this.selectedCharacter = character;
    this.gamePlay.selectCell(character.position, 'yellow');


    // Обновляем доступные действия
    this.availableMoves = this.movementController.getAvailableMoveCells(
      character.character,
      character.position,
      this.allPositions
    );

    // Подсвечиваем доступные клетки для хода
    this.highlightAvailableCells(this.availableMoves, 'green');

    this.availableAttacks = this.movementController.getAvailableAttackTargets(
      character.character,
      character.position,
      this.allPositions,
      true
    );

    // Подсвечиваем доступные цели для атаки
    this.highlightAvailableAttackTargets(this.availableAttacks, 'red');
  }

  highlightAvailableCells(cells, color) {
    cells.forEach(cell => {
      this.gamePlay.selectCell(cell, color);
    });
  }

  highlightAvailableAttackTargets(targets, color) {
    targets.forEach(target => {
      this.gamePlay.selectCell(target.position, color);
    });
  }

  clearAvailableCellsHighlight() {
    // Снимаем подсветку с клеток для хода
    if (this.availableMoves) {
      this.availableMoves.forEach(cell => {
        this.gamePlay.deselectCell(cell);
      });
    }

    // Снимаем подсветку с целей для атаки
    if (this.availableAttacks) {
      this.availableAttacks.forEach(attack => {
        this.gamePlay.deselectCell(attack.position);
      });
    }
  }

  clearHighlights() {
    this.clearAvailableCellsHighlight();
  }

  async performMove(character, newPosition) {
    // Обновляем позицию персонажа
    character.position = newPosition;

    // Обновляем allPositions
    this.allPositions = [
      ...this.playerPositions,
      ...this.computerPositions
    ];

    this.redrawPositions();

    // Снимаем выделение
    this.gamePlay.deselectCell(this.selectedCharacter.position);
    this.clearHighlights();
    this.selectedCharacter = null;
    this.availableMoves = [];
    this.availableAttacks = [];

    // Передаем ход компьютеру
    this.currentTurn = 'computer';
    setTimeout(() => this.computerTurn(), 500);
  }

  async performAttack(attacker, target, targetIndex) {
    // Проверяем, может ли атаковать
    const canAttack = this.movementController.canAttack(
      attacker.character,
      target.character,
      attacker.position,
      target.position,
      this.allPositions
    );

    if (!canAttack) {
      this.gamePlay.showError("Cannot attack this target!");
      return;
    }

    // Рассчитываем урон
    const damage = CombatController.calculateDamage(attacker.character, target.character);
    CombatController.applyDamage(target.character, damage);

    // Показываем анимацию урона
    await this.gamePlay.showDamage(target.position, damage);

    // Проверяем, умер ли персонаж
    if (!CombatController.isAlive(target.character)) {
      this.removeCharacter(target);
    }

    this.redrawPositions();

    // Снимаем выделение
    this.gamePlay.deselectCell(attacker.position);
    this.clearHighlights();
    this.selectedCharacter = null;
    this.availableMoves = [];
    this.availableAttacks = [];

    // Проверяем, не закончилась ли игра
    if (this.checkGameOver()) {
      return;
    }

    // Передаем ход компьютеру
    this.currentTurn = 'computer';
    setTimeout(() => this.computerTurn(), 500);
  }

  removeCharacter(character) {
    // Удаляем из соответствующей команды
    const playerIndex = this.playerPositions.findIndex(pos => pos === character);
    if (playerIndex !== -1) {
      this.playerPositions.splice(playerIndex, 1);
      this.playerTeam.removeCharacter(character.character);
    }

    const computerIndex = this.computerPositions.findIndex(pos => pos === character);
    if (computerIndex !== -1) {
      this.computerPositions.splice(computerIndex, 1);
      this.computerTeam.removeCharacter(character.character);
    }

    // Обновляем allPositions
    this.allPositions = [
      ...this.playerPositions,
      ...this.computerPositions
    ];
  }

  async computerTurn() {
    if (this.currentTurn !== 'computer') return;

    // Улучшенная стратегия: атакуем самого слабого игрока
    let bestTarget = null;
    let bestDamage = 0;
    let bestAttacker = null;

    for (const computerChar of this.computerPositions) {
      const availableAttacks = this.movementController.getAvailableAttackTargets(
        computerChar.character,
        computerChar.position,
        this.allPositions,
        false
      );

      for (const target of availableAttacks) {
        const damage = CombatController.calculateDamage(computerChar.character, target.character);
        if (damage > bestDamage) {
          bestDamage = damage;
          bestTarget = target;
          bestAttacker = computerChar;
        }
      }
    }

    if (bestTarget && bestAttacker) {
      const damage = CombatController.calculateDamage(bestAttacker.character, bestTarget.character);
      CombatController.applyDamage(bestTarget.character, damage);

      await this.gamePlay.showDamage(bestTarget.position, damage);

      if (!CombatController.isAlive(bestTarget.character)) {
        this.removeCharacter(bestTarget);
      }

      this.redrawPositions();
    }

    this.currentTurn = 'player';
    this.selectedCharacter = null;
  }

  checkGameOver() {
    if (this.playerPositions.length === 0) {
      this.gamePlay.showMessage(`Game Over! Your score: ${this.currentScore} | Max score: ${this.maxScore}`);
      this.currentTurn = 'gameover';
      this.gamePlay.setCursor(cursors.auto);
      return true;
    }

    if (this.computerPositions.length === 0) {
      this.nextLevel();
      return true;
    }

    return false;
  }

  nextLevel() {
    if (this.currentLevel >= 4) {
      this.gamePlay.showMessage(`Congratulations! You won the game! Score: ${this.currentScore}`);
      this.currentTurn = 'gameover';
      this.gamePlay.setCursor(cursors.auto);
      return;
    }

    this.currentLevel++;
    this.currentScore++;
    if (this.currentScore > this.maxScore) {
      this.maxScore = this.currentScore;
    }

    // Повышаем уровень выжившим персонажам
    for (const playerPos of this.playerPositions) {
      try {
        playerPos.character.levelUp();
      } catch (e) {
        // Персонаж мертв, пропускаем
      }
    }

    this.initLevel();
    this.currentTurn = 'player';
    this.selectedCharacter = null;
    this.availableMoves = [];
    this.availableAttacks = [];

    // Очищаем подсветку
    this.clearHighlights();
  }

  onCellEnter(index) {
    const character = this.getCharacterByPosition(index);

    if (character) {
      const info = this.getCharacterInfo(character.character);
      this.gamePlay.showCellTooltip(info, index);

      // Меняем курсор в зависимости от ситуации
      if (this.selectedCharacter) {
        if (this.availableAttacks.some(attack => attack.position === index)) {
          this.gamePlay.setCursor(cursors.crosshair);
        } else if (this.availableMoves.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (character && !this.isPlayerCharacter(character.character)) {
          this.gamePlay.setCursor(cursors.notallowed);
        } else {
          this.gamePlay.setCursor(cursors.pointer);
        }
      } else {
        if (this.isPlayerCharacter(character.character) && this.currentTurn === 'player') {
          this.gamePlay.setCursor(cursors.pointer);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    } else {
      this.gamePlay.hideCellTooltip(index);

      if (this.selectedCharacter && this.availableMoves.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  getCharacterByPosition(position) {
    return this.allPositions.find(pos => pos.position === position);
  }

  isPlayerCharacter(character) {
    const playerTypes = ['bowman', 'swordsman', 'magician'];
    return playerTypes.includes(character.type);
  }

  getCharacterInfo(character) {
    return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  }
}