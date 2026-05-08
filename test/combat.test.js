import CombatController from '../src/js/CombatController';
import Bowman from '../src/js/characters/Bowman';
import Vampire from '../src/js/characters/Vampire';

describe('CombatController', () => {
    test('calculateDamage should return correct damage', () => {
        const attacker = new Bowman(1);
        const target = new Vampire(1);

        const damage = CombatController.calculateDamage(attacker, target);
        // Bowman attack = 25, Vampire defence = 25, damage = max(0, 25*0.1) = 2.5 -> 2
        expect(damage).toBe(2);
    });

    test('applyDamage should reduce health', () => {
        const target = new Vampire(1);
        const initialHealth = target.health;

        CombatController.applyDamage(target, 10);
        expect(target.health).toBe(initialHealth - 10);
    });

    test('applyDamage should not reduce health below 0', () => {
        const target = new Vampire(1);

        CombatController.applyDamage(target, 100);
        expect(target.health).toBe(0);
    });

    test('isAlive should return true for living character', () => {
        const character = new Bowman(1);
        expect(CombatController.isAlive(character)).toBe(true);
    });

    test('isAlive should return false for dead character', () => {
        const character = new Bowman(1);
        character.health = 0;
        expect(CombatController.isAlive(character)).toBe(false);
    });
});