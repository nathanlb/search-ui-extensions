import {
    Component,
    ComponentOptions,
    IComponentBindings,
    $$,
    Initialization,
    Checkbox,
    load,
    l,
    IQueryResult,
    ResultList
} from 'coveo-search-ui';
import { find } from 'underscore';
import { ViewedFilterEvents, IViewedFilterEventArgs } from './Events';
import './Strings';

/**
 * Metadata sent when an analytics event is sent.
 */
export interface IAnalyticsHiddenResultsMeta {
    hiddenResults: boolean;
}

/**
 * Possible options to configure the **ViewedFilter** component.
 */
export interface IViewedFilterOptions extends ComponentOptions {

}

/**
 * The ViewedFilter component allows a user to click a checkbox to
 * hide certain results.
 */
export class ViewedFilter extends Component {
    static ID = 'ViewedFilter';
    private checkbox: Checkbox;
    private resultList: ResultList;

    static options: IViewedFilterOptions = {
    };

    /**
     * Create an instance of ViewedFilter
     * @param element 
     * @param options 
     * @param bindings 
     */
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
        this.initPresentational();
        this.findResultList();
    }

    private initPresentational() {
        const headerSection = $$('div', { className: 'coveo-facet-header' });
        const headerTitleDiv = $$('div', { className: 'coveo-facet-header-title',}).el;
        headerTitleDiv.innerHTML = l('ViewedFilterHeader_Label')
        headerSection.append(headerTitleDiv);

        const valueSection = $$('div', { className: 'coveo-facet-value' });
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
        if (Checkbox === undefined) {
            await load('Checkbox');
        }
        return new Checkbox(this.handleCheckboxChange.bind(this), l('ViewedByCustomerFilter_Label'));
    }

    private findResultList() {
        const resultLists = $$(this.root).findAll(`.${Component.computeCssClassName(ResultList)}`).map(el => <ResultList>Component.get(el, ResultList));
        this.resultList = find(resultLists, resultList => !resultList.disabled);
    }

    private async handleCheckboxChange(checkbox: Checkbox) {
        $$(this.root).trigger(ViewedFilterEvents.Click, { checked: this.checkbox.isSelected() } as IViewedFilterEventArgs);
        this.findResultList();

        if (this.resultList) {
            await this.filterResults(this.resultList).then( async filteredResults => {
                if (filteredResults.length > 0) {
                    await this.resultList.renderResults(filteredResults, false);
                }
            });
        }
    }

    private async filterResults(resultList: ResultList) {
        const resultElements: HTMLElement[] = [];
        const results: IQueryResult[] = resultList.getDisplayedResults();
        console.log(this.resultList.getDisplayedResults());
        await Promise.all(results.map( async result => {
            if (!result.isUserActionView) {
                await resultList.buildResult(result).then( builtResult => {
                    resultElements.push(builtResult);
                });
            }
        }));
        return resultElements;
    }
}

Initialization.registerAutoCreateComponent(ViewedFilter);