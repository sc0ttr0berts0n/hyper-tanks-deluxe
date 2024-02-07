import Singleton from '../../Utils/Singleton';
import TankController from '../Tank/TankController';

export enum EKeys {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    SPACE,
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
            case 'ArrowUp':
                TankController.power += amount;
                break;
            case 'ArrowDown':
                TankController.power -= amount;
                break;
            case 'ArrowLeft':
                TankController.angle -= amount;
                break;
            case 'ArrowRight':
                TankController.angle += amount;
                break;
            case ' ':
                TankController.fire();
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
