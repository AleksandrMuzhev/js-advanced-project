import MovementController from '../src/js/MovementController';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Vampire from '../src/js/characters/Vampire';
import PositionedCharacter from '../src/js/PositionedCharacter';

describe('MovementController', () => {
    let movementController;
    let bowman;
    let swordsman;
    let vampire;

    beforeEach(() => {
        movementController = new MovementController(8);
        bowman = new Bowman(1);
        swordsman = new Swordsman(1);
        vampire = new Vampire(1);
    });

    test('Bowman should have move distance 2', () => {
        expect(movementController.getMoveDistance('bowman')).toBe(2);
    });

    test('Swordsman should have move distance 4', () => {
        expect(movementController.getMoveDistance('swordsman')).toBe(4);
    });

    test('Bowman should have attack distance 2', () => {
        expect(movementController.getAttackDistance('bowman')).toBe(2);
    });

    test('Swordsman should have attack distance 1', () => {
        expect(movementController.getAttackDistance('swordsman')).toBe(1);
    });

    test('canMove should return true for valid move', () => {
        const fromPos = 27; // центр поля
        const toPos = 29; // на 2 клетки правее
        const allPositions = [];

        expect(movementController.canMove(bowman, fromPos, toPos, allPositions)).toBe(true);
    });

    test('canMove should return false for move too far', () => {
        const fromPos = 27;
        const toPos = 35; // на 8 клеток правее
        const allPositions = [];

        expect(movementController.canMove(bowman, fromPos, toPos, allPositions)).toBe(false);
    });

    test('canMove should return false if target cell is occupied', () => {
        const fromPos = 27;
        const toPos = 28;
        const occupiedCharacter = new PositionedCharacter(vampire, toPos);
        const allPositions = [occupiedCharacter];

        expect(movementController.canMove(bowman, fromPos, toPos, allPositions)).toBe(false);
    });

    test('canAttack should return true for valid attack', () => {
        const attackerPos = 27;
        const targetPos = 28;
        const attacker = bowman;
        const target = vampire;
        const allPositions = [];

        expect(movementController.canAttack(attacker, target, attackerPos, targetPos, allPositions)).toBe(true);
    });

    test('canAttack should return false for attack too far', () => {
        const attackerPos = 27;
        const targetPos = 30; // 3 клетки от лучника
        const attacker = bowman;
        const target = vampire;
        const allPositions = [];

        expect(movementController.canAttack(attacker, target, attackerPos, targetPos, allPositions)).toBe(false);
    });
});