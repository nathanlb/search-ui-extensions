import { SwitchState } from "../SwitchToggle/SwitchToggle";

/**
 * Events triggered by the **ViewedFilter** component.
 */
export enum ViewedFilterEvents {
    Click = 'click'
}

/**
 * Arguments sent with the events coming from the **ViewedFilter** component.
 */
export interface IViewedFilterEventArgs {
    /**
     * State of the filter's toggle
     */
    switchState: SwitchState;
}
