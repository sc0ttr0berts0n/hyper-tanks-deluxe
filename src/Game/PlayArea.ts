import { Container, Graphics } from 'pixi.js';
import ParticleController from './Particles/ParticleController';
import { Explosion } from './Explosion';
import Victor from 'victor';
import { World } from '../Utils/World';
import Objects from '../Utils/Objects';

export class PlayArea extends Container {
    private _gfx_background = new Graphics()
        .beginFill(0x111111)
        .drawRect(0, 0, World.width, World.height)
        .endFill();
    constructor() {
        super();
        Objects.set('PlayArea', this);
        this.addChild(this._gfx_background);
        ParticleController.init();
        this.addChild(ParticleController.view);
        this.eventMode = 'static';
        this.addEventListener('pointerup', (e) => {
            const radius = Math.floor(Math.random() * 16) * 8;
            const explosion = new Explosion({
                pos: new Victor(e.screenX, e.screenY),
                radius,
            });
            this.addChild(explosion);
            ParticleController.destroyParticlesInRadius(
                e.screenX,
                e.screenY,
                radius
            );
        });
    }
}
