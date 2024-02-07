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
        switch (e.key) {
            case 'ArrowUp':
                TankController.power++;
                break;
            case 'ArrowDown':
                TankController.power--;
                break;
            case 'ArrowLeft':
                TankController.angle--;
                break;
            case 'ArrowRight':
                TankController.angle++;
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
