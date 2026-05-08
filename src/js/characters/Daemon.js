import Character from '../Character';

export default class Daemon extends Character {
    constructor(level) {
        super(1, 'daemon');
        this.attack = 10;
        this.defence = 10;

        if (level > 1) {
            for (let i = 1; i < level; i++) {
                this.levelUp();
            }
        }
    }
}