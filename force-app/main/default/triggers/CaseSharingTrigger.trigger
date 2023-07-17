/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 07-17-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
trigger CaseSharingTrigger on CaseTeamMember__c (after insert, after delete) {


    if(trigger.isInsert){
        List<aCase__Share> jobShrs = new List<aCase__Share>();

        aCase__Share hmShr;

        for(CaseTeamMember__c job : trigger.new){
            hmShr = new aCase__Share();

            hmShr.parentId = job.ParentId__c;

            hmshr.AccessLevel = job.AccessLevel__c;

            hmShr.RowCause = Schema.aCase__Share.RowCause.Manual;

            hmShr.UserOrGroupId = job.UserOrGroupId__c;

            jobShrs.add(hmShr);
        }

        Database.SaveResult[] lsr = Database.insert(jobShrs,false);

        Integer i=0;

        for(Database.SaveResult sr : lsr){
            if(!sr.isSuccess()){
                // Get the first save result error
                Database.Error err = sr.getErrors()[0];
                
                // Check if the error is related to a trivial access level
                // Access levels equal or more permissive than the object's default 
                // access level are not allowed. 
                // These sharing records are not required and thus an insert exception is 
                // acceptable. 
                if(!(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  
                                               &&  err.getMessage().contains('AccessLevel'))){
                    // Throw an error when the error is not related to trivial access level.
                    trigger.newMap.get(jobShrs[i].ParentId).
                      addError(
                       'Unable to grant sharing access due to following exception: '
                       + err.getMessage());
                }
            }
            i++;
        }
    }

    //SELECT Id,[ParentId],RowCause,UserOrGroupId FROM [shareObject] WHERE UserOrGroupId IN [userOrGroupIdList] AND RowCause != 'Owner' AND RowCause != 'Rule' AND RowCause != 'GuestRule'


    if(Trigger.isDelete){

    }
}