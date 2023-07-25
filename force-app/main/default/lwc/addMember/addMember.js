import { LightningElement, api, wire  } from 'lwc';
import { getRecord} from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCase from '@salesforce/apex/caseTeamController.getCase';

export default class AddMember extends NavigationMixin (LightningElement)  {
    @api recordId;
    @api objectApiName;
   

    connectedCallback(){
        console.log(this.recordId);
    }





    @wire(getRecord,{  recordId: '$recordId' })
    CaseTeamMember__c;



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