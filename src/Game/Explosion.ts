import anime from 'animejs';
import { Graphics } from 'pixi.js';
import Victor from 'victor';

interface ExplosionOptions {
    pos: Victor;
    radius: number;
}

export class Explosion extends Graphics {
    constructor(opts: ExplosionOptions) {
        super();
        this.beginFill(0xcccccc).drawCircle(0, 0, opts.radius).endFill();
        this.position.set(opts.pos.x, opts.pos.y);
        this.animate();
    }

    animate() {
        this.scale.set(0);
        this.alpha = 0;
        const obj = {
            alpha: this.alpha,
            scaleX: this.scale.x,
            scaleY: this.scale.y,
        };
        anime({
            targets: obj,
            duration: 4000,
            delay: 1000,
            scaleX: [1, 0],
            scaleY: [1, 0],
            alpha: [1, 0],
            update: (e) => {
                this.alpha = obj.alpha;
                this.scale.set(obj.scaleX, obj.scaleY);
            },
            complete: () => {
                this.destroy();
            },
        });
    }
}
