import { LightningElement, api, wire, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import SUBJECT_FIELD from '@salesforce/schema/aCase__c.Subject__c';
import PRIORITY_FIELD from '@salesforce/schema/aCase__c.Priority__c';
import STATUS_FIELD from '@salesforce/schema/aCase__c.Status__c';
import CASE_NUMBER_FIELD from '@salesforce/schema/aCase__c.Name';
import getCase from '@salesforce/apex/caseTeamController.getCase';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: 'Team Member Name', fieldName: 'Name', type: 'text' },
    {label: 'User/Group ID', fieldName: 'linkName', type: 'url', sortable : true, wrapText: true, 
    typeAttributes: {label: { fieldName: 'UserOrGroupId__c' }, target: '_blank' }},
    { label: 'Case Access', fieldName: 'AccessLevel__c'},
    { label: 'RowCause', fieldName: 'RowCause__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];



export default class CaseView extends LightningElement {

    @api recordId;
    @track data = [];
    caseList;
    columns = columns;
    tempRec;
    records;
    error;
    modal = false;
    editModal = false;
    deleteModal = false;
    AddMemberModal = false;

    // close case 모달 창 열기
    openModal() {
        this.modal = true;
        console.log('modal =>' + modal);
    }

    // close case 모달 창 닫기
    closeModal() {
        this.modal = false;
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

    // 삭제버튼 모달 창 열기
    openDeleteModal(){
        this.deleteModal = true;
        console.log('deleteModal =>' + this.deleteModal);
    }
    // 삭제버튼 모달 창 닫기
    closeDeleteModal(){
        this.deleteModal = false;
        console.log('deleteModal =>' + this.deleteModal);
    }

    // add Mmeber 모달 창 열기
    openAddMember() {
        this.AddMemberModal = true;
        console.log('AddMemberModal =>' + AddMemberModal);
    }

    // add Mmeber 모달 창 닫기
    closeAddMember() {
        this.AddMemberModal = false;
        onsole.log('AddMemberModal =>' + AddMemberModal);
    }







    // 헤더 부분 데이터 가져오기
    @wire(getRecord, { recordId: '$recordId', fields: [SUBJECT_FIELD, PRIORITY_FIELD, STATUS_FIELD, CASE_NUMBER_FIELD] })
    aCase__c;

    get Subject__c(){
        return getFieldValue(this.aCase__c.data, SUBJECT_FIELD);
    }
    get Priority__c(){
        return getFieldValue(this.aCase__c.data, PRIORITY_FIELD);
    }
    get Status__c(){
        return getFieldValue(this.aCase__c.data, STATUS_FIELD);
    }
    get Name(){
        return getFieldValue(this.aCase__c.data, CASE_NUMBER_FIELD);
    }


    // 팀멤버 가져오기

    @api objectApiName;
    @track error;
    @track accList ;
    @wire(getCase, {ParentId: '$recordId'})
    wiredCases({
        error,
        data
    }) {
        if (data) {
            let tempRecs = [];
            data.forEach( ele => {
                let tempRec = Object.assign( {}, ele );

                if (tempRec.UserOrGroupId__c) {
                    tempRec.linkName = "/" + tempRec.UserOrGroupId__c;  
                    tempRec.UserOrGroupId__c = tempRec.UserOrGroupId__r.Name;
                }
                    tempRecs.push(tempRec);
                    console.log(' tempRec' + JSON.stringify(tempRec)); ;
            });

            this.caseList = tempRecs;
        } else if (error) {
            this.error = error;
        }
       
    }

       //액션 이벤트
       handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;

            default:
        }
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






}