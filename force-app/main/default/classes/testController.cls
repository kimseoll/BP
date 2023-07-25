/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 06-20-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public with sharing class testController {
    @AuraEnabled(cacheable=true)
    public static List<aContact__c> getContacts(Id accountId){
        try {
            return [
                SELECT Id, Name, Last_Name__c, First_Name__c, Title__c, Phone__c, AccountId__c
                FROM aContact__c
                WHERE AccountId__c =:accountId
            ];            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void saveContacts(List<aContact__c> acList){
        System.debug(acList);
    
        Insert acList;
    }    
}