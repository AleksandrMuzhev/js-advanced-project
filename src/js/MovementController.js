import { calculateDistance, isStraightLine, getLineCells } from './utils';

export default class MovementController {
    constructor(boardSize = 8) {
        this.boardSize = boardSize;
    }

    // Получение максимальной дистанции движения для типа персонажа
    getMoveDistance(characterType) {
        const moveDistances = {
            swordsman: 4,
            undead: 4,
            bowman: 2,
            vampire: 2,
            magician: 1,
            daemon: 1,
        };
        return moveDistances[characterType] || 0;
    }

    // Получение максимальной дистанции атаки для типа персонажа
    getAttackDistance(characterType) {
        const attackDistances = {
            swordsman: 1,
            undead: 1,
            bowman: 2,
            vampire: 2,
            magician: 4,
            daemon: 4,
        };
        return attackDistances[characterType] || 0;
    }

    // Проверка, может ли персонаж атаковать цель
    canAttack(attacker, target, attackerPos, targetPos, allPositions) {
        const distance = calculateDistance(attackerPos, targetPos, this.boardSize);
        const attackDistance = this.getAttackDistance(attacker.type);

        if (distance > attackDistance) return false;
        if (!isStraightLine(attackerPos, targetPos, this.boardSize)) return false;

        // Проверяем, нет ли препятствий на линии атаки
        const cellsBetween = getLineCells(attackerPos, targetPos, this.boardSize);
        for (const cell of cellsBetween) {
            if (allPositions.some(pos => pos.position === cell)) {
                return false; // Есть препятствие
            }
        }

        return true;
    }

    // Проверка, может ли персонаж переместиться на указанную клетку
    canMove(character, fromPos, toPos, allPositions) {
        const distance = calculateDistance(fromPos, toPos, this.boardSize);
        const moveDistance = this.getMoveDistance(character.type);

        if (distance > moveDistance) return false;
        if (!isStraightLine(fromPos, toPos, this.boardSize)) return false;

        // Проверяем, свободна ли целевая клетка
        if (allPositions.some(pos => pos.position === toPos)) return false;

        // Проверяем, нет ли препятствий на пути
        const cellsBetween = getLineCells(fromPos, toPos, this.boardSize);
        for (const cell of cellsBetween) {
            if (allPositions.some(pos => pos.position === cell)) {
                return false; // Есть препятствие
            }
        }

        return true;
    }

    // Получение всех возможных клеток для движения
    getAvailableMoveCells(character, fromPos, allPositions) {
        const availableCells = [];

        for (let i = 0; i < this.boardSize ** 2; i++) {
            if (this.canMove(character, fromPos, i, allPositions)) {
                availableCells.push(i);
            }
        }

        return availableCells;
    }

    // Получение всех возможных целей для атаки
    getAvailableAttackTargets(attacker, attackerPos, allPositions, isPlayerAttacking) {
        const targets = [];

        for (const target of allPositions) {
            // Проверяем, что цель принадлежит противнику
            const isTargetPlayer = this.isPlayerCharacter(target.character);
            if (isTargetPlayer === isPlayerAttacking) continue;

            if (this.canAttack(attacker, target.character, attackerPos, target.position, allPositions)) {
                targets.push(target);
            }
        }

        return targets;
    }

    isPlayerCharacter(character) {
        const playerTypes = ['bowman', 'swordsman', 'magician'];
        return playerTypes.includes(character.type);
    }
}