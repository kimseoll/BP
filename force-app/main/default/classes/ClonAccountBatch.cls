/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-17-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public class ClonAccountBatch implements Database.Batchable<sObject>, Database.Stateful  {
    
    /* Database.executeBatch(new ClonAccountBatch());
    Database.executeBatch(new ClonAccountBatch(), 100); */
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        String query = 'SELECT Id, ' + 
                            'cAccount__c, ' + 
                            'Name, ' + 
                            'Parent.cAccount__c, ' + 
                            'AccountNumber, ' +
                            'Site, ' + 
                            'Type, ' + 
                            'Industry, ' + 
                            'AnnualRevenue, ' + 
                            'Rating, ' + 
                            'Phone, ' + 
                            'Fax, ' + 
                            'Website, ' + 
                            'TickerSymbol, ' + 
                            'Ownership,' + 
                            'NumberOfEmployees, ' +
                            'Sic, ' + 
                            'Description ' +
                        'FROM Account';
        return Database.getQueryLocator(query);
    }
       
    
    public void execute(Database.BatchableContext bc, List<Account> accList) {
        
        //INSERT + UPDATE
        List<cAccount__c> cAccList = new List<cAccount__c>();
        
        for (Account acc : accList){
            //조건
            if (acc.cAccount__c == null ) {          
                cAccount__c cAcc = new cAccount__c();
                cAcc.Name = acc.Name;
                cAcc.Account__c = acc.Id;
                cAcc.Parent_cAccount__c = acc.Parent.cAccount__c; 
                cAcc.Account_Number__c = acc.AccountNumber;
                cAcc.Type__c = acc.Type;
                cAcc.Industry__c = acc.Industry;
                cAcc.Annual_Revenue__c = acc.AnnualRevenue;
                cAcc.Rating__c = acc.Rating;
                cAcc.Phone__c = acc.Phone;
                cAcc.Fax__c = acc.Fax;
                cAcc.Website__c = acc.Website;
                cAcc.Ticker_Symbol__c = acc.TickerSymbol;
                cAcc.Ownership__c = acc.Ownership;
                cAcc.Employees__c = acc.NumberOfEmployees;
                cAcc.SIC_Code__c = acc.Sic;
                cAcc.Description__c = acc.Description;
                cAcc.Account_Site__c = acc.Site;
                cAccList.add(cAcc);
                System.debug(cAccList.Size());
            } else if (acc.cAccount__c != null){
                cAccount__c cAcc = new cAccount__c();
                cAcc.Id = acc.cAccount__c;
                cAcc.Name = acc.Name;
                cAcc.Account__c = acc.Id;
                cAcc.Parent_cAccount__c = acc.Parent.cAccount__c; 
                cAcc.Account_Number__c = acc.AccountNumber;
                cAcc.Type__c = acc.Type;
                cAcc.Industry__c = acc.Industry;
                cAcc.Annual_Revenue__c = acc.AnnualRevenue;
                cAcc.Rating__c = acc.Rating;
                cAcc.Phone__c = acc.Phone;
                cAcc.Fax__c = acc.Fax;
                cAcc.Website__c = acc.Website;
                cAcc.Ticker_Symbol__c = acc.TickerSymbol;
                cAcc.Ownership__c = acc.Ownership;
                cAcc.Employees__c = acc.NumberOfEmployees;
                cAcc.SIC_Code__c = acc.Sic;
                cAcc.Description__c = acc.Description;
                cAcc.Account_Site__c = acc.Site;
                cAccList.add(cAcc);
            }
        }
        try {
            if(cAccList.size()>0){
                System.debug(cAccList.Size());
                upsert cAccList;

                Map<String,String> updateData = new Map<String,String>();
                List<Account> updateList = new List<Account>();

                for(cAccount__c ca : cAccList){
                    updateData.put(ca.Account__c, ca.Id);
                }
                for(Account acc : accList){
                    Account ac = new Account();
                    ac.Id = acc.Id;
                    ac.cAccount__c = updateData.get(acc.Id);
                    updateList.add(ac);
                }
                UPDATE updateList;
                System.debug(updateList);
                System.debug(updateList.Size());
            }
        } catch(Exception e) {
            system.debug(e);
        }
      
        //DELETE
        List<cAccount__c> aList = [SELECT id FROM cAccount__c WHERE Account__c = null];
        delete aList;
    }
    
    public void finish(Database.BatchableContext bc) {
        System.debug('@@ Batch job completed');
    }
}





