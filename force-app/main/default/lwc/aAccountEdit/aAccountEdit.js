import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// import NAME_FIELD from '@salesforce/schema/aAccount__c.Name';

// const fields = [NAME_FIELD];


export default class AAccountEdit extends NavigationMixin (LightningElement)  {
    @api recordId;
    @api objectApiName;
    //@wire(getRecord, { recordId: '$recordId', fields })

    aAccount__c;
    loadMore = false;

    saveAndNew = false;

    // get name(){
    //     return getFieldValue(this.aAccount__c.data, NAME_FIELD);
    // }

  

    connectedCallback(){
        console.log(this.recordId);
    }

    test(){
        this.loadMore = true;
    }

       // close 버튼 누를때
       closeModal() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'aAccount__c',
                actionName: 'view'
            },
        });
    }


    handleSave() {
      this.saveAndNew = false;
      this.handleRecordSave();
    }
    
    handleSaveAndNew() {
      this.saveAndNew = true;
      this.handleRecordSave();
    }
    
    handleReset(event) {
      const inputFields = this.template.querySelectorAll(
        'lightning-input-field'
      );
      console.log(inputFields);
      console.log(event);
      
      if (inputFields) {
        inputFields.forEach(field => {
          field.reset();
          console.log(field);
        });
      }
    }
    
    handleSuccess() {
      if(this.saveAndNew){
        this.handleReset();
      } else{
        this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
            recordId: this.recordId,
            objectApiName: 'aAccount__c',
            actionName: 'view'
          },
        });
      }
    }
    
    handleRecordSave() {
        //         this[NavigationMixin.Navigate]({
        //     type: 'standard__recordPage',
        //     attributes: {
        //         recordId: this.recordId,
        //         objectApiName: 'aAccount__c',
        //         actionName: 'view'
        //     },
        // });
        //this.fields
      this.template.querySelector('lightning-record-edit-form').submit();
    }



    // // Save&New 버튼 누를때
    // SaveAndNew(event) {
    //     // Success Account "ㅎㅎㅎ" was created.
    //     event.preventDefault();
    //     var eventFields = event.getParam("fields");

    //     this[NavigationMixin.Navigate](this.accountHomePageRef);
    // }

    // //Save 버튼 누를때
    // AccountSave(event) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: event.detail.id,
    //             objectApiName: 'aAccount__c',
    //             actionName: 'view'
    //         },
    //     });
    // }

    reset(){
        this.loadMore = false;
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
          );
          console.log(inputFields);
          
          if (inputFields) {
            inputFields.forEach(field => {
              field.reset();
              console.log(field);
            });
          }
          this.loadMore = true;
    }
}