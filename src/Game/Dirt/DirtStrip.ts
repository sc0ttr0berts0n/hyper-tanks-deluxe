import { Container } from 'pixi.js';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import { Dirt } from './Dirt';

export interface ParticleStripOptions {
    topSoilHeight: number;
}

export class DirtStrip extends Container {
    private _topSoilHeight: number;
    public dirt: Dirt[] = [];
    constructor(opts: Partial<ParticleStripOptions>) {
        super();
        this._topSoilHeight = opts.topSoilHeight ?? World.height * 0.5;
        this.create();
    }

    create() {
        const { size: particleSize } = gameSettings.dirt;
        const start = World.height - this._topSoilHeight;
        const chunks = Math.floor(this._topSoilHeight / particleSize);
        for (let depth = 0; depth < chunks; depth++) {
            const dirt = new Dirt({
                color: Dirt.getParticleColorByDepth(depth),
            });
            dirt.y = start + depth * particleSize;
            this.dirt.push(dirt);
        }
        this.addChild(...this.dirt);
    }
}
