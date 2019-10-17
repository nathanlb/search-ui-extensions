import {
    Component,
    ComponentOptions,
    IComponentBindings,
    $$,
    Initialization,
    Checkbox,
    load,
    l,
    IFacetOptions,
} from 'coveo-search-ui';
import { ViewedFilterEvents, IViewedFilterEventArgs } from './Events';
import './Strings';

/**
 * Metadata sent when an analytics event is sent.
 */
export interface IAnalyticsFilteredResultsMeta {
    hiddenResults: boolean;
}

/**
 * Possible options to configure the **ViewedFilter** component.
 */
export interface IViewedFilterOptions extends IFacetOptions {

}

/**
 * The ViewedFilter component allows a user to click a checkbox to
 * hide certain results.
 */
export class ViewedFilter extends Component {
    static ID = 'ViewedFilter';
    private checkbox: Checkbox;

    static options: IViewedFilterOptions = {
    };

    constructor(public element: HTMLElement, public options: IViewedFilterOptions, public bindings?: IComponentBindings) {
        super(element, ViewedFilter.ID, bindings);

        this.options = ComponentOptions.initComponentOptions(element, ViewedFilter, options);

        this.initialize();
    }

    public isSelected(): boolean {
        return this.checkbox && this.checkbox.isSelected();
    }

    public toggle(): void {
        if (this.isSelected()) {
            this.checkbox.reset();
        } else {
            this.checkbox.select(true);
        }
    }

    protected initialize(): void {
        const headerSection = $$('div', { className: 'coveo-facet-header' });
        const headerTitleDiv = $$('div', {
            className: 'coveo-facet-header-title',
        }).el;
        headerTitleDiv.innerHTML = l('ViewedFilterHeader_Label')
        headerSection.append(headerTitleDiv);

        const valueSection = $$('div', { className: 'coveo-facet-value' } );
        const labelDiv = $$('label', {
            className: 'coveo-facet-value-label-wrapper'
        }).el;
        valueSection.append(labelDiv);

        this.createCheckbox().then(checkbox => {
            this.checkbox = checkbox;
            labelDiv.appendChild(this.checkbox.getElement());
        });

        this.element.append(headerSection.el);
        this.element.append(valueSection.el);
    }

    private async createCheckbox(): Promise<Checkbox> {
        if (Coveo.Checkbox === undefined) {
            await load('Checkbox');
        }
        return new Checkbox(this.handleCheckboxChange.bind(this), l('ViewedByCustomerFilter_Label'));
    }

    private handleCheckboxChange(checkbox: Checkbox) {
        Coveo.$$(this.root).trigger(ViewedFilterEvents.Click, { checked: this.checkbox.isSelected() } as IViewedFilterEventArgs);
    }
}

Initialization.registerAutoCreateComponent(ViewedFilter);