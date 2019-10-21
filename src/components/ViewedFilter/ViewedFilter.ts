import {
    Component,
    ComponentOptions,
    IComponentBindings,
    $$,
    Initialization,
    Checkbox,
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
import { SwitchToggle, ISwitchToggleOptions, SwitchState } from '../SwitchToggle/SwitchToggle'
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
    private switch: SwitchToggle;
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
        this.buildContent();
        this.getResultList();
    }

    private buildContent() {
        const headerSection = $$('div', { className: 'coveo-facet-header' });
        const headerTitleDiv = $$('div', { className: 'coveo-facet-header-title',}).el;
        headerTitleDiv.innerHTML = l('ViewedFilterHeader_Label')
        headerSection.append(headerTitleDiv);

        const valueSection = $$('div', { className: 'coveo-facet-value' });
        const labelDiv = $$('label', {
            className: 'coveo-facet-value-label-wrapper'
        }).el;
        valueSection.append(labelDiv);

        this.switch = this.createSwitchToggle()
        headerSection.append(this.switch.getElement());

        this.element.append(headerSection.el);
    }

    private createSwitchToggle(): SwitchToggle {
        const options: ISwitchToggleOptions = {
            ariaLabels: {
                main: 'Toggle visibility for results viewed by customer.',
                left: 'Hide',
                center: 'Show all',
                right: 'Only show'
            }
        }
        return new SwitchToggle( this.handleSwitchChange.bind(this), options);
    }

    private getResultList() {
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

    private async handleSwitchChange(switchToggle: SwitchToggle) {
        $$(this.root).trigger(ViewedFilterEvents.Click, { switchState: switchToggle.getValue() } as IViewedFilterEventArgs);
        this.getResultList();

        if (this.resultList) {
            await this.filterResults(this.resultList, this.switch.getValue()).then( async filteredResults => {
                await this.resultList.renderResults(filteredResults);
            });
        }
    }

    private async filterResults(resultList: ResultList, switchState: SwitchState) {
        const resultElements: HTMLElement[] = [];
        const results: IQueryResult[] = [...resultList.getDisplayedResults()];
        resultList.getDisplayedResults().length = 0;    // Empty list of displayed results

        switch(switchState) {
            case SwitchState.LEFT:
                await Promise.all(results.map( async result => {
                    if (!result.isUserActionView) {
                        await resultList.buildResult(result).then( builtResult => {
                            resultElements.push(builtResult);
                        });
                    }
                }));
                return resultElements;
            case SwitchState.CENTER:
                return await resultList.buildResults(this.allResults);
            case SwitchState.RIGHT:
                await Promise.all(results.map( async result => {
                    if (result.isUserActionView) {
                        await resultList.buildResult(result).then( builtResult => {
                            resultElements.push(builtResult);
                        });
                    }
                }));
                return resultElements;
        }
    }
}

Initialization.registerAutoCreateComponent(ViewedFilter);