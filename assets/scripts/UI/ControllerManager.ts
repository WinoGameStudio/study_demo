import { _decorator, Component, Node } from 'cc';
import EventMannager from '../runtime/EventManager';
import { EVENT_ENUM, INPUT_DIRECTION_ENUM } from '../enums';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {

    handle_control(event, params) {
        console.log(params,"=========> params");
        EventMannager.instance.emit(EVENT_ENUM.PLAYER_MOVE, params);
    }
}

