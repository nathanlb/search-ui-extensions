import {
    ComponentOptions,
    IComponentBindings,
    $$,
    Initialization,
    Checkbox,
    load,
    l,
    Facet,
    IFacetOptions,
    ResponsiveFacets,
} from 'coveo-search-ui';
import { ViewedFilterEvents, IViewedFilterEventArgs } from './Events';
import './Strings';

/**
 * Metadata sent when an analytics event is sent.
 */
export interface IAnalyticsFilteredResultsMeta {
    filteredResults: boolean;
}

/**
 * Possible options to configure the **ViewedFilter** component.
 */
export interface IViewedFilterOptions extends IFacetOptions {
    /** Specifies the text displayed next to the checkbox. */
    text?: string;
    /** The field on which to filter results using the values provided. */
    field?: string;
    /** The function that is called when retrieving uri hashes to filter. */
    getValues?: () => string[];
}

/**
 * The ViewedFilter component allows a user to click a checkbox to
 * search only for matching results.
 */
export class ViewedFilter extends Facet {
    static ID = 'ViewedFilter';
    private checkbox: Checkbox;

    static options: IViewedFilterOptions = {
        text: ComponentOptions.buildStringOption({
            defaultValue: l(`${ViewedFilter.ID}_Label`)
        }),
        field: ComponentOptions.buildStringOption({
            defaultValue: 'urihash'
        }),
        getValues: ComponentOptions.buildCustomOption(name => () => new Array<string>(), {
            defaultFunction: () => () => new Array<string>()
        })
    };

    constructor(public element: HTMLElement, public options: IViewedFilterOptions, public bindings?: IComponentBindings) {
        super(element, ComponentOptions.initComponentOptions(element, ViewedFilter, options), bindings, ViewedFilter.ID);

        this.options.enableFacetSearch = false;
        this.options.enableSettings = false;
        this.options.includeInOmnibox = false;
        this.options.enableMoreLess = false;
        ResponsiveFacets.init(this.root, this, this.options);

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
        const labelDiv = $$('label', {
            className: 'coveo-facet-value-label-wrapper'
        }).el;
        headerSection.append(labelDiv);

        this.createCheckbox().then(checkbox => {
            this.checkbox = checkbox;
            labelDiv.appendChild(this.checkbox.getElement());
        });

        this.element.append(headerSection.el);
        console.log("pooooop")
        console.log(this.element);
    }

    private async createCheckbox(): Promise<Checkbox> {
        if (Coveo.Checkbox === undefined) {
            await load('Checkbox');
        }
        return new Checkbox(this.handleCheckboxChange.bind(this), this.options.text);
    }

    private handleCheckboxChange(checkbox: Checkbox) {
        Coveo.$$(this.root).trigger(ViewedFilterEvents.Click, { checked: this.checkbox.isSelected() } as IViewedFilterEventArgs);
    }
}

Initialization.registerAutoCreateComponent(ViewedFilter);