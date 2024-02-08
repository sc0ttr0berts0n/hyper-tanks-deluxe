import Singleton from '../../Utils/Singleton';
import TankController from '../Tank/TankController';

export enum EKeys {
    UP = 'ArrowUp',
    DOWN = 'ArrowDown',
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight',
    SPACE = ' ',
    A = 'a',
    D = 'd',
}

class MouseManager extends Singleton<MouseManager>() {
    public pressedKeys = new Set();

    init() {
        document.addEventListener('keydown', this.onKeydown.bind(this));
        document.addEventListener('keyup', this.onKeyup.bind(this));
    }

    onKeydown(e: KeyboardEvent) {
        this.pressedKeys.add(e.key);
        const amount = e.shiftKey ? 10 : 1;
        switch (e.key) {
            case EKeys.UP:
                TankController.power += amount;
                break;
            case EKeys.DOWN:
                TankController.power -= amount;
                break;
            case EKeys.LEFT:
                TankController.angle -= amount;
                break;
            case EKeys.RIGHT:
                TankController.angle += amount;
                break;
            case EKeys.SPACE:
                TankController.fire();
                break;
            case EKeys.A:
                TankController.moveTo('left');
                break;
            case EKeys.D:
                TankController.moveTo('right');
                break;
            default:
                break;
        }
    }
    onKeyup(e: KeyboardEvent) {
        this.pressedKeys.delete(e.key);
    }
}

export default MouseManager.getInstance();
