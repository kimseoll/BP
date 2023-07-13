import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import SUBJECT_FIELD from '@salesforce/schema/aCase__c.Subject__c';
import PRIORITY_FIELD from '@salesforce/schema/aCase__c.Priority__c';
import STATUS_FIELD from '@salesforce/schema/aCase__c.Status__c';
import CASE_NUMBER_FIELD from '@salesforce/schema/aCase__c.Name';

export default class CaseView extends LightningElement {

    @api recordId;

    records;
    error;
    modal = false;
    editModal = false;
    deleteModal = false;

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


}