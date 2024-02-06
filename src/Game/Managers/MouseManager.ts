import { Graphics } from 'pixi.js';
import Singleton from '../../Utils/Singleton';
import Game from '../Game';
import Victor from 'victor';
import Objects from '../../Utils/Objects';
import { PlayArea } from '../PlayArea';
import { lerp2d } from '../../Utils/Lerp';

class MouseManager extends Singleton<MouseManager>() {
    public pos = new Victor(0, 0);
    public cursor = new Graphics();

    init() {
        this.cursor.beginFill(0xffffff, 0.2).drawCircle(0, 0, 15).endFill();

        const pa = Objects.get<PlayArea>('PlayArea');

        pa.addChild(this.cursor);

        pa.addEventListener('mousemove', (e) => {
            this.pos.x = e.screenX;
            this.pos.y = e.screenY;
        });

        Game.app?.ticker.add(this.update.bind(this));
    }

    update() {
        this.cursor.position.set(
            ...lerp2d(this.cursor, this.pos, 0.6).toArray()
        );
    }
}

export default MouseManager.getInstance();
