import GameStateService from '../src/js/GameStateService';

describe('GameStateService', () => {
    let storage;
    let service;

    beforeEach(() => {
        storage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };
        service = new GameStateService(storage);
    });

    test('load should return parsed state when valid JSON', () => {
        const mockState = { currentLevel: 2, currentTurn: 'player' };
        storage.getItem.mockReturnValue(JSON.stringify(mockState));

        const result = service.load();
        expect(result).toEqual(mockState);
    });

    test('load should throw error when JSON is invalid', () => {
        storage.getItem.mockReturnValue('invalid json {');

        expect(() => service.load()).toThrow('Invalid state');
    });

    test('load should throw error when storage returns null', () => {
        storage.getItem.mockReturnValue(null);

        expect(() => service.load()).toThrow('Invalid state');
    });

    test('save should store state in localStorage', () => {
        const state = { currentLevel: 3, currentTurn: 'computer' };
        service.save(state);

        expect(storage.setItem).toHaveBeenCalledWith('state', JSON.stringify(state));
    });

    test('save should handle complex state objects', () => {
        const state = {
            currentLevel: 4,
            currentTurn: 'player',
            maxScore: 10,
            currentScore: 5,
        };
        service.save(state);

        expect(storage.setItem).toHaveBeenCalled();
        const savedArg = storage.setItem.mock.calls[0][1];
        expect(JSON.parse(savedArg)).toEqual(state);
    });
});