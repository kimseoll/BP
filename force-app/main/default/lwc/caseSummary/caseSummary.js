import { LightningElement, wire, api } from 'lwc';

// Lightning Message Service and a message channel
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import CASE_SELECTED_MESSAGE from '@salesforce/messageChannel/CaseSelected__c';

// Utils to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';

// aCase__c Schema
import ACASE_OBJECT from '@salesforce/schema/aCase__c';
import CASENUMBER_FIELD from '@salesforce/schema/aCase__c.Name';
import SUBJECT_FIELD from '@salesforce/schema/aCase__c.Subject__c';
import ACCOUNTNAME_FIELD from '@salesforce/schema/aCase__c.AccountId__c';
import CONTACT_FIELD from '@salesforce/schema/aCase__c.ContactId__c';
import STATUS_FIELD from '@salesforce/schema/aCase__c.Status__c';
import PRIORITY_FIELD from '@salesforce/schema/aCase__c.Priority__c';
import CASEORIGIN_FIELD from '@salesforce/schema/aCase__c.CaseOrigin__c';
import OWNERNAME_FIELD from '@salesforce/schema/aCase__c.OwnerId';



/**
 * Component to display details of a aCase__c.
 */

export default class CaseSummary extends NavigationMixin(LightningElement) {

    // Exposing fields to make them available in the template
    subjectField = SUBJECT_FIELD;
    accountNameField = ACCOUNTNAME_FIELD;
    contactNameField = CONTACT_FIELD;
    statusField = STATUS_FIELD;
    priorityField = PRIORITY_FIELD;
    caseOrigin = CASEORIGIN_FIELD;
    ownerName = OWNERNAME_FIELD;

    // Id of aCase__c to display
    @api recordId;

    // Product fields displayed with specific format
    caseNumber;


    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductSelected Lightning message */
    caseSelectionSubscription;

    connectedCallback() {
        // Subscribe to ProductSelected message
        this.caseSelectionSubscription = subscribe(
            this.messageContext,
            CASE_SELECTED_MESSAGE,
            (message) => this.handleCaseSelected(message)
        );
    }

    handleRecordLoaded(event) {
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.caseNumber = getFieldValue(recordData, CASENUMBER_FIELD);

    }

    /**
     * Handler for when a product is selected. When `this.recordId` changes, the
     * lightning-record-view-form component will detect the change and provision new data.
     */
    handleCaseSelected(event) {
        console.log('event =>' +JSON.stringify(event));
        this.recordId = event.caseId;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: ACASE_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }






}