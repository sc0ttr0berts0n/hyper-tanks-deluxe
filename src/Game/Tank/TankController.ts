import Victor from 'victor';
import Objects from '../../Utils/Objects';
import Singleton from '../../Utils/Singleton';
import { Tank } from './Tank';
import { Projectile } from '../Projectile/Projectile';
import anime from 'animejs';
import MathHelper from '../../Utils/MathHelper';
import gameSettings from '../../game.settings';
import { Point } from 'pixi.js';

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

    fallTo(pos: Victor | Point): Promise<void> {
        const obj = {
            x: this.tank.x + gameSettings.dirt.size,
            y: this.tank.y + gameSettings.dirt.size,
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
