import { Circle, Container } from 'pixi.js';
import Singleton from '../../Utils/Singleton';
import { DirtStrip } from './DirtStrip';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import { EDirtType as EDirtType } from './Dirt';
import anime from 'animejs';
import { wait } from '../../Utils/Wait';
import { createNoise2D } from 'simplex-noise';

class DirtController extends Singleton<DirtController>() {
    public view = new Container();
    public interactive = true;
    private _strips: DirtStrip[] = [];
    public get particles() {
        return this._strips.map((strip) => strip.dirt).flat();
    }

    init() {
        const { particleSize, baseline, wiggle } = gameSettings.ParticleStrips;

        // name the view
        this.view.name = 'ParticleContainerView';

        // build strips
        const noise2d = createNoise2D();

        for (let i = 0; i < World.width; i = i + particleSize) {
            const noise = noise2d(i / 400, 0);
            const offset = World.height * wiggle * noise;
            const topSoilHeight = World.height * baseline + offset;
            const dirtStrip = this.view.addChild(
                new DirtStrip({ topSoilHeight })
            );
            this._strips.push(dirtStrip);
            dirtStrip.x = i;
        }
    }

    async destroyDirtInRadius(
        x: number,
        y: number,
        radius: number,
        settleDelay: number = 0
    ) {
        this.interactive = false;
        const circle = new Circle(x, y, radius);
        const halfParticle = gameSettings.ParticleStrips.particleSize / 2;
        for (let strip of this._strips) {
            const x = strip.x + halfParticle;
            for (let i = strip.dirt.length - 1; i >= 0; i--) {
                const particle = strip.dirt[i];
                if (!particle) debugger;
                const y = particle.y + halfParticle;
                if (circle.contains(x, y)) {
                    this.convertDirtAt(strip, i, EDirtType.AIR);
                }
            }
        }
        await wait(settleDelay);
        await this.settleDirt();
        this.interactive = true;
    }

    convertDirtAt(stripX: DirtStrip | number, indexY: number, type: EDirtType) {
        const strip =
            typeof stripX === 'number' ? this._strips[stripX] : stripX;
        strip.dirt[indexY].type = type;
    }

    removeDirtRange(
        stripX: DirtStrip | number,
        startY: number,
        deleteCount: number
    ) {
        const strip =
            typeof stripX === 'number' ? this._strips[stripX] : stripX;
        const removals = strip.dirt.splice(startY, deleteCount);
        removals.forEach((dirt) => dirt.destroy());
    }

    removeDirtAt(stripX: DirtStrip | number, indexY: number) {
        this.removeDirtRange(stripX, indexY, 1);
    }

    async settleDirt() {
        const promises: Promise<void>[] = [];
        for (let strip of this._strips) {
            // detect an air gap
            let lowestAir = -1;
            let nextDirt = -1;

            for (let i = strip.dirt.length - 1; i >= 0; i--) {
                const dirt = strip.dirt[i];
                if (lowestAir < 0) {
                    if (dirt.type === EDirtType.AIR) {
                        lowestAir = i;
                    }
                } else {
                    if (dirt.type === EDirtType.NORMAL) {
                        nextDirt = i;
                        break;
                    }
                }
            }

            // if there is an air gap
            if (lowestAir < 0 || nextDirt < 0) continue;

            // remove air dirt particles
            const dist = lowestAir - nextDirt + 1;
            this.removeDirtRange(strip, nextDirt + 1, dist);

            // animate dirt down to new position
            const { particleSize } = gameSettings.ParticleStrips;
            const { gravity } = gameSettings.global;
            strip.dirt.slice(0, nextDirt + 1).forEach((dirt) => {
                // const duration = (particleSize / gravity) * 1000 * dist;
                const duration =
                    Math.sqrt((2 * (dist * particleSize)) / gravity) * 1000;
                const obj = {
                    y: dirt.y,
                };
                promises.push(
                    new Promise((resolve) => {
                        anime({
                            targets: obj,
                            duration,
                            easing: 'easeInQuad',
                            y: obj.y + dist * particleSize,
                            update: () => {
                                dirt.y = obj.y;
                            },
                            complete: () => {
                                resolve();
                            },
                        });
                    })
                );
            });
        }

        await Promise.allSettled(promises);
    }
}

export default DirtController.getInstance();
