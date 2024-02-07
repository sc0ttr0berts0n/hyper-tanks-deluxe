import { Graphics } from 'pixi.js';
import gameSettings from '../../game.settings';

export enum EDirtType {
    NORMAL,
    AIR,
}
export interface DirtOptions {
    color: number;
    type: EDirtType;
}

const dirtOptionDefaults: DirtOptions = {
    color: 0xffffff,
    type: EDirtType.NORMAL,
} as const;

export class Dirt extends Graphics {
    private _opts: DirtOptions;
    public _color: number;
    public _type: EDirtType;
    public get type() {
        return this._type;
    }
    public set type(val) {
        this._type = val;
        switch (val) {
            case EDirtType.AIR:
                this._color = 0x111111;
                this.draw();
                break;

            default:
                break;
        }
    }

    constructor(opts: Partial<DirtOptions>) {
        super();
        this._opts = Object.assign(dirtOptionDefaults, opts);
        this._color = this._opts.color;
        this._type = this._opts.type;
        this.create();
    }

    create() {
        this.draw();
    }

    draw() {
        const { size: particleSize } = gameSettings.dirt;
        this.beginFill(this._color)
            .drawRect(0, 0, particleSize, particleSize)
            .endFill();
    }

    static getParticleColorByDepth(depth: number) {
        const { soil } = gameSettings.dirt;
        const _convertToRanges = (soil: typeof gameSettings.dirt.soil) => {
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
