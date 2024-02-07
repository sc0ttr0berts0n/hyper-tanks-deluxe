import { Container, Graphics } from 'pixi.js';
import { Tank } from './Tank';
import Victor from 'victor';
import MouseManager from '../Managers/MouseManager';
import gameSettings from '../../game.settings';
export class Reticle extends Container {
    private _parentRef: Tank;
    constructor(parentRef: Tank) {
        super();
        this._parentRef = parentRef;
        this.create();

        // Game.app?.ticker.add(this.update.bind(this));
    }

    create() {
        const width = gameSettings.tank.size.x / 3;
        const height = gameSettings.tank.size.y / 4;
        const gap = gameSettings.tank.size.x / 6;
        for (let deg = 0; deg < 360; deg += 90) {
            const line = new Graphics()
                .beginFill(0xffffff)
                .drawRect(gap, -height / 2, width, height);
            line.angle = deg;
            this.addChild(line);
        }
        this.x = gameSettings.tank.size.x * 3;
    }

    update() {
        const turretPos = this.getGlobalPosition();
        const angle = MouseManager.pos
            .clone()
            .subtract(new Victor(turretPos.x, turretPos.y));
        this.angle = angle.horizontalAngleDeg() - this._parentRef.angle;
    }
}
