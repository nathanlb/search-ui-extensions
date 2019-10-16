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
     * Whether the filter is currently checked or not.
     */
    checked: boolean;
}
