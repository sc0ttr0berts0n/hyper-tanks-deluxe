import { Graphics } from 'pixi.js';
import gameSettings from '../../game.settings';

interface DirtOptions {
    color: number;
}
export class Dirt extends Graphics {
    public removalFlag = false;

    constructor(opts: Partial<DirtOptions>) {
        super();
        const { particleSize } = gameSettings.ParticleStrips;
        this.beginFill(opts?.color ?? 0xffffff)
            .drawRect(0, 0, particleSize, particleSize)
            .endFill();
    }

    static getParticleColor(depth: number) {
        const { soil } = gameSettings.ParticleStrips;
        const _convertToRanges = (
            soil: typeof gameSettings.ParticleStrips.soil
        ) => {
            let base = 0;
            return Object.entries(soil).map(([key, value]) => {
                const result = {
                    type: key,
                    color: value.color,
                    min: base,
                    max: base + value.amount,
                };
                base = result.max;
                return result;
            });
        };

        const soilInRange = _convertToRanges(soil).find(
            (el) => depth >= el.min && depth < el.max
        );

        const result = soilInRange ?? Object.values(soil).at(-1);

        return result?.color;
    }
}
