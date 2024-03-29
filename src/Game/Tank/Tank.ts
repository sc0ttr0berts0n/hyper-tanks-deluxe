import { Container, Graphics } from 'pixi.js';
import { Turret } from './Turret';
import Victor from 'victor';
import gameSettings from '../../game.settings';
import DirtController from '../Dirt/DirtController';
import { Reticle } from './Reticle';
import Objects from '../../Utils/Objects';

export interface TankOptions {
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
    public turret: Turret | null = null;
    private _gfx_body = new Graphics();
    public get body() {
        return this._gfx_body;
    }
    private _opts: TankOptions;
    constructor(opts?: Partial<TankOptions>) {
        super();
        Objects.set('Tank', this);
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

        // calc body angle
        this.alignTankWithSurfaceSlope();

        this.addChild(this._gfx_body);

        // place turret
        this.turret = this.addChild(new Turret(this, this._opts));
        this.turret.y = -this._gfx_body.height * 0.8;

        // place retricle
        this.turret.addChild(new Reticle(this));
    }

    getSlopeBeneathTank(): number {
        const leftX = this.x - this._gfx_body.width / 2;
        const rightX = this.x + this._gfx_body.width / 2;
        const leftPos = DirtController.surfacePositionAt(leftX);
        const rightPos = DirtController.surfacePositionAt(rightX);
        const slope = rightPos.subtract(leftPos);
        return slope.horizontalAngleDeg();
    }

    alignTankWithSurfaceSlope() {
        const angle = this.getSlopeBeneathTank();
        this._gfx_body.angle = angle;
    }
}
