import { Circle, Container } from 'pixi.js';
import Singleton from '../../Utils/Singleton';
import { DirtStrip } from './DirtStrip';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import { EDirtType as EDirtType } from './Dirt';
import anime from 'animejs';
import { wait } from '../../Utils/Wait';
import { createNoise2D } from 'simplex-noise';
import Victor from 'victor';
import TankController from '../Tank/TankController';

class DirtController extends Singleton<DirtController>() {
    public view = new Container();
    public interactive = true;
    private _strips: DirtStrip[] = [];
    public get dirt() {
        return this._strips.map((strip) => strip.dirt).flat();
    }

    init() {
        const { size: particleSize, baseline, wiggle } = gameSettings.dirt;

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
        const halfParticle = gameSettings.dirt.size / 2;
        for (let strip of this._strips) {
            const x = strip.x + halfParticle;

            // convert dirt to air
            for (let i = strip.dirt.length - 1; i >= 0; i--) {
                const particle = strip.dirt[i];
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
            const tankPos = TankController.tank.body.getGlobalPosition();
            const tankOnStrip = strip === this.stripAtPixel(tankPos.x);

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
            if (lowestAir >= 0 && nextDirt >= 0) {
                // animate dirt down to new position
                const dist = lowestAir - nextDirt + 1;
                const { size: particleSize } = gameSettings.dirt;
                const { gravity } = gameSettings.dirt;
                promises.push(
                    ...strip.dirt
                        .slice(0, nextDirt + 1)
                        .map((dirt, index): Promise<void> => {
                            const duration =
                                Math.sqrt(
                                    (2 * (dist * particleSize)) / gravity
                                ) * 1000;
                            const obj = {
                                y: dirt.y,
                            };
                            return new Promise((resolve) => {
                                anime({
                                    targets: obj,
                                    duration,
                                    easing: 'easeInQuad',
                                    y: obj.y + dist * particleSize,
                                    update: () => {
                                        dirt.y = obj.y;
                                        if (tankOnStrip && index === 0) {
                                            TankController.tank.y = dirt.y;
                                            TankController.tank.body.angle =
                                                TankController.tank.getSlopeBeneathTank();
                                            console.log(
                                                TankController.tank.body.angle
                                            );
                                        }
                                    },
                                    complete: () => {
                                        console.log(
                                            TankController.tank.body.angle
                                        );

                                        resolve();
                                    },
                                });
                            });
                        })
                );

                // remove air dirt particles
                this.removeDirtRange(strip, nextDirt + 1, dist);

                continue;
            }

            if (lowestAir >= 0) {
                this.removeDirtRange(strip, 0, lowestAir + 1);
            }

            if (tankOnStrip) {
                const highestDirt = Math.min(...strip.dirt.map((el) => el.y));
                if (tankPos.y < highestDirt - gameSettings.dirt.size) {
                    TankController.fallTo(
                        strip.dirt?.[0]?.position ?? { y: World.height }
                    );
                }
            }
        }

        await Promise.allSettled(promises);
    }

    surfacePositionAt(x: number) {
        const index = Math.floor(x / gameSettings.dirt.size);
        const targetDirt = this._strips[index].dirt.find((dirt) => {
            return dirt.type !== EDirtType.AIR;
        });
        return new Victor(x, targetDirt?.y ?? World.height);
    }

    /**
     * @param x value in pixels
     * @returns strip at that absolute pixel value
     */
    private stripAtPixel(x: number) {
        return this._strips[Math.floor(x / gameSettings.dirt.size)];
    }
}

export default DirtController.getInstance();
