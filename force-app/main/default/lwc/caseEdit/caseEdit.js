import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import EMAIL_FIELD from '@salesforce/schema/aCase__c.ContactId__r.Email__c';
import PHONE_FIELD from '@salesforce/schema/aCase__c.ContactId__r.Phone__c';
import { CloseActionScreenEvent } from 'lightning/actions';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseEdit extends LightningElement {
    @api recordId;
    @api objectApiName;

    @wire(getRecord,{  recordId: '$recordId', fields: [EMAIL_FIELD, PHONE_FIELD] })
    aCase__c;

    get email(){
        return getFieldValue(this.aCase__c.data, EMAIL_FIELD);
    }

    get phone(){
        return getFieldValue(this.aCase__c.data, PHONE_FIELD);
    }

    // 모달 창 닫기 & 취소 버튼 클릭 시
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
    // 저장 버튼 클릭 시
    saveModal(e) {
        // Close the modal window and display a success toast
        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated!',
                variant: 'success'
            })
        );
        window.location.reload(); //새로고침
    }

}