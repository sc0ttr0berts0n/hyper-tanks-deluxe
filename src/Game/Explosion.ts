import anime from 'animejs';
import { Graphics } from 'pixi.js';
import Victor from 'victor';
import DirtController from './Dirt/DirtController';
import { wait } from '../Utils/Wait';

interface ExplosionOptions {
    pos: Victor;
    radius: number;
}

export class Explosion extends Graphics {
    private _opts: ExplosionOptions;
    private _pos: Victor;
    private _radius: number;
    public complete: Promise<void>;

    constructor(opts: ExplosionOptions) {
        super();
        this._opts = Object.assign(opts);
        this._pos = this._opts.pos;
        this._radius = this._opts.radius;
        this.complete = Promise.resolve();
        this.create();
    }

    async create() {
        this.beginFill(0xcccccc).drawCircle(0, 0, this._radius).endFill();
        this.visible = false;
        this.position.set(this._pos.x, this._pos.y);
        DirtController.destroyDirtInRadius(
            this._pos.x,
            this._pos.y,
            this._radius,
            200
        );
        await this.animate();
    }

    async animate(): Promise<void> {
        this.scale.set(0);
        this.alpha = 0;
        const obj = {
            alpha: this.alpha,
            scaleX: this.scale.x,
            scaleY: this.scale.y,
        };
        this.visible = true;
        this.complete = new Promise((resolve) => {
            anime({
                targets: obj,
                duration: 300,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                direction: 'alternate',
                easing: 'easeInOutBounce',
                update: () => {
                    this.alpha = obj.alpha;
                    this.scale.set(obj.scaleX, obj.scaleY);
                },
                complete: () => {
                    this.destroy();
                    resolve();
                },
            });
        });
        return this.complete;
    }
}
