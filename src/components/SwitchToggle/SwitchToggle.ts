import {
    $$,
    IFormWidgetSettable
} from 'coveo-search-ui';

export enum SwitchState {
    LEFT = 'LEFT',
    CENTER = 'CENTER',
    RIGHT = 'RIGHT'
}

export interface ISwitchToggleOptions {
    ariaLabels: {
        main: string,
        left: string,
        center: string,
        right: string
    }
}

export class SwitchToggle implements IFormWidgetSettable {
    protected element: HTMLElement;
    protected state: SwitchState;
    protected switchDiv: HTMLElement;
    private iconColor = '1d4f76';

    constructor(
        public onChange: (switchToggle: SwitchToggle) => void = (switchToggle: SwitchToggle) => {},
        protected options: ISwitchToggleOptions
    ) {
        this.state = SwitchState.CENTER;
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
        this.styleChangeHandler(value);
        this.state = value;
        this.onChange(this);
    }

    protected styleChangeHandler( value: SwitchState ) {
        this.switchDiv.classList.toggle(this.state);
        this.switchDiv.classList.toggle(value);
    }

    private buildContent() {
        const switchSection = $$('div', {
            className: 'coveo-switch-toggle',
            ariaLabel: this.options.ariaLabels.main
        });
        const leftButton = $$('button', {
            className: 'coveo-switch-toggle-left',
            ariaLabel: this.options.ariaLabels.left
        });
        const centerButton = $$('button', {
            className: 'coveo-switch-toggle-center',
            ariaLabel: this.options.ariaLabels.center
        });
        const rightButton = $$('button', {
            className: 'coveo-switch-toggle-right',
            ariaLabel: this.options.ariaLabels.right
        });
        this.switchDiv = $$('div', { className: 'coveo-switch' }).el;
        this.switchDiv.classList.toggle(SwitchState.CENTER);

        leftButton.el.innerHTML = `<img src="https://img.icons8.com/material-outlined/${this.iconColor}/closed-eye.png">`;
        rightButton.el.innerHTML = `<img src="https://img.icons8.com/material-outlined/${this.iconColor}/eye.png">`;

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
        switchSection.append(this.switchDiv);
        
        this.element = switchSection.el;
    }
}