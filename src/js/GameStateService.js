export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      const state = this.storage.getItem('state');
      if (!state) {
        throw new Error('Invalid state');
      }
      return JSON.parse(state);
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
