/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target === Character) {
      throw new Error('Cannot instantiate Character directly');
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  levelUp() {
    if (this.health <= 0) {
      throw new Error('Cannot level up a dead character');
    }

    this.level += 1;
    this.attack = Math.max(this.attack, Math.floor(this.attack * (80 + this.health) / 100));
    this.defence = Math.max(this.defence, Math.floor(this.defence * (80 + this.health) / 100));
    this.health = Math.min(this.health + 80, 100);
  }
}
