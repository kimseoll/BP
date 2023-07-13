/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-23-2023
 * @last modified by  : seol.kim@dkbmc.com
**/

/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-23-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public class ClonContactBatch implements Database.Batchable<SObject>, Database.Stateful {
    
    /* Database.executeBatch(new ClonContactBatch());
    Database.executeBatch(new ClonContactBatch(), 100); */    
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        String query = 'SELECT Id, ' +
                            'cContact__c, ' +
                            'Account.cAccount__c, ' +
                            'ReportsTo.cContact__c, ' +
                            'Salutation, ' +
                            'LastName, ' +
                            'FirstName, ' +
                            'AccountId, ' +
                            'Title, ' +
                            'Department, ' +
                            'Birthdate, ' +
                            'ReportsToId, ' +
                            'LeadSource, ' +
                            'Prequalified__c,  ' +
                            'Phone, ' +
                            'HomePhone, ' +
                            'MobilePhone, ' +
                            'OtherPhone, ' +
                            'Fax, ' +
                            'Email, ' +
                            'AssistantName, ' +
                            'AssistantPhone, ' +
                            'Description '  +
                        'FROM Contact';
        return Database.getQueryLocator(query);
    }


    public void execute(Database.BatchableContext bc, List<Contact> conList) {
        
        //INSERT + UPDATE
        
        List<cContact__c> cConList = new List<cContact__c>();

        for(Contact con : conList){
            if(con.cContact__c == null){
                cContact__c cCon = new cContact__c();
                cCon.Name = con.LastName;
                cCon.Salutation__c = con.Salutation;
                cCon.First_Name__c = con.FirstName ;
                cCon.Contact__c = con.Id;
                cCon.cAccountId__c = con.Account.cAccount__c;
                cCon.Title__c = con.Title;
                cCon.Department__c = con.Department;
                cCon.Birthdate__c = con.Birthdate;
                //cCon.ReportsToId__c = con.ReportsTo.cContact__c;
                cCon.Lead_Source__c = con.LeadSource;
                cCon.Prequalified__c = con.Prequalified__c;
                cCon.Phone__c = con.Phone;
                cCon.Home_Phone__c = con.HomePhone;
                cCon.Mobile__c = con.MobilePhone;
                cCon.Other_Phone__c = con.OtherPhone;
                cCon.Fax__c = con.Fax;
                cCon.Email__c = con.Email;
                cCon.Assistant__c = con.AssistantName;
                cCon.Asst_Phone__c = con.AssistantPhone;
                cCon.Description__c = con.Description;
                cConList.add(cCon);
                System.debug(cConList.size());
                
            } else if (con.cContact__c != null) {
                cContact__c cCon = new cContact__c();
                cCon.Id = con.cContact__c;
                cCon.Salutation__c = con.Salutation;
                cCon.Name = con.LastName;
                cCon.First_Name__c = con.FirstName ;
                cCon.Contact__c = con.Id;
                cCon.cAccountId__c = con.Account.cAccount__c;
                cCon.Title__c = con.Title;
                cCon.Department__c = con.Department;
                cCon.Birthdate__c = con.Birthdate;
                //cCon.ReportsToId__c = con.ReportsTo.cContact__c;
                cCon.Lead_Source__c = con.LeadSource;
                cCon.Prequalified__c = con.Prequalified__c;
                cCon.Phone__c = con.Phone;
                cCon.Home_Phone__c = con.HomePhone;
                cCon.Mobile__c = con.MobilePhone;
                cCon.Other_Phone__c = con.OtherPhone;
                cCon.Fax__c = con.Fax;
                cCon.Email__c = con.Email;
                cCon.Assistant__c = con.AssistantName;
                cCon.Asst_Phone__c = con.AssistantPhone;
                cCon.Description__c = con.Description;
                cConList.add(cCon);
            }
        }
        try {
            if(cConList.size()>0){
                System.debug(cConList.size());
                upsert cConList;

                Map<String,String> updateData = new Map<String,String>();
                List<Contact> updateList = new List<Contact>();

                for (cContact__c cc : cConList) {
                    updateData.put(cc.Contact__c, cc.Id);
                }
                for(Contact con : conList){
                    Contact co = new Contact();
                    co.Id = con.Id;
                    co.cContact__c = updateData.get(con.Id);
                    updateList.add(co);
                }
                UPDATE updateList;
                System.debug(updateList);
                System.debug(updateList.size());
            }
        } catch (Exception e) {
            System.debug(e);    
        }

        //DELETE
        List<cContact__c> cList = [SELECT id FROM cContact__c WHERE contact__c = null];
        delete cList;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('@@ Batch job completed');
    }
}