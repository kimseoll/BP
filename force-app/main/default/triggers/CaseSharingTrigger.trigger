/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 07-18-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
trigger CaseSharingTrigger on CaseTeamMember__c (after insert, after delete) {

    List<aCase__Share> shareList = new List<aCase__Share>();
    List<CaseTeamMember__c> toProcess = null;

    switch on Trigger.operationType {
        when AFTER_INSERT {
            toProcess = Trigger.new;
            insertValue();
        }
        when AFTER_DELETE {
            toProcess = Trigger.old;
            deleteValue();
        }
    }



    public Static void insertValue(){
        List<aCase__Share> caseShares = new List<aCase__Share>();
        for(CaseTeamMember__c aCase : toProcess){
            aCase__Share casejRecord = new aCase__Share();
            casejRecord.parentId = aCase.ParentId__c;
            casejRecord.AccessLevel = aCase.AccessLevel__c;
            casejRecord.RowCause = Schema.aCase__Share.RowCause.Manual;
            casejRecord.UserOrGroupId = aCase.UserOrGroupId__c;
            caseShares.add(casejRecord);
        }
        if (caseShares.size()>0) {
            System.debug('caseShares=>' + caseShares);
            insert caseShares;
        }
    }

    public Static void deleteValue(){
        set<Id> relatedCase = new set<Id>();
        set<Id> ParentCase = new set<Id>();

        for(CaseTeamMember__c aCase : toProcess){
    
                relatedCase.add(aCase.UserOrGroupId__c);
                ParentCase.add(aCase.ParentId__c);
              
          
        }
        System.debug('relatedCase =>' + relatedCase);



        List<aCase__Share> delCaseList = [SELECT id, ParentId, RowCause, UserOrGroupId FROM aCase__Share WHERE UserOrGroupId  IN : relatedCase  AND ParentId IN : ParentCase];
        System.debug('delCaseList =>' + delCaseList);


        if(delCaseList.size()>0){
            System.debug('delCaseList=>' + delCaseList);
            delete delCaseList;
        }
    }
}



  