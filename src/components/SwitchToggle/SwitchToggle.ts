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

export class SwitchToggle implements IFormWidgetSettable {
    protected element: HTMLElement;
    protected switch: HTMLInputElement;
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
        this.onChange(this);
    }

    private buildContent() {
        const switchSection = $$('div', { className: 'coveo-switch-toggle', ariaLabel: this.options.ariaLabels.main});
        const leftButton = $$('button', { className: 'coveo-switch-toggle-left', ariaLabel: this.options.ariaLabels.left });
        const centerButton = $$('button', { className: 'coveo-switch-toggle-center', ariaLabel: this.options.ariaLabels.center });
        const rightButton = $$('button', { className: 'coveo-switch-toggle-right', ariaLabel: this.options.ariaLabels.right });

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
        
        this.element = switchSection.el;
    }
}