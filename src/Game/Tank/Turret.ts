import { Graphics } from 'pixi.js';
import { Tank, TankOptions } from './Tank';
import Victor from 'victor';
import MouseManager from '../Managers/MouseManager';

export class Turret extends Graphics {
    private _parentRef: Tank;
    public gunAngle = 0;
    constructor(parentRef: Tank, opts: TankOptions) {
        super();
        this._parentRef = parentRef;
        this.beginFill(0x885050)
            .drawRoundedRect(0, -5, opts.size.x * 0.666, 10, 2.5)
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
