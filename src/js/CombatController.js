export default class CombatController {
    // Расчет урона
    static calculateDamage(attacker, target) {
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        return Math.floor(damage);
    }

    // Нанесение урона цели
    static applyDamage(target, damage) {
        const newHealth = Math.max(0, target.health - damage);
        target.health = newHealth;
        return damage;
    }

    // Проверка, жив ли персонаж
    static isAlive(character) {
        return character.health > 0;
    }
}