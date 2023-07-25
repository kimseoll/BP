/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 07-24-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public with sharing class caseTeamController {
    @AuraEnabled(cacheable=true)
    public static List<CaseTeamMember__c > getCase(Id ParentId){
        try {
            return [
                SELECT  Id, Name, ParentId__r.Name, ParentId__c, RowCause__c, UserOrGroupId__c,  UserOrGroupId__r.Name, AccessLevel__c
                FROM CaseTeamMember__c 
                WHERE ParentId__c =:ParentId
            ];            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void saveCase(List<CaseTeamMember__c> caseList){
        System.debug(caseList);
    
        Insert caseList;
    }    
}
