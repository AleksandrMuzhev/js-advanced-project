import { calcTileType } from '../src/js/utils';

describe('calcTileType', () => {
    const boardSize = 8;

    test('should return "top-left" for index 0', () => {
        expect(calcTileType(0, boardSize)).toBe('top-left');
    });

    test('should return "top-right" for index 7', () => {
        expect(calcTileType(7, boardSize)).toBe('top-right');
    });

    test('should return "bottom-left" for index 56', () => {
        expect(calcTileType(56, boardSize)).toBe('bottom-left');
    });

    test('should return "bottom-right" for index 63', () => {
        expect(calcTileType(63, boardSize)).toBe('bottom-right');
    });

    test('should return "top" for index 3', () => {
        expect(calcTileType(3, boardSize)).toBe('top');
    });

    test('should return "bottom" for index 59', () => {
        expect(calcTileType(59, boardSize)).toBe('bottom');
    });

    test('should return "left" for index 8', () => {
        expect(calcTileType(8, boardSize)).toBe('left');
    });

    test('should return "right" for index 15', () => {
        expect(calcTileType(15, boardSize)).toBe('right');
    });

    test('should return "center" for index 27', () => {
        expect(calcTileType(27, boardSize)).toBe('center');
    });
});