import Character from '../src/js/Character';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Daemon from '../src/js/characters/Daemon';
import Undead from '../src/js/characters/Undead';
import Vampire from '../src/js/characters/Vampire';

describe('Character class', () => {
    test('should throw error when instantiating directly', () => {
        expect(() => new Character(1)).toThrow('Cannot instantiate Character directly');
    });

    test('should not throw error when instantiating subclass', () => {
        expect(() => new Bowman(1)).not.toThrow();
    });
});

describe('Character classes', () => {
    test('Bowman level 1 has correct stats', () => {
        const bowman = new Bowman(1);
        expect(bowman.level).toBe(1);
        expect(bowman.attack).toBe(25);
        expect(bowman.defence).toBe(25);
        expect(bowman.health).toBe(50);
        expect(bowman.type).toBe('bowman');
    });

    test('Swordsman level 1 has correct stats', () => {
        const swordsman = new Swordsman(1);
        expect(swordsman.attack).toBe(40);
        expect(swordsman.defence).toBe(10);
    });

    test('Magician level 1 has correct stats', () => {
        const magician = new Magician(1);
        expect(magician.attack).toBe(10);
        expect(magician.defence).toBe(40);
    });

    test('Daemon level 1 has correct stats', () => {
        const daemon = new Daemon(1);
        expect(daemon.attack).toBe(10);
        expect(daemon.defence).toBe(10);
    });

    test('Undead level 1 has correct stats', () => {
        const undead = new Undead(1);
        expect(undead.attack).toBe(40);
        expect(undead.defence).toBe(10);
    });

    test('Vampire level 1 has correct stats', () => {
        const vampire = new Vampire(1);
        expect(vampire.attack).toBe(25);
        expect(vampire.defence).toBe(25);
    });
});