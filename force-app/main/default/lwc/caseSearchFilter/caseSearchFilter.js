import { LightningElement, wire } from 'lwc';
// 게시 및 메시지 채널에 필요한 메시지 서비스 기능 가져오기
import { publish, MessageContext } from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';
import { getPicklistValues, getObjectInfo  } from "lightning/uiObjectInfoApi";
import STATUS_FIELD from "@salesforce/schema/aCase__c.Status__c";
import PRIORITY_FIELD from "@salesforce/schema/aCase__c.Priority__c";
import ACASE__C_OBJECT from "@salesforce/schema/aCase__c";

const DELAY = 350;

export default class CaseSearchFilter extends LightningElement {
    caseNumber = '';
    subject = '';
    accountName = '';
    contactName = '';
    status = null;
    priority = null;

    // 검색 픽리스트
    statusPickListValues;
    priorityPickListValues;

    @wire(MessageContext)
    messageContext;


    handleReset() {
        this.caseNumber = '';
        this.subject = '';
        this.accountName = '';
        this.contactName = '';
        this.status = null;
        this.priority = null;
        this.fireChangeEvent();

    }

    handleCaseNumberChange(event) {
        this.caseNumber = event.detail.value;
        this.fireChangeEvent();
    }

    handleSubjectChange(event) {
        this.subject = event.detail.value;
        this.fireChangeEvent();
    }

    handleAccountChange(event) {
        this.accountName = event.detail.value;
        this.fireChangeEvent();
    }

    handleContactChange(event) {
        this.contactName = event.detail.value;
        this.fireChangeEvent();
    }
    handleStatusChange(event){
        this.status = event.detail.value;
        this.fireChangeEvent();
    }
    handlePriorityChange(event){
        this.priority = event.detail.value;
        this.fireChangeEvent();
    }


    // STATUS_FIELD 검색 시 픽리스트 값 가져오기
    @wire(getObjectInfo, { objectApiName: ACASE__C_OBJECT })
    objectInfo;


    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId', // 마스터 레코드 유형 Id => recordTypeId: "012000000000000AAA"
        fieldApiName: STATUS_FIELD
    })
    statusPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.statusPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }
    // PRIORITY_FIELD 검색 시 픽리스트 값 가져오기
    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: PRIORITY_FIELD
    })
    priorityPickListPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.priorityPickListValues = [
                { label: "All", value: null },
                ...data.values
            ];
        }
    }

    fireChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            const filters = {
                caseNumber: this.caseNumber,
                subject: this.subject,
                accountName : this.accountName,
                contactName : this.contactName,
                status : this.status, 
                priority : this.priority

            };
            publish(this.messageContext, FILTERSCHANGEMC, filters);
        }, DELAY);
    }




}