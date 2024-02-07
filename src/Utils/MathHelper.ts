import gameSettings from '../game.settings';

export default class MathHelper {
    static clamp = (min: number, max: number, val: number): number => {
        return Math.max(Math.min(max, val), min);
    };
    static freeFallDuration = (dist: number) => {
        // TODO: remove this constant
        const FPS = 60;
        return (
            Math.sqrt(((2 * dist) / gameSettings.global.gravity.y) * FPS) * 1000
        );
    };
}
