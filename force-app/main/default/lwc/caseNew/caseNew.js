import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CaseNew extends NavigationMixin (LightningElement) {
    @api recordId;
    @api objectApiName;
    error;
    records;
    //get all contacts records of Account
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'aContacts__r',
        fields: ['aContacts__r.Email__c','aContacts__r.Phone__c']
    }) contacts({ error, data }){
        if (data) {
            this.records = data.records;
            console.log('data: '+JSON.stringify(data));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    // 모달 창 닫기 & 취소 버튼 클릭 시
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    //Save 버튼 누를때
    saveModal(event) {
        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: 'aCase__c',
                actionName: 'view'
            },
        });
    }
}