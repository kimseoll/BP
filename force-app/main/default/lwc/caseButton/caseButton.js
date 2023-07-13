import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseButton extends LightningElement {
    @api recordId;
    @api objectApiName;

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