import { Circle, Container, Graphics, Rectangle } from 'pixi.js';
import Victor from 'victor';
import { EDirtType } from '../Dirt/Dirt';
import gameSettings from '../../game.settings';
import DirtController from '../Dirt/DirtController';
import { PlayArea } from '../PlayArea';
import Objects from '../../Utils/Objects';
import Game from '../Game';
import { Explosion } from '../Explosion';
import { World } from '../../Utils/World';

export interface ProjectileOptions {
    startPower: number;
    startAngle: number;
    startPos: Victor;
    powerScale?: number;
    hitboxRadius?: number;
    radius?: number;
}

const defaults = {
    powerScale: 0.2,
    hitboxRadius: gameSettings.dirt.size * 2,
    radius: gameSettings.dirt.size * 2,
};
export class Projectile extends Container {
    private _gfx = new Graphics();
    private _startPower: number;
    private _powerScale: number;
    private _startAngle: number;
    private _pos: Victor;
    private _vel = new Victor(0, 0);
    private _acc: Victor;
    private _hitboxRadius: number;
    private _radius: number;
    private _age = 0;
    private resolver: () => void = () => {};
    public complete: Promise<void> = new Promise((resolve) => {
        this.resolver = resolve;
    });
    private get initialAcc() {
        return new Victor(0, this._startPower * this._powerScale).rotateByDeg(
            this._startAngle + 180
        );
    }

    constructor(opts: ProjectileOptions) {
        super();
        this._startPower = opts.startPower;
        this._powerScale = opts.powerScale ?? defaults.powerScale;
        this._startAngle = opts.startAngle;
        this._pos = opts.startPos;
        this._acc = this.initialAcc;
        this._hitboxRadius = opts.hitboxRadius ?? defaults.hitboxRadius;
        this._radius = opts.radius ?? defaults.radius;

        this.create();

        Game.app?.ticker.add(this.update, this);
    }

    create() {
        Objects.get<PlayArea>('PlayArea').addChild(this);
        this.addChild(
            this._gfx
                .beginFill(0x5050ff)
                .drawCircle(0, 0, this._radius)
                .endFill()
        );
        this.position.set(...this._pos.toArray());
    }

    update(deltaAsFloat: number) {
        this._age += deltaAsFloat;
        this.physics(deltaAsFloat);
    }

    physics(deltaAsFloat: number) {
        this._acc.add(gameSettings.global.gravity);
        this._vel.add(this._acc);
        this._pos.add(this._vel.clone().multiplyScalar(deltaAsFloat));
        this._acc.multiplyScalar(0);

        this.draw();

        if (this.isOutOfBounds()) {
            Game.app?.ticker.remove;
            this.destroy();
            return;
        }

        if (this.checkForCollision() || this.isOnFloor()) {
            this.destroy();
            const explosion = new Explosion({ pos: this._pos, radius: 100 });
            Objects.get<PlayArea>('PlayArea').addChild(explosion);
            return;
        }
    }

    draw() {
        if (this.destroyed) return;
        this.position.set(...this._pos.toArray());
    }

    checkForCollision(dirtType: EDirtType = EDirtType.NORMAL) {
        const circle = new Circle(this._pos.x, this._pos.y, this._hitboxRadius);
        // Note: Could be an issue that this checks upper left impact rather than center;
        const collided = DirtController.dirt.some((dirt) => {
            return (
                dirt.type === dirtType &&
                circle.contains(
                    dirt.parent.x + dirt.width / 2,
                    dirt.y + dirt.height / 2
                )
            );
        });
        return collided;
    }

    isOutOfBounds() {
        return (
            this.position.x + this._radius < 0 ||
            this.position.x - this._radius > World.width
        );
    }

    isOnFloor() {
        return this.position.y - this._hitboxRadius >= World.height;
    }

    destroy() {
        Game.app?.ticker.remove(this.update, this);
        super.destroy();
        this.resolver();
    }
}
