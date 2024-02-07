import { Graphics } from 'pixi.js';
import { Tank, TankOptions } from './Tank';
import Victor from 'victor';
import MouseManager from '../Managers/MouseManager';
import Game from '../Game';
export class Turret extends Graphics {
    private _parentRef: Tank;
    public gunAngle = 0;
    constructor(parentRef: Tank, opts: TankOptions) {
        super();
        this._parentRef = parentRef;
        this.beginFill(opts.color)
            .drawRoundedRect(
                0,
                -(opts.size.y * 0.333) / 2,
                opts.size.x * 0.666,
                opts.size.y * 0.333,
                100
            )
            .endFill();

        MouseManager.addEventListener(
            'mousemove',
            this.alignTurretWithMouse.bind(this)
        );
    }

    alignTurretWithMouse() {
        const turretPos = this.getGlobalPosition();
        const angle = MouseManager.pos
            .clone()
            .subtract(new Victor(turretPos.x, turretPos.y));
        this.angle = angle.horizontalAngleDeg() - this._parentRef.angle;
    }
}
