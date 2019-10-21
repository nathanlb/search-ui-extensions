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
    IQueryResults,
    ResultList,
    QueryStateModel,
    QueryEvents,
    Assert,
    IQuerySuccessEventArgs
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

    static options: IViewedFilterOptions = {};
    private allResults: IQueryResults;

    /**
     * Create an instance of ViewedFilter
     * @param element 
     * @param options 
     * @param bindings 
     */
    constructor(public element: HTMLElement, public options: IViewedFilterOptions, public bindings?: IComponentBindings) {
        super(element, ViewedFilter.ID, bindings);

        this.options = ComponentOptions.initComponentOptions(element, ViewedFilter, options);

        this.queryStateModel.registerNewAttribute(QueryStateModel.getFacetId(ViewedFilter.ID), false);
        this.bind.onRootElement(QueryEvents.querySuccess, this.handleQuerySuccess.bind(this));
        //this.bind.onQueryState('change:', QueryStateModel.getFacetId(ViewedFilter.ID), this.handleQueryStateChange.bind(this)); // ?

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

    private handleQuerySuccess(data: IQuerySuccessEventArgs) {
        Assert.exists(data);
        Assert.exists(data.results);
        if (this.resultList) {
            this.allResults = data.results;
        }
        else {
            // TODO throw error
        }
    }

    private async handleCheckboxChange(checkbox: Checkbox) {
        $$(this.root).trigger(ViewedFilterEvents.Click, { checked: this.checkbox.isSelected() } as IViewedFilterEventArgs);
        this.findResultList();

        if (this.resultList) {
            await this.filterResults(this.resultList, checkbox.isSelected()).then( async filteredResults => {
                await this.resultList.renderResults(filteredResults);
                console.log(this.resultList.getDisplayedResults());
            });
        }
    }

    private async filterResults(resultList: ResultList, hideVBC: boolean) {
        const resultElements: HTMLElement[] = [];
        const results: IQueryResult[] = [...resultList.getDisplayedResults()];
        resultList.getDisplayedResults().length = 0;    // Empty list of displayed results

        switch(hideVBC) {
            case true:
                await Promise.all(results.map( async result => {
                    if (!result.isUserActionView) {
                        await resultList.buildResult(result).then( builtResult => {
                            resultElements.push(builtResult);
                        });
                    }
                }));
                return resultElements;
            case false:
                return await resultList.buildResults(this.allResults);
        }
        
    }
}

Initialization.registerAutoCreateComponent(ViewedFilter);