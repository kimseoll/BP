import { LightningElement, track, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import NAME_FIELD from '@salesforce/schema/aContact__c.Name';
import FRIST_NAME_FIELD from '@salesforce/schema/aContact__c.First_Name__c';
import LAST_NAME_NAME_FIELD from '@salesforce/schema/aContact__c.Last_Name__c';
import TITLE_FIELD from '@salesforce/schema/aContact__c.Title__c';
import PHONE_FIELD from '@salesforce/schema/aContact__c.Phone__c';
import saveContacts from '@salesforce/apex/testController.saveContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/testController.getContacts';

export default class TestNew extends NavigationMixin (LightningElement) {
    @track contactList = []; 
    @track index = 0;
    @api recordId;
    @track name = NAME_FIELD;
    @track firstname = FRIST_NAME_FIELD;
    @track name = LAST_NAME_NAME_FIELD;
    @track title = TITLE_FIELD;
    @track phone = PHONE_FIELD;
    isLoaded = false;
    records;
  
    @api record = {    
        First_Name__c : '',
        Last_Name__c : '',
        Phone__c : '',
        Title__c : ''
    }
  
    ac = { 
        First_Name__c : this.firstname,
        Last_Name__c : this.lastname,
        Title__c : this.title,
        Phone__c : this.phone,
        AccountId__c : this.recordId,
        key : ''
    }
  
    connectedCallback(){
        console.log(this.recordId);
        console.log(this.Id);
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


    addRow(){
  
        // this.index++;
        //var i = JSON.parse(JSON.stringify(this.index));
        // var i = this.index;
        
        let newAc = { 
            First_Name__c : '',
            Last_Name__c : '',
            Title__c : '',
            Phone__c : '',
            AccountId__c : this.recordId,
            key : ''
        }
        this.contactList.push(newAc);
        
        console.log('newAc', JSON.parse(JSON.stringify(newAc)));

        /*this.accountList.push ({
            sobjectType: 'Account',
            Name: '',
            AccountNumber : '',
            Phone: '',
            key : i
        });*/
        this.ac.key = i;
        this.contactList.push(JSON.parse(JSON.stringify(this.ac))); //records
        console.log('Enter ',this.contactList);
        
       // this.accountList.push(this.record);
        //console.log(' After adding Record List ', this.accountList);
    }
    
    removeRow(event){
        this.isLoaded = true;
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        if(this.contactList.length>1){
            this.contactList.splice(key, 1);
            this.index--;
            this.isLoaded = false;
        }else if(this.contactList.length == 1){
            this.contactList = [];
            this.index = 0;
            this.isLoaded = false;
        }
  
        //this.dispatchEvent(new CustomEvent('deleterow', {detail: this.index}));
        //console.log(' After adding Record List ', this.dispatchEvent);
    } 
  
    
  
    handleLastNameChange(event) {
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var accountVar = this.contactList[key];
        this.contactList[key].Last_Name__c = event.target.value;

        this.ac.Last_Name__c = event.target.value;
        console.log("name", this.ac.Last_Name__c);
    }

    handleFirstNameChange(event) {
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var accountVar = this.contactList[key];
        this.contactList[key].First_Name__c = event.target.value;

        this.ac.First_Name__c = event.target.value;
        console.log("name", this.ac.First_Name__c);
    }
    
    handleTitleChange(event) {
        this.ac.Title__c = event.target.value;
        console.log("Title__c", this.ac.Title__c);
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var accountVar = this.contactList[key];
        this.contactList[key].Title__c = event.target.value;
    }
    
    handlePhoneChange(event) {

        this.ac.Phone = event.target.value;
        console.log("Phone__c", this.ac.Phone__c);

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var accountVar = this.contactList[key];
        this.contactList[key].Phone__c = event.target.value;
    }
    
    saveRecord(){        
        saveContacts({acList : this.contactList})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.ac.Last_Name__c = '';
                    this.ac.First_Name__c = '';
                    this.ac.Title__c = '';
                    this.ac.Phone__c = '';
                    this.ac.AccountId__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created successfully',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
                /*console.log(' After adding Record List ', result);
                this.accountList = result;
                console.log(' After adding Record List ', this.accountList);*/
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
      
  }