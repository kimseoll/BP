import { LightningElement, wire, api, track } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from 'lightning/uiRecordApi';
import { getPicklistValues, getObjectInfo  } from "lightning/uiObjectInfoApi";
import caseSearch from "@salesforce/apex/caseController.caseSearch";
import STATUS_FIELD from "@salesforce/schema/aCase__c.Status__c";
import PRIORITY_FIELD from "@salesforce/schema/aCase__c.Priority__c";
import ACASE__C_OBJECT from "@salesforce/schema/aCase__c";


const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
    { label: 'Card', name: 'card' },
];


const columns = [
    {   label: 'Case Number', 
        fieldName: 'CaseNumber', 
        type: 'url', 
        sortable: true,
        
        typeAttributes: { label: {fieldName: 'Name'}, target:'_blank'} 
    },
    {
        label: 'Subject',
        fieldName: 'Subject__c',
        type: 'text',
        sortable: true,
        editable: true
    },
    {
        label: 'Account Name',
        fieldName: 'AccountId__c', //lookup API field name 
        type: 'lookupColumn',
        sortable: true,
        editable: false,
        typeAttributes: {
            object: 'aCase__c', //object name which have lookup field
            fieldName: 'AccountId__c',  //lookup API field name 
            value: { fieldName: 'AccountId__c' },  //lookup API field name 
            context: { fieldName: 'Id' }, 
            name: 'aAccount__c',  //lookup object API Name 
            fields: ['aAccount__c.Name'], //lookup objectAPIName.Name
            target: '_self',
            fieldApiName : "AccountId__c"
        },
    },
    {
        label: 'Contact Name',
        fieldName: 'ContactId__c', //lookup API field name 
        type: 'lookupColumn',
        sortable: true,
        editable: false,
        typeAttributes: {
            object: 'aCase__c', //object name which have lookup field
            fieldName: 'ContactId__c',  //lookup API field name 
            value: { fieldName: 'ContactId__c' },  //lookup API field name 
            context: { fieldName: 'Id' }, 
            name: 'aContact__c',  //lookup object API Name 
            fields: ['aContact__c.Name'], //lookup objectAPIName.Name
            target: '_self',
            fieldApiName : "ContactId__c"
        },

    },
    {
        label: 'Status', fieldName: 'Status__c', type: 'picklistColumn', sortable: true, editable: true, typeAttributes: {
            placeholder: 'Choose Status', options: { fieldName: 'pickListOptions' }, 
            value: { fieldName: 'Status__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    },
    {
        label: 'Priority', fieldName: 'Priority__c', type: 'picklistColumn', sortable: true, editable: true, typeAttributes: {
            placeholder: 'Choose Priority', options: { fieldName: 'pickList' }, 
            value: { fieldName: 'Priority__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class SearchRecordLWC extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @track caseList; // data
    editId; // 전역변수
    cardId;
    caseId;
    record = {};
    modal = false;
    editModal = false;
    @track currentRecordId;

    @track sortBy;
    @track sortDirection;

    // 데이터 테이블 픽리스트
    @track pickListOptions;
    @track pickList;
    @track accountData;
    lastSavedData = [];
    fldsItemValues = [];
    @track data = [];
    showSpinner = false;
    error;
    columns = columns;
    searchString;
    tempRec;

    // 검색 픽리스트
    statusPickListValues;
    priorityPickListValues;


    caseNumber = "";
    accountName = "";
    contactName = "";
    subject = "";
    status = null;
    priority = null;

    @track draftValues = [];
    @track contactData;
    @track draftValues = [];
    lastSavedD
    ata = [];




// 추가
@wire(getObjectInfo, { objectApiName: ACASE__C_OBJECT })
objectInfo;

//fetch picklist options
@wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: STATUS_FIELD
})

wirePickList({ error, data }) {
    if (data) {
        this.pickListOptions = data.values;
    } else if (error) {
        console.log(error);
    }
}
@wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: PRIORITY_FIELD
})

PickList({ error, data }) {
    if (data) {
        this.pickList = data.values;
    } else if (error) {
        console.log(error);
    }
}





    @wire(caseSearch, {
        caseNumber: "$caseNumber",
        accountName: "$accountName",
        contactName: "$contactName",
        subject: "$subject",
        status: "$status",
        priority: "$priority"
    })
    wiredaCase({
        error,
        data
    }) {
        if (data) {

            let tempRecs = [];
            data.forEach( ele => {
                let tempRec = Object.assign( {}, ele );

                tempRec.pickListOptions = this.pickListOptions;
                tempRec.pickList = this.pickList;

                tempRec.CaseNumber = '/lightning/r/aCase__c/' + tempRec.Id + '/view';
                console.log(' tempRec' + JSON.stringify(tempRec)); ;
    
                // tempRec에서 처리한 데이터를 이용해 연결된 아이디값 가져오기
            //     if (tempRec.AccountId__c) {
            //         tempRec.recordLink = "/" + tempRec.AccountId__c;  
            //         tempRec.AccountId__c = tempRec.AccountId__r.Name;
            //     }
            //    if (tempRec.ContactId__c) {
            //             tempRec.contactLink = "/" + tempRec.ContactId__c;  
            //             tempRec.ContactId__c = tempRec.ContactId__r.Name;
            //     }

                tempRecs.push( tempRec );
               
            });
            
            this.caseList = tempRecs;
            this.error = error;      

        } else if (error) {
            this.error = error;
            this.caseList = undefined
        }
    }


    

    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.data));
 
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
 
        //write changes back to original data
        this.data = [...copyData];
    }
 
    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
 
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }
 
    //listener handler to get the context and data
    //updates datatable, here I used AccountId you can use your look field API name
    lookupChanged(event) {
        console.log('event.detail.data => ' + JSON.stringify(event.detail.data));
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let editValue = dataRecieved.value != undefined ? dataRecieved.value : null;
        let fieldtype = dataRecieved.apiName;
        console.log('fieldtype', fieldtype);

        let updatedItem
        if(fieldtype == 'AccountId__c'){
            updatedItem = { Id: dataRecieved.context, AccountId__c: editValue };
        } else if (fieldtype == 'ContactId__c'){
            updatedItem = { Id: dataRecieved.context, ContactId__c: editValue };
        }

        console.log(updatedItem);
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }

    //handler to handle cell changes & update values in draft values
    handleCellChange(event) {
        this.updateDraftValues(event.detail.draftValues[0]);
    }
 
    handleSave(event) {
        this.showSpinner = true;
        this.saveDraftValues = this.draftValues;
 
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        // Updateing the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log(error);
            this.showToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.draftValues = [];
            this.showSpinner = false;
        });
    }
 
    handleCancel(event) {
        //remove draftValues & revert data changes
        this.data = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
    }
 
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
 
    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.caseList);
    }

    // 정렬
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.caseList));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.caseList = parseData;
    }    




    // STATUS_FIELD 검색 시 픽리스트 값 가져오기
    @wire(getObjectInfo, { objectApiName: ACASE__C_OBJECT })
    objectInfo;


    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId', // 마스터 레코드 유형 Id => recordTypeId: "012000000000000AAA"
        fieldApiName: STATUS_FIELD
    })
    statusPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.statusPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }
    // PRIORITY_FIELD 검색 시 픽리스트 값 가져오기
    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: PRIORITY_FIELD
    })
    priorityPickListPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.priorityPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
        console.log("change =>", this[event.target.name]);
    }

    handleKeyUp(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        let name = event.target.name;

        this.typingTimer = setTimeout(() => {
            this[name] = value;
        }, this.doneTypingInterval);
    }

    // 검색 새로고침
    clearSearch() {
        this.caseNumber = "";
        this.accountName = "";
        this.contactName = "";
        this.subject = "";
        this.status = null;
        this.priority = null;
        this.searchable = this.data;
        this.searchAllValue = "";
        this.searchAll();
    }

    // 검색
    handleSearchAll(event) {
        this.searchAllValue = event.target.value;
        this.searchAll();
    }

    searchAll() {
        let searchStr = this.searchAllValue.toLowerCase();
        const regex = new RegExp(
            "(^" + searchStr + ")|(." + searchStr + ")|(" + searchStr + "$)"
        );
        console.log('regex =>'+regex);
        if (searchStr.length > 2) {
            this.searchable = this.data.filter((item) => {
                if (
                    regex.test(
                        item.caseData.Name.toLowerCase() +
                            " " +
                            item.caseData.Name.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.Status__c?.toLowerCase() +
                            " " +
                            item.caseData.Status__c?.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.Subject__c?.toLowerCase() +
                            " " +
                            item.caseData.Subject__c?.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.AccountId__r?.Name?.toLowerCase() +
                            " " +
                            item.caseData.AccountId__r?.Name?.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.ContactId__r?.Name?.toLowerCase() +
                            " " +
                            item.caseData.ContactId__r?.Name?.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.Priority__c?.toLowerCase() +
                            " " +
                            item.caseData.Priority__c?.toLowerCase()
                    )
                ) {
                    return item;
                }
            });
        } else if (this.caseNumber.length <= 2) {
            this.searchable = this.data;
        }
        console.log(this.searchable);
    }

    //액션 이벤트
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'edit':
                this.editRow(row);
                break;
            default:
        }
    }

    // 액션 이벤트 - 수정
    editRow(row){
        this.editId = row.Id;
        this.openEditModal();
        // this.editModal = true;
        // console.log('editModal =>' + this.editModal);

    }

    // 액션 이벤트 - 삭제
    deleteRow(row) {
        let rowId = row.Id; // 삭제할 해당 아이디 가져오기
        console.log("selected Row " + rowId);

        deleteRecord(rowId)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record deleted',
                    variant: 'success'
                })
            );
            window.location.reload(); //새로고침
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    // 수정버튼 모달 창 열기
    openEditModal(){
        this.editModal = true;
        console.log('editModal =>' + this.editModal);
    }

    // 수정버튼 모달 창 닫기
    closeEditModal(){
        this.editModal = false;
    }



    // new 모달 창 열기
    openModal() {
        this.modal = true;
        console.log('modal =>' + modal);
    }

    // close case 모달 창 닫기
    closeModal() {
        this.modal = false;
    }

}