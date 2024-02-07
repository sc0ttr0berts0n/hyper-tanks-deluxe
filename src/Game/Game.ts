import { Application } from 'pixi.js';
import Objects from '../Utils/Objects';
import Singleton from '../Utils/Singleton';
import { PlayArea } from './PlayArea';
import MouseManager from './Managers/MouseManager';
import TankController from './Tank/TankController';
import { UI } from './UI/UI';
import KeyboardManager from './Managers/KeyboardManager';

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
        this.playArea = this.app?.stage.addChild(new PlayArea());
        this.ui = this.app?.stage.addChild(new UI());
        MouseManager.init();
        KeyboardManager.init();
        TankController.init();
    }
}

export default Game.getInstance();
