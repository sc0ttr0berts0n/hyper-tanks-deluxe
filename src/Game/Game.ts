import { Application } from 'pixi.js';
import Objects from '../Utils/Objects';
import Singleton from '../Utils/Singleton';
import { PlayArea } from './PlayArea';

class Game extends Singleton<Game>() {
    public app: Application | undefined;
    public gameover = false;
    public playArea: PlayArea | undefined;
    public frames = 0;

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
    }
}

export default Game.getInstance();
