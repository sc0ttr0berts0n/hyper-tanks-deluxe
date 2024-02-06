import { Container, Graphics } from 'pixi.js';
import { Turret } from './Turret';
import Victor from 'victor';
import { World } from '../../Utils/World';
import gameSettings from '../../game.settings';
import DirtController from '../Dirt/DirtController';

interface TankOptions {
    startPos: number;
    color: number;
    size: Victor;
}

const tankDefaultOptions = {
    startPos: gameSettings.global.width * gameSettings.tank.playerStartPos,
    color: 0xffffff,
    size: gameSettings.tank.size.clone(),
};

export class Tank extends Container {
    private _turret = new Turret();
    private _gfx_body = new Graphics();
    private _opts: TankOptions;
    constructor(opts?: Partial<TankOptions>) {
        super();
        this._opts = Object.assign(tankDefaultOptions, opts);
        this.create();
    }
    create() {
        this._gfx_body
            .beginFill(this._opts.color)
            .drawRoundedRect(0, 0, this._opts.size.x, this._opts.size.y, 4)
            .endFill();
        this._gfx_body.pivot.set(
            this._gfx_body.width / 2,
            this._gfx_body.height
        );
        const startPos = DirtController.surfacePositionAt(this._opts.startPos);
        this.position.set(startPos.x, startPos.y);

        // calc angle
        const leftX = startPos.x - this._gfx_body.width / 2;
        const rightX = startPos.x + this._gfx_body.width / 2;
        const leftPos = DirtController.surfacePositionAt(leftX);
        const rightPos = DirtController.surfacePositionAt(rightX);
        const slope = rightPos.subtract(leftPos);
        const angle = slope.horizontalAngleDeg();

        this._gfx_body.angle = angle;
        this.addChild(this._gfx_body);
        this.addChild(this._turret);
    }
}
