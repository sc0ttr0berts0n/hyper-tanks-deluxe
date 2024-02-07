import { Container, Graphics } from 'pixi.js';
import DirtController from './Dirt/DirtController';
import { Explosion } from './Explosion';
import Victor from 'victor';
import { World } from '../Utils/World';
import Objects from '../Utils/Objects';
import { Tank } from './Tank/Tank';
import TankController from './Tank/TankController';

export class PlayArea extends Container {
    private _gfx_background = new Graphics()
        .beginFill(0x111111)
        .drawRect(0, 0, World.width, World.height)
        .endFill();
    constructor() {
        super();
        Objects.set('PlayArea', this);
        this.addChild(this._gfx_background);
        DirtController.init();
        this.addChild(DirtController.view);
        this.eventMode = 'static';
        this.addChild(new Tank({ color: 0xff5050 }));
        this.addEventListener('pointerup', async (e) => {
            if (!DirtController.interactive) return;
            this.eventMode = 'none';
            await TankController.fire();
            this.eventMode = 'static';
            console.log('done');
            // const radius = Math.floor(Math.random() * 8) * 16;
            // const explosion = new Explosion({
            //     pos: new Victor(e.screenX, e.screenY),
            //     radius,
            // });
            // this.addChild(explosion);
        });
    }
}
