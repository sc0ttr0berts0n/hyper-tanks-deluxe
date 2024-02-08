import Victor from 'victor';
import Objects from '../../Utils/Objects';
import Singleton from '../../Utils/Singleton';
import { Tank } from './Tank';
import { Projectile } from '../Projectile/Projectile';
import anime from 'animejs';
import MathHelper from '../../Utils/MathHelper';
import gameSettings from '../../game.settings';
import { Point } from 'pixi.js';
import DirtController from '../Dirt/DirtController';

class TankController extends Singleton<TankController>() {
    public power = 60;
    public get tank() {
        return Objects.get<Tank>('Tank');
    }
    public get hitBox() {
        return Objects.get<Tank>('Tank').body;
    }
    public get angle(): number {
        return this.tank?.turret?.angle ?? 0;
    }
    public set angle(val: number | string) {
        const _val = Number(val);
        if (this.tank.turret?.angle) {
            this.tank.turret.angle = _val;
        }
    }
    public get pos() {
        const tank = Objects.get<Tank>('Tank');
        return new Victor(tank.x, tank.y);
    }
    public get turretPos() {
        const tank = Objects.get<Tank>('Tank');
        return new Victor(
            tank.turret?.getGlobalPosition().x ?? 0,
            tank.turret?.getGlobalPosition().y ?? 0
        );
    }
    init() {}

    async fire() {
        const startAngle = this.angle;
        const startPower = this.power;
        const startPos = this.turretPos;
        const projectile = new Projectile({
            startAngle,
            startPower,
            startPos,
        });
        await projectile.complete;
    }

    async moveTo(direction: 'left' | 'right'): Promise<void> {
        const _dir = direction === 'left' ? -1 : 1;
        return new Promise((resolve) => {
            let frameCount = 0;
            const maxClimb = -_dir * gameSettings.tank.maxClimb;
            const obj = {
                x: this.tank.x,
            };

            anime({
                targets: obj,
                duration: gameSettings.tank.moveDistance * 15,
                easing: 'easeInOutQuad',
                x: this.tank.x + gameSettings.tank.moveDistance * _dir,
                update: (e) => {
                    this.tank.y = DirtController.surfacePositionAt(
                        this.tank.x
                    ).y;
                    const angle = this.tank.getSlopeBeneathTank();
                    console.log(angle);

                    if (
                        (direction === 'right' && angle > maxClimb) ||
                        (direction === 'left' && angle < maxClimb)
                    ) {
                        this.tank.x = obj.x;
                    }

                    const wiggle = Math.sin(e.progress / 4) * 3;
                    this.tank.body.angle =
                        this.tank.getSlopeBeneathTank() + wiggle;

                    frameCount++;
                },
                complete: () => {
                    this.tank.body.angle = this.tank.getSlopeBeneathTank();
                    resolve();
                },
            });
        });
    }

    fallTo(pos: Victor | Point): Promise<void> {
        const tankBody = this.tank.body.getGlobalPosition();
        const obj = {
            x: tankBody.x + gameSettings.dirt.size,
            y: tankBody.y + gameSettings.dirt.size,
            angle: this.tank.angle,
        };
        const dist = Math.abs(this.tank.y - pos.y);
        const duration = MathHelper.freeFallDuration(dist);
        const angle = this.tank.getSlopeBeneathTank();
        return new Promise((resolve) => {
            anime({
                targets: obj,
                duration,
                easing: 'easeInQuad',
                y: pos.y,
                angle,
                update: () => {
                    this.tank.x = obj.x;
                    this.tank.y = obj.y;
                    this.tank.body.angle = obj.angle;
                },
                complete: () => {
                    resolve();
                },
            });
        });
    }
}

export default TankController.getInstance();
