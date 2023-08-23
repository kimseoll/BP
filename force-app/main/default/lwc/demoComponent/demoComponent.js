import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import updateFiles from '@salesforce/apex/demoComponentController.updateFiles';
import getFiles from '@salesforce/apex/demoComponentController.getFiles';

const columns =[
    {label: 'Title' , fieldName: 'Title', type: 'text'},
    {label: 'FileType' , fieldName: 'FileType', type: 'text'},
    {label: 'CreatedDate' , fieldName: 'CreatedDate', type: 'date'}
];



export default class DemoComponent extends LightningElement {

    @api pickListName;
    @api recordId;
    @api contentVersionId;
    @track lstAllFiles;
    @track error;
    columns = columns;
    saveFile;

    data = []; // 데이터 테이블 데이터
    totalCount = 0; // 카테고리 별 파일 개수
    colums; // 열 정보 보유
    
    get acceptedFormats() {
        return ['.pdf','.png','.jpg'];
    }


    @wire(getFiles)wireData(result){
        this.wireData = result;
        if(result.data){
            this.data = JSON.parse(JSON.stringify(result.data));
            console.log('result.data => ' + result.data);
        }else if(result.error){
            this.data = undefined;
        }
    };


    handleUploadFinished(event) {
        const linkedinEntityId = this.recordId;  
        const uploadedFiles = event.detail.files;

        console.log('event.detail.files => ' + JSON.stringify(event.detail.files));
        console.log('this.recordId => ' + this.recordId);

      

        updateFiles({uploadedFiles : JSON.stringify(uploadedFiles), pickListName: this.pickListName})
        console.log('uploadedFiles => ' + JSON.stringify(uploadedFiles));
        console.log('this.pickListName => ' + JSON.stringify(this.pickListName));
            // .then(result=>{
            //     this.data = result; 
            //     this.error = undefined;
            // }).catch(error=>{
            //     this.data = undefined; 
            //     this.error = error;
            // })
  
    }


}