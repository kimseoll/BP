import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


export default class AAccount extends NavigationMixin (LightningElement) {

    @api recordId;
    @api objectApiName;
    
    redirect = true;
    resetpage = false;

    // close 버튼 누를때
    closeModal() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'aAccount__c',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
        //window.close();
    }

    // Save&New 버튼 누를때
    SaveAndNew() {
        // Success Account "ㅎㅎㅎ" was created.
        this.redirect = false;
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        this.resetpage = true;
    }

    //Save 버튼 누를때
    AccountSave(event) {
        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: 'aAccount__c',
                actionName: 'view'
            },
        });
    }

}