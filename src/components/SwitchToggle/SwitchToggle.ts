import {
    $$,
    IFormWidgetSettable
} from 'coveo-search-ui';

export enum SwitchState {
    LEFT,
    CENTER,
    RIGHT
}

export interface ISwitchToggleOptions {
    ariaLabels: {
        main: string,
        left: string,
        center: string,
        right: string
    }
}

// hide : <img src="https://img.icons8.com/material-outlined/50/000000/closed-eye.png">
// show:  <img src="https://img.icons8.com/material-outlined/50/000000/visible.png">

export class SwitchToggle implements IFormWidgetSettable {
    protected element: HTMLElement;
    protected state: SwitchState;

    constructor(
        public onChange: (switchToggle: SwitchToggle) => void = (switchToggle: SwitchToggle) => {},
        protected options: ISwitchToggleOptions
    ) {
        this.buildContent();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public build(): HTMLElement {
        return this.element;
    }

    public getValue(): SwitchState {
        return this.state;
    }

    public reset() {
        this.setValue(SwitchState.CENTER);
    }

    public setValue( value: SwitchState ) {
        this.state = value;
        this.styleChangeHandler(value);
        this.onChange(this);
    }

    protected styleChangeHandler( value: SwitchState) {
        alert(value);
    }

    private buildContent() {
        const switchSection = $$('div', { className: 'coveo-switch-toggle', ariaLabel: this.options.ariaLabels.main});
        const switchDiv = $$('div', { className: 'coveo-switch-center' });
        const leftButton = $$('button', { className: 'coveo-switch-toggle-left', ariaLabel: this.options.ariaLabels.left });
        const centerButton = $$('button', { className: 'coveo-switch-toggle-center', ariaLabel: this.options.ariaLabels.center });
        const rightButton = $$('button', { className: 'coveo-switch-toggle-right', ariaLabel: this.options.ariaLabels.right });

        leftButton.el.innerHTML = '<img src="https://img.icons8.com/material-outlined/1d4f76/closed-eye.png">';
        rightButton.el.innerHTML = '<img src="https://img.icons8.com/material-outlined/1d4f76/visible.png">';

        leftButton.on('click', () => {
            this.setValue(SwitchState.LEFT);
        });
        centerButton.on('click', () => {
            this.setValue(SwitchState.CENTER);
        });
        rightButton.on('click', () => {
            this.setValue(SwitchState.RIGHT);
        });

        switchSection.append(leftButton.el);
        switchSection.append(centerButton.el);
        switchSection.append(rightButton.el);
        switchSection.append(switchDiv.el);
        
        this.element = switchSection.el;
    }
}