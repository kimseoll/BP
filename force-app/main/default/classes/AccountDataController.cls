/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 07-26-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public class AccountDataController {
 
    @AuraEnabled (cacheable=true)
    public static List<Contact> fetchContact(){
        return [SELECT Id, Name, Account.Name, AccountId, Email 
                FROM Contact];       
    }
}