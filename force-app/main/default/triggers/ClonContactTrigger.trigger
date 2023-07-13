/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 06-02-2023
 * @last modified by  : seol.kim@dkbmc.com
 **/

/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 06-02-2023
 * @last modified by  : seol.kim@dkbmc.com
 **/
trigger ClonContactTrigger on cContact__c (after insert, after update, before delete) {

//     List<Contact> conList = new List<Contact>();
//     List<cContact__c> toProcess = null;

//     switch on Trigger.operationType {
//         when AFTER_INSERT  {
//             toProcess = Trigger.New;
//             //System.debug(toProcess);
//             upsertValue();
//         }
//         when AFTER_UPDATE {
//             toProcess = Trigger.New;
//             //System.debug(toProcess);
//             upsertValue();
//         }
//         when before_DELETE {
//             toProcess = Trigger.old;
//             // System.debug(toProcess);
//             deleteValue();
//         }
//     }

//     // Public Static void fullName(String firstName, String lastName){
//     //     String space = ' ';
//     //     String fullName = firstName + space + lastName;

//     //     System.debug(fullName);
//     // }


//     public Static void upsertValue(){

//         //con.AccountId
//         Set<Id> AccountId = new Set<Id>();
    
//         for(cContact__c c : toProcess){
//             AccountId.add(c.cAccountId__c);
//         }
    
//         List<Account> InsertAccount = [SELECT Id, cAccount__c FROM Account WHERE cAccount__c IN : AccountId];
//         //System.debug('Insertaccount' + Insertaccount);
//         Map<String,Account> accDataMerge = new Map<String,Account>();
    
//         if(InsertAccount.size()>0){
//             for (Account a : InsertAccount){
//                 accDataMerge.put(a.cAccount__c, a);
//             }
//         }
    
//         //con.ReportsToId
//         Set<Id> ReportsToId = new Set<Id>();
    
//         for(cContact__c c : toProcess){
//             ReportsToId.add(c.ReportsToId__c);
//         }
    
//         List<Contact> InsertReports = [SELECT Id, cContact__c FROM Contact WHERE cContact__c IN : ReportsToId];
//         //System.debug('InsertReports' + InsertReports);
//         Map<String,Contact> reportDataMerge = new Map<String,Contact>();
    
//         if(InsertReports.size()>0){
//             for (Contact t : InsertReports){
//                 reportDataMerge.put(t.cContact__c, t);
//             }
//         }

//         for(cContact__c cCon : toProcess){
//             if(cCon.Contact__c == null){
//                 conList.add(new Contact(cContact__c = cCon.Id,
//                                         LastName = cCon.Name,
//                                         FirstName = cCon.First_Name__c,
//                                         Salutation = cCon.Salutation__c,
//                                         AccountId = accDataMerge?.get(cCon.cAccountId__c)?.Id,
//                                         Title = cCon.Title__c,
//                                         Department = cCon.Department__c,
//                                         Birthdate = cCon.Birthdate__c,
//                                         ReportsToId = reportDataMerge?.get(cCon.ReportsToId__c)?.Id,
//                                         LeadSource = cCon.Lead_Source__c,
//                                         Prequalified__c = cCon.Prequalified__c,
//                                         Phone = cCon.Phone__c,
//                                         HomePhone = cCon.Home_Phone__c,
//                                         MobilePhone = cCon.Mobile__c,
//                                         OtherPhone = cCon.Other_Phone__c,
//                                         Fax = cCon.Fax__c,
//                                         Email = cCon.Email__c,
//                                         AssistantName = cCon.Assistant__c,
//                                         AssistantPhone = cCon.Asst_Phone__c,
//                                         Description = cCon.Description__c
//                                      ));
//             } else if (cCon.Contact__c != null) {
//                 conList.add(new Contact(cContact__c = cCon.Id,
//                                         Id = cCon.Contact__c,
//                                         LastName = cCon.Name,
//                                         FirstName = cCon.First_Name__c,
//                                         Salutation = cCon.Salutation__c,
//                                         AccountId = accDataMerge?.get(cCon.cAccountId__c)?.Id,
//                                         Title = cCon.Title__c,
//                                         Department = cCon.Department__c,
//                                         Birthdate = cCon.Birthdate__c,
//                                         ReportsToId = reportDataMerge?.get(cCon.ReportsToId__c)?.Id,
//                                         LeadSource = cCon.Lead_Source__c,
//                                         Prequalified__c = cCon.Prequalified__c,
//                                         Phone = cCon.Phone__c,
//                                         HomePhone = cCon.Home_Phone__c,
//                                         MobilePhone = cCon.Mobile__c,
//                                         OtherPhone = cCon.Other_Phone__c,
//                                         Fax = cCon.Fax__c,
//                                         Email = cCon.Email__c,
//                                         AssistantName = cCon.Assistant__c,
//                                         AssistantPhone = cCon.Asst_Phone__c,
//                                         Description = cCon.Description__c
//                                     ));
                
//             }
//         }

//         if(conList.size()>0){
//             upsert conList;

//             Map<String,String> updateData = new Map<String,String>();
//             List<cContact__c> updateList = new List<cContact__c>();
//             Boolean isUp = Trigger.isUpdate;

//             for(Contact con : conList){
//                 updateData.put(con.cContact__c, con.Id);
//             }
//             for(cContact__c cCon : toProcess){
//                 if(cCon.Contact__c == null && !isUp){
//                     cContact__c cc = new cContact__c();
//                     cc.Id = cCon.Id;
//                     cc.Contact__c = updateData.get(cCon.Id);
//                     updateList.add(cc);
//                 }
//             }
//             if(updateList.size()>0){
//                 update updateList;
//             }
//         }

//     }
//     //DELETE
//     public Static void deleteValue(){
//         Set<Id> DeleteList = new Set<Id>();
//         for(cContact__c cCon : toProcess){
//             DeleteList.add(cCon.Id);
//         }
//         List<Contact> delConList = [SELECT id FROM Contact WHERE cContact__c IN : DeleteList];
    
//         if(delConList.size()>0){
//             System.debug(delConList);
//             delete delConList;
//         }
//     }
// }
   

// 다른 코드
    // delete
    if(Trigger.isBefore &&Trigger.isDelete){
        Set<Id> DeleteList = new Set<Id>(); 
        System.debug(DeleteList);
        for(cContact__c cCon : Trigger.old){
            DeleteList.add(cCon.Id);
        }

        List<Contact> DelConList = [SELECT id FROM Contact WHERE cContact__c IN : DeleteList];
        
        if(DelConList.size() > 0){
            System.debug(DelConList);
            delete DelConList;
        }
    }


//---------------------------------------------------------------------------

    //UPDATE
    if(Trigger.isAfter && Trigger.isUpdate){

        List<cContact__c> cConWithCon = Trigger.new;
        Set<Id> cCId = new Set<Id>();
        Set<Id> aCId = new Set<Id>();
        Set<Id> rCId = new Set<Id>();
        for(cContact__c c : cConWithCon){
            cCId.add(c.Id);
            aCId.add(c.cAccountId__c);
            rCId.add(c.ReportsToId__c);
        }
        
        Map<Id,cContact__c> upcAccountList = new Map<Id,cContact__c>([SELECT Id,
                                                                            cAccountId__r.Account__c
                                                                        FROM cContact__c
                                                                        WHERE cAccountId__c
                                                                        IN : aCId]);

        Map<Id,cContact__c> upReportsToList = new Map<Id,cContact__c>([SELECT Id,
                                                                        ReportsToId__r.Contact__c 
                                                                FROM cContact__c
                                                                WHERE ReportsToId__c 
                                                                IN : rCId]);

        Map<Id,Contact> upCList = new Map<Id,Contact>([SELECT Id, 
                                                            LastName,
                                                            FirstName,
                                                            Salutation,
                                                            AccountId,
                                                            Title, 
                                                            Department, 
                                                            Birthdate,
                                                            ReportsToId,
                                                            LeadSource,
                                                            Prequalified__c, 
                                                            Phone, 
                                                            HomePhone, 
                                                            MobilePhone,
                                                            OtherPhone,
                                                            Fax,
                                                            Email,
                                                            AssistantName,
                                                            AssistantPhone,
                                                            Description
                                                        FROM Contact 
                                                        WHERE cContact__c 
                                                        IN : cCId]);

        List<Contact> conListUpdate = new List<Contact>();

        for(cContact__c cCon : cConWithCon){
            if (upCList.size()>0) {
                Contact c = upCList.get(cCon.Contact__c);
                c.LastName = cCon.Last_Name__c;
                c.FirstName = cCon.First_Name__c;
                c.Salutation = cCon.Salutation__c;
                //c.cContact__c = cCon.Id;
                c.AccountId = upcAccountList?.get(cCon.Id)?.cAccountId__r.Account__c; //
                c.Title = cCon.Title__c;
                c.Department = cCon.Department__c;
                c.Birthdate = cCon.Birthdate__c;
                c.ReportsToId = upReportsToList?.get(cCon.Id)?.ReportsToId__r.Contact__c; //
                c.LeadSource = cCon.Lead_Source__c;
                c.Prequalified__c = cCon.Prequalified__c;
                c.Phone = cCon.Phone__c;
                c.HomePhone = cCon.Home_Phone__c;
                c.MobilePhone = cCon.Mobile__c;
                c.OtherPhone = cCon.Other_Phone__c;
                c.Fax = cCon.Fax__c;
                c.Email = cCon.Email__c;
                c.AssistantName = cCon.Assistant__c;
                c.AssistantPhone = cCon.Asst_Phone__c;
                c.Description = cCon.Description__c;
                conListUpdate.add(c);  
            }
        }
        if (conListUpdate.size() > 0) {
            UPDATE conListUpdate;
        }

    }


//----------------------------------------------------------------------------------
    //INSERT
    
    if(Trigger.isAfter && Trigger.isInsert){
        //con.AccountId
        Set<Id> InsertAccountId = new Set<Id>();
    
        for(cContact__c c : Trigger.new){
            InsertAccountId.add(c.cAccountId__c);
        }
    
        List<Account> InsertAccount = [SELECT Id, cAccount__c FROM Account WHERE cAccount__c IN : InsertAccountId];
        //System.debug('Insertaccount' + Insertaccount);
        Map<String,Account> accInsertDataMerge = new Map<String,Account>();
    
        if(InsertAccount.size()>0){
            for (Account t : InsertAccount){
                accInsertDataMerge.put(t.cAccount__c, t);
            }
        }
    
        //con.ReportsToId
        Set<Id> InsertReportsToId = new Set<Id>();
    
        for(cContact__c c : Trigger.new){
            InsertReportsToId.add(c.ReportsToId__c);
        }
    
        List<Contact> InsertReports = [SELECT Id, cContact__c FROM Contact WHERE cContact__c IN : InsertReportsToId];
        //System.debug('InsertReports' + InsertReports);
        Map<String,Contact> reInsertDataMerge = new Map<String,Contact>();
    
        if(InsertReports.size()>0){
            for (Contact t : InsertReports){
                reInsertDataMerge.put(t.cContact__c, t);
            }
        }
        
        List<Contact> conList = new List<Contact>();
        for (cContact__c cCon : Trigger.new) {

            if(cCon.Contact__c == null) {
                Contact con = new Contact();
                con.LastName = cCon.Last_Name__c;
                con.FirstName = cCon.First_Name__c;
                con.Salutation = cCon.Salutation__c;
                con.cContact__c = cCon.Id;
                con.AccountId = accInsertDataMerge?.get(cCon.cAccountId__c)?.Id;
                con.Title = cCon.Title__c;
                con.Department = cCon.Department__c;
                con.Birthdate = cCon.Birthdate__c;
                con.ReportsToId = reInsertDataMerge?.get(cCon.ReportsToId__c)?.Id;
                con.LeadSource = cCon.Lead_Source__c;
                con.Prequalified__c = cCon.Prequalified__c;
                con.Phone = cCon.Phone__c;
                con.HomePhone = cCon.Home_Phone__c;
                con.MobilePhone = cCon.Mobile__c;
                con.OtherPhone = cCon.Other_Phone__c;
                con.Fax = cCon.Fax__c;
                con.Email = cCon.Email__c;
                con.AssistantName = cCon.Assistant__c;
                con.AssistantPhone = cCon.Asst_Phone__c;
                con.Description = cCon.Description__c;
                conList.add(con);
                System.debug(con);
            }
        }
        if (conList.size() > 0){
            System.debug(conList);
            System.debug(conList.Size());
            INSERT conList;

            Map<String,String> updatecCon = new Map<String,String>();
            List<cContact__c> updateList = new List<cContact__c>();

            for(Contact c : conList ){
                updatecCon.put(c.cContact__c, c.Id);
            }
            for(cContact__c cCon : Trigger.new){
                
                    cContact__c cc = new cContact__c();
                    cc.Id = cCon.Id;
                    cc.Name = cCon.fullName__c;
                    cc.contact__c = updatecCon.get(cCon.Id);
                    updateList.add(cc);
                    
               
            }
            UPDATE updateList;
        }
    }
}