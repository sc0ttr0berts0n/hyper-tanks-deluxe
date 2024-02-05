import { Circle, Container } from 'pixi.js';
import Singleton from '../../Utils/Singleton';
import { ParticleStrip } from './ParticleStrip';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';

class ParticleController extends Singleton<ParticleController>() {
    public view = new Container();
    private _strips: ParticleStrip[] = [];
    public get particles() {
        return this._strips.map((strip) => strip.particles).flat();
    }

    init() {
        const { particleSize, baseline } = gameSettings.ParticleStrips;

        // name the view
        this.view.name = 'ParticleContainerView';

        // build strips
        for (let i = 0; i < World.width; i = i + particleSize) {
            const topSoilHeight = World.height * baseline;
            const ps = this.view.addChild(new ParticleStrip({ topSoilHeight }));
            this._strips.push(ps);
            ps.x = i;
        }
    }

    destroyParticlesInRadius(x: number, y: number, radius: number) {
        const circle = new Circle(x, y, radius);
        const halfParticle = gameSettings.ParticleStrips.particleSize / 2;
        for (let strip of this._strips) {
            const x = strip.x + halfParticle;
            for (let i = strip.particles.length - 1; i >= 0; i--) {
                const particle = strip.particles[i];
                if (!particle) debugger;
                const y = particle.y + halfParticle;
                if (circle.contains(x, y)) {
                    this.removeParticleAt(strip, i);
                }
            }
        }
    }

    removeParticleAt(stripX: ParticleStrip | number, indexY: number) {
        const strip =
            typeof stripX === 'number' ? this._strips[stripX] : stripX;
        strip.particles[indexY].destroy();
        strip.particles.splice(indexY, 1);
    }
}

export default ParticleController.getInstance();
