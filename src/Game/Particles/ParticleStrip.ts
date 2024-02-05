import { Container, Graphics } from 'pixi.js';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import { Particle } from './Particle';

export interface ParticleStripOptions {
    topSoilHeight: number;
}

export class ParticleStrip extends Container {
    private _topSoilHeight: number;
    public particles: Particle[] = [];
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
            const particle = new Particle({
                color: Particle.getParticleColor(depth),
            });
            particle.y = start + depth * particleSize;
            this.particles.push(particle);
        }
        this.addChild(...this.particles);
    }
}
