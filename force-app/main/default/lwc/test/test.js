import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getContacts from '@salesforce/apex/testController.getContacts';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

import ACONTACT_OBJECT from "@salesforce/schema/aContact__c"; // import object
import AC_NAME from "@salesforce/schema/aContact__c.Last_Name__c"; // import fields
import AC_TITLE from "@salesforce/schema/aContact__c.Title__c";
import AC_PHONE from "@salesforce/schema/aContact__c.Phone__c";
// import AC_ACCOUNT_NAME from "@salesforce/schema/aContact__c.AccountId__c";

import ModalRecordEditForm from "c/modalRecordEditForm";

export default class Test extends NavigationMixin (LightningElement) {
  modal = false;
  // aContactObject = ACONTACT_OBJECT; // object type

  // accountFields = [
  //   AC_NAME,
  //   AC_TITLE,
  //   AC_PHONE,
  //   // AC_ACCOUNT_NAME
    
  // ]; // fields to be showin in form
    
    // modalNew
    showPopup(){
      this.modal = true;
      console.log('modal =>',this.modal);
    }

    // async showPopup() {
    //     const recordId = await ModalRecordEditForm.open({
    //       size: "small",
    //       accountFields: this.accountFields
    //     });
    
    //     if (recordId) {
    //       await this.showSuccessToast(recordId);
    //     }
    //   }
    
    //   async showSuccessToast(recordId) {
    //     const evt = new ShowToastEvent({
    //       message: "Contact " + recordId + " was created.",
    //       variant: "success"
    //     });
    //     this.dispatchEvent(evt);
    //   }

//Contact "커피" was created.
// Account created
//Record ID: 0015i00000nyJflAAE

    @api recordId;
    @api name;
  
    @api objectApiName;
    records;
    error;

    ac = { 
      First_Name__c : this.firstname,
      Last_Name__c : this.lastname,
      Name : this.name,
      Title__c : this.title,
      Phone__c : this.phone,
      AccountId__c : this.recordId,
      key : ''
  }
    @wire(getContacts, {accountId: '$recordId'})
    wiredData({error, data}) {
        if(data) {
            this.records = data;
            this.error = undefined;
        } else if(error) {
            this.error = error;
            this.records = undefined;
        }
    }
    
    // viewAllPage
    
    showPage() {
      console.log(this.recordId);
      this[NavigationMixin.Navigate]({
        type : 'standard__recordRelationshipPage',
        attributes: {
            recordId: this.recordId,
            objectApiName: 'aAccount__c',
            relationshipApiName: 'aContacts__r',
            actionName: 'view'
        }
    });
  }
  //   showPage(event) {

  //     const defaultValues = encodeDefaultFieldValues({
  //       AccountId__c : recordId
  //     });
  //     console.log("defaultValues" + defaultValues);

  //     this[NavigationMixin.Navigate]({
  //         type: 'standard__component',
  //         attributes: {
  //           recordId: event.detail.id,
  //           objectApiName: 'aContact__c',
  //           actionName: 'new',
  //             //Here customLabelExampleAura is name of lightning aura component
  //             //This aura component should implement lightning:isUrlAddressable
  //           componentName: 'c__AccountViewAll'
  //         },
  //         state: {
  //           defaultFieldValues: defaultValues
  //       }
  //   });
  // }
}