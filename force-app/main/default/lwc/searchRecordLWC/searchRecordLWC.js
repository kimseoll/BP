import { LightningElement, wire, api, track } from "lwc";
import getCases from "@salesforce/apex/SearchRecordsController.getCases";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from 'lightning/uiRecordApi';
import { getPicklistValues, getObjectInfo  } from "lightning/uiObjectInfoApi";
import STATUS_FIELD from "@salesforce/schema/aCase__c.Status__c";
import PRIORITY_FIELD from "@salesforce/schema/aCase__c.Priority__c";
import ACASE__C_OBJECT from "@salesforce/schema/aCase__c"

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
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
        sortable: true
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'picklist',
        sortable: true
    },
    {
        label: 'Priority',
        fieldName: 'Priority__c',
        type: 'picklist',
        sortable: true
    },

   
    // {
    //     label: 'Account Name',
    //     fieldName: 'AccountId__r.Name',
    //     type: 'text',
    //     sortable: true
    // },
    // {
    //     label: 'Contact Name',
    //     fieldName: 'ContactId__r.Name',
    //     type: 'text',
    //     sortable: true
    // },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class SearchRecordLWC extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    caseList; // data
    editId; // 전역변수
    record = {};
    modal = false;
    editModal = false;
    @track currentRecordId;

    @track sortBy;
    @track sortDirection;

   
    error;
    columns = columns;
    searchString;


    statusPickListValues;
    priorityPickListValues;


    caseNumber = "";
    accountName = "";
    contactName = "";
    subject = "";
    status = null;
    priority = null;

    @wire(getCases, {
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
            data.forEach( (record) => {

                let tempRec = Object.assign( {}, record );
                tempRec.CaseNumber = '/lightning/r/aCase__c/' + tempRec.Id + '/view';
                console.log(' tempRec' + JSON.stringify(tempRec)); ;
               
                tempRecs.push( tempRec );
            });
            this.caseList = tempRecs;
            this.error = error;

        } else if (error) {

            this.error = error;
            this.caseList = undefined
        }
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





    // STATUS_FIELD 픽리스트 값 가져오기
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
    // PRIORITY_FIELD 픽리스트 값 가져오기
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