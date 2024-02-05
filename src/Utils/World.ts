import Victor from 'victor';
import Game from '../Game/Game';

export class World {
    static get width() {
        return Game.app?.renderer.width ?? 0;
    }
    static get height() {
        return Game.app?.renderer.height ?? 0;
    }
    static get center(): Victor {
        return new Victor(World.width / 2, World.height / 2);
    }
    constructor() {}
}