//-----------------------------------------------------------------------------------------
/*
        //UPDATE
        // List<cAccount__c> cAccListUp = new List<cAccount__c>();
        
        // for (Account acc : accList){
        //     //조건
        //     if (acc.cAccount__c != null ) {          
                
        //         cAccount__c cAcc = new cAccount__c();
                
        //             cAcc.Id = acc.cAccount__c;
        //             cAcc.Name = acc.Name;
        //             cAcc.Account__c = acc.Id;
        //             cAcc.Parent_cAccount__c = acc.Parent.cAccount__c; 
        //             cAcc.Account_Number__c = acc.AccountNumber;
        //             cAcc.Type__c = acc.Type;
        //             cAcc.Industry__c = acc.Industry;
        //             cAcc.Annual_Revenue__c = acc.AnnualRevenue;
        //             cAcc.Number_Of_Contacts__c = acc.Number_Of_Contacts__c;
        //             cAcc.Match_Billing_Address__c =  acc.Match_Billing_Address__c;
        //             cAcc.Rating__c = acc.Rating;
        //             cAcc.Phone__c = acc.Phone;
        //             cAcc.Fax__c = acc.Fax;
        //             cAcc.Website__c = acc.Website;
        //             cAcc.Ticker_Symbol__c = acc.TickerSymbol;
        //             cAcc.Ownership__c = acc.Ownership;
        //             cAcc.Employees__c = acc.NumberOfEmployees;
        //             cAcc.SIC_Code__c = acc.Sic;
        //             cAccListUp.add(cAcc);
        //             System.debug(cAccListUp.Size());
        //         }
            
        // }
        // try {
        //     if(cAccListUp.size()>0){
        //         System.debug(cAccListUp.Size());
        //         UPDATE cAccListUp;
        //     }
        // } catch(Exception e) {
        //     system.debug(e);
        // }


 //update
    if(Trigger.isAfter && Trigger.isUpdate){
        
        Set<Id> Ids = new Set<Id>();

        for(cAccount__c a : Trigger.new){
            Ids.add(a.Parent_cAccount__c);
        }

        List<Account> aParents = [SELECT Id, cAccount__c FROM Account WHERE cAccount__c IN : Ids];
        Map<String,Account> dataMerge = new Map<String,Account>();

        if(aParents.size()>0){
            for (Account t : aParents){
                dataMerge.put(t.cAccount__c, t);
            }
        }   

        Set<Id> accId = new Set<Id>(); 
        for(cAccount__c cAccNew : Trigger.new){
            cAccount__c cAccOld = Trigger.oldMap.get(cAccNew.Id);
            if (cAccNew.Name != cAccOld.Name){
                accId.add(cAccNew.Id);
            }
        }

        List<cAccount__c> cAccWithAcc = [SELECT Id, 
                                            Name, 
                                            Parent_cAccount__c, 
                                            Account_Number__c, 
                                            Account_Site__c, 
                                            Type__c, 
                                            Industry__c, 
                                            Annual_Revenue__c, 
                                            Number_Of_Contacts__c, 
                                            Match_Billing_Address__c,
                                            Rating__c, 
                                            Phone__c, 
                                            Fax__c, 
                                            Website__c, 
                                            Ticker_Symbol__c,
                                            Ownership__c, 
                                            Employees__c, 
                                            SIC_Code__c,
                                        (SELECT Id, 
                                                Name, 
                                                ParentId, 
                                                AccountNumber, 
                                                Site, 
                                                Type, 
                                                Industry, 
                                                AnnualRevenue, 
                                                Number_Of_Contacts__c, 
                                                Match_Billing_Address__c,
                                                Rating, 
                                                Phone, 
                                                Fax, 
                                                Website, 
                                                TickerSymbol, 
                                                Ownership,
                                                NumberOfEmployees, 
                                                Sic 
                                        FROM Accounts__r)
                                    FROM cAccount__c 
                                    WHERE Id 
                                    IN : accId];

        List<Account> accListUpdate = new List<Account>();
        for(cAccount__c cAcc : cAccWithAcc){
            List<Account> accOf = cAcc.Accounts__r;
            for(Account acc : accOf){
                acc.Name = cAcc.Name;               
                acc.cAccount__c = cAcc.Id;
                acc.ParentId = dataMerge?.get(cAcc.Parent_cAccount__c)?.Id; 
                acc.AccountNumber = cAcc.Account_Number__c;
                acc.Site = cAcc.Account_Site__c;
                acc.Type = cAcc.Type__c;
                acc.Industry = cAcc.Industry__c;
                acc.AnnualRevenue = cAcc.Annual_Revenue__c;
                acc.Number_Of_Contacts__c = cAcc.Number_Of_Contacts__c;
                acc.Match_Billing_Address__c = cAcc.Match_Billing_Address__c;
                acc.Rating = cAcc.Rating__c;
                acc.Phone = cAcc.Phone__c;
                acc.Fax = cAcc.Fax__c;
                acc.Website = cAcc.Website__c;
                acc.TickerSymbol = cAcc.Ticker_Symbol__c;
                acc.Ownership = cAcc.Ownership__c;
                acc.NumberOfEmployees = Integer.valueof(cAcc.Employees__c);
                acc.Sic = cAcc.SIC_Code__c;
                accListUpdate.add(acc);
                System.debug(acc);
                System.debug(dataMerge?.get(cAcc.Parent_cAccount__c)?.Id);
                System.debug('dataMerge' + dataMerge);
                System.debug('cAcc.Parent_cAccount__c' + cAcc.Parent_cAccount__c);
            }
        }
        if (accListUpdate.size() > 0) {
            UPDATE accListUpdate;
        }
    }

 //----------------------------------------------------------------------------------------

    // insert
    if(Trigger.isAfter && Trigger.isInsert){
        
        Set<Id> InsertIds = new Set<Id>();

        for(cAccount__c a : Trigger.new){
            if(a.Parent_cAccount__c != null) InsertIds.add(a.Parent_cAccount__c);
        }
        System.debug(Trigger.new.Size());
        System.debug('왜도냐');

        List<Account> InsertParents = [SELECT Id, cAccount__c FROM Account WHERE cAccount__c IN : InsertIds];
        Map<String,Account> apDataMerge = new Map<String,Account>();

        if(InsertParents.size()>0){
            for (Account t : InsertParents){
                if(t.cAccount__c != null) apDataMerge.put(t.cAccount__c, t);
            }
        }

        List<Account> accList = new List<Account>();
        for (cAccount__c cAcc : Trigger.new){
            //조건
            if (cAcc.Account__c == null) {
                
                Account acc = new Account();
                acc.Name = cAcc.Name;          
                acc.cAccount__c = cAcc.Id;
                acc.ParentId = apDataMerge?.get(cAcc.Parent_cAccount__c)?.Id;           
                acc.AccountNumber = cAcc.Account_Number__c;
                acc.Site = cAcc.Account_Site__c;
                acc.Type = cAcc.Type__c;
                acc.Industry = cAcc.Industry__c;
                acc.AnnualRevenue = cAcc.Annual_Revenue__c;
                acc.Number_Of_Contacts__c = cAcc.Number_Of_Contacts__c;
                acc.Match_Billing_Address__c = cAcc.Match_Billing_Address__c;
                acc.Rating = cAcc.Rating__c;
                acc.Phone = cAcc.Phone__c;
                acc.Fax = cAcc.Fax__c;
                acc.Website = cAcc.Website__c;
                acc.TickerSymbol = cAcc.Ticker_Symbol__c;
                acc.Ownership = cAcc.Ownership__c;
                acc.NumberOfEmployees = Integer.valueof(cAcc.Employees__c);
                acc.Sic = cAcc.SIC_Code__c;
                accList.add(acc);
                System.debug(acc);
            }
        }

        if (accList.size() > 0) {
            System.debug(accList);
            System.debug(accList.Size());
            INSERT accList;   
        }
        
    }
*/