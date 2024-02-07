import { Container, ITextStyle, Text } from 'pixi.js';
import Game from '../Game';
import { World } from '../../Utils/World';
import TankController from '../Tank/TankController';

const textStyle: Partial<ITextStyle> = {
    fill: 0xffffff,
    fontFamily: 'monospace',
};

export class UI extends Container {
    private _angleLabel = new Text('Angle: ', textStyle);
    private _angleValue = new Text('???', textStyle);
    private _powerLabel = new Text('Power: ', textStyle);
    private _powerValue = new Text('???', textStyle);

    constructor() {
        super();
        this.create();
        Game.app?.ticker.add(this.update.bind(this));
    }

    create() {
        this.addChild(this._angleLabel);
        this.addChild(this._angleValue);
        this.addChild(this._powerLabel);
        this.addChild(this._powerValue);

        this.position.set(0, World.height - this.height);
        this.position.x += 10;
        this.position.y -= 10;

        this.renderText();
    }

    update() {
        this.renderText();
    }

    private renderText() {
        const newAngle = TankController.angle?.toFixed() ?? '???';
        const newPower = TankController.power.toString();

        if (
            newAngle === this._angleValue.text &&
            newPower === this._powerValue.text
        ) {
            return;
        }
        this._angleValue.text = newAngle;
        this._powerValue.text = newPower;

        const gap = Math.max(
            this._angleLabel.height,
            this._angleValue.height,
            this._powerLabel.height,
            this._powerValue.height
        );
        this._angleValue.x = this._angleLabel.width;
        this._powerLabel.x = this._angleValue.x + this._angleValue.width + gap;
        this._powerValue.x = this._powerLabel.x + this._powerLabel.width;
    }
}
