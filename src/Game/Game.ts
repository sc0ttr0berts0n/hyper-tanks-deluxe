import { Application } from 'pixi.js';
import Objects from '../Utils/Objects';
import Singleton from '../Utils/Singleton';
import { PlayArea } from './PlayArea';
import MouseManager from './Managers/MouseManager';
import TankController from './Tank/TankController';
import { UI } from './UI/UI';
import KeyboardManager from './Managers/KeyboardManager';
import DirtController from './Dirt/DirtController';
import { Projectile } from './Projectile/Projectile';
import Victor from 'victor';

class Game extends Singleton<Game>() {
    public app: Application | undefined;
    public gameover = false;
    public playArea: PlayArea | undefined;
    public frames = 0;
    public ui: UI | undefined;

    constructor() {
        super();
    }

    init() {
        this.app = new Application({ width: 800, height: 600 });
        document
            .querySelector<HTMLDivElement>('#app')!
            // @ts-expect-error
            .appendChild(this.app.view);
        Objects.set('app', this.app.stage);
        Objects.set('stage', this.app.stage);

        // hook for devtools:
        (globalThis as any).__PIXI_APP__ = this.app;

        this.create();
    }

    async create() {
        // await GraphicController.init();
        DirtController.init();
        TankController.init();
        KeyboardManager.init();
        this.playArea = this.app?.stage.addChild(new PlayArea());
        this.ui = this.app?.stage.addChild(new UI());
        MouseManager.init();
        new Projectile({
            startAngle: 0,
            startPower: 0,
            startPos: new Victor(
                TankController.tank.x + 200,
                TankController.tank.y + 200
            ),
        });
    }
}

export default Game.getInstance();
