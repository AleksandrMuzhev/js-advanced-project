import GameStateService from '../src/js/GameStateService';
import GamePlay from '../src/js/GamePlay';

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

    test('load should return parsed state when valid', () => {
        const mockState = { currentLevel: 2 };
        storage.getItem.mockReturnValue(JSON.stringify(mockState));

        const result = service.load();
        expect(result).toEqual(mockState);
    });

    test('load should throw error when invalid', () => {
        storage.getItem.mockReturnValue('invalid json');

        expect(() => service.load()).toThrow('Invalid state');
    });

    test('save should store state in localStorage', () => {
        const state = { currentLevel: 3 };
        service.save(state);

        expect(storage.setItem).toHaveBeenCalledWith('state', JSON.stringify(state));
    });
});