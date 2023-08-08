import LightningDatatable from 'lightning/datatable';
import picklistColumn from './picklistColumn.html';
import pickliststatic from './pickliststatic.html'
import lookupColumn from './lookupColumn.html';


export default class CustomDatatable extends LightningDatatable {
    static customTypes = {
        picklistColumn: {
            template: pickliststatic,
            editTemplate: picklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
        },
        lookupColumn: {
            template: lookupColumn,
            standardCellLayout: true,
            typeAttributes: ['value', 'fieldName', 'object', 'context', 'name', 'fields', 'target']
        }
    };
}