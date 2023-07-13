/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 07-12-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public with sharing class caseController {

    @AuraEnabled(cacheable=true)
    public static List<aCase__c> fetchAccounts(
        String caseNumber, //name
        String subject,
        String priority,
        String status,
        String accountName, //accountId__c
        String contactName //contactId__c
    ) {
        String query;
        String condition = (String.isNotBlank(caseNumber)
            ? 'Name LIKE \'' + '%' + caseNumber + '%\''
            : '');

        condition += (String.isNotBlank(subject)
            ? (String.isNotBlank(condition) ? +' AND ' : '') +
              ' Subject__c LIKE \'' +
              '%' +
              subject +
              '%\''
            : '');

        condition += (String.isNotBlank(accountName)
            ? (String.isNotBlank(condition) ? +' AND ' : '') +
              ' AccountId__r.Name LIKE \'' +
              '%' +
              accountName +
              '%\''
            : '');

        condition += (String.isNotBlank(contactName)
            ? (String.isNotBlank(condition) ? +' AND ' : '') +
              ' ContactId__r.Name LIKE \'' +
              '%' +
              contactName +
              '%\''
            : '');

        condition += (String.isNotBlank(status)
            ? (String.isNotBlank(condition) ? +' AND ' : '') +
              ' Status__c LIKE \'' +
              '%' +
              status +
              '%\''
            : '');

        condition += (String.isNotBlank(priority)
            ? (String.isNotBlank(condition) ? +' AND ' : '') +
              ' Priority__c LIKE \'' +
              '%' +
              priority +
              '%\''
            : '');

        System.debug('condition ' + condition);
        if (String.isNotBlank(condition)) {
            query =
                'SELECT Name, Status__c, Subject__c, AccountId__c, AccountId__r.Name, ContactId__r.Name, Priority__c FROM aCase__c WHERE ' +
                condition +
                ' ORDER BY Name';
        } else {
            query = 'SELECT Name, Status__c, Subject__c, AccountId__c, AccountId__r.Name, ContactId__r.Name, Priority__c FROM aCase__c ORDER BY Name LIMIT 200';
        }

        List<aCase__c> records = Database.query(query);
        return records;
    }
}