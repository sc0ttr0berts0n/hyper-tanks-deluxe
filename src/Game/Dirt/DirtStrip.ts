import { Container } from 'pixi.js';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import { Dirt } from './Dirt';

export interface ParticleStripOptions {
    topSoilHeight: number;
}

export class DirtStrip extends Container {
    private _topSoilHeight: number;
    public particles: Dirt[] = [];
    constructor(opts: Partial<ParticleStripOptions>) {
        super();
        this._topSoilHeight = opts.topSoilHeight ?? World.height * 0.5;
        this.create();
    }

    create() {
        const { particleSize } = gameSettings.ParticleStrips;
        const start = World.height - this._topSoilHeight;
        const chunks = Math.floor(this._topSoilHeight / particleSize);
        for (let depth = 0; depth < chunks; depth++) {
            const particle = new Dirt({
                color: Dirt.getParticleColor(depth),
            });
            particle.y = start + depth * particleSize;
            this.particles.push(particle);
        }
        this.addChild(...this.particles);
    }
}
