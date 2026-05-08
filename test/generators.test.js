import { characterGenerator, generateTeam } from '../src/js/generators';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';

describe('characterGenerator', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;

    test('should generate infinite characters', () => {
        const generator = characterGenerator(allowedTypes, maxLevel);
        const characters = [];

        for (let i = 0; i < 10; i++) {
            characters.push(generator.next().value);
        }

        expect(characters).toHaveLength(10);
        characters.forEach(char => {
            expect(allowedTypes.some(type => char instanceof type)).toBe(true);
            expect(char.level).toBeGreaterThanOrEqual(1);
            expect(char.level).toBeLessThanOrEqual(maxLevel);
        });
    });
});

describe('generateTeam', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const characterCount = 4;

    test('should generate team with correct number of characters', () => {
        const team = generateTeam(allowedTypes, maxLevel, characterCount);
        expect(team.getSize()).toBe(characterCount);
    });

    test('should generate characters within level range', () => {
        const team = generateTeam(allowedTypes, maxLevel, characterCount);
        team.getAll().forEach(char => {
            expect(char.level).toBeGreaterThanOrEqual(1);
            expect(char.level).toBeLessThanOrEqual(maxLevel);
        });
    });
});