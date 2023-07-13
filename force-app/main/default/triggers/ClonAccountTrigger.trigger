/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-24-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
trigger ClonAccountTrigger on cAccount__c (after insert, after update, before delete) {

    List<Account> accList = new List<Account>();
    List<cAccount__c> toprocess = null;

    switch on Trigger.operationType {
        when AFTER_INSERT  {
            toProcess = Trigger.New;
            //System.debug(toProcess);
            upsertValue();
        }
        when AFTER_UPDATE {
            toProcess = Trigger.New;
            //System.debug(toProcess);
            upsertValue();
        }
        when before_DELETE {
            toProcess = Trigger.old;
            // System.debug(toProcess);
            deleteValue();
        }
    }

    public Static void upsertValue(){

        Set<Id> ParentId = new Set<Id>();
        

        for(cAccount__c a : toProcess){
            if(a.Parent_cAccount__c != null) ParentId.add(a.Parent_cAccount__c);
        }
  
        List<Account> InsertParentId = [SELECT Id, cAccount__c FROM Account WHERE cAccount__c IN : ParentId];
        Map<String,Account> accDataMerge = new Map<String,Account>();

        if(InsertParentId.size()>0){
            for(Account a : InsertParentId){
                if(a.cAccount__c != null) accDataMerge.put(a.cAccount__c, a);
            }
        }




        for(cAccount__c cAcc : toProcess){
            if(cAcc.Account__c == null){
                accList.add(new Account(cAccount__c = cAcc.Id,
                                        Name = cAcc.Name,         
                                        ParentId = accDataMerge?.get(cAcc.Parent_cAccount__c)?.Id,         
                                        AccountNumber = cAcc.Account_Number__c,
                                        Site = cAcc.Account_Site__c,
                                        Type = cAcc.Type__c,
                                        Industry = cAcc.Industry__c,
                                        AnnualRevenue = cAcc.Annual_Revenue__c,
                                        Rating = cAcc.Rating__c,
                                        Phone = cAcc.Phone__c,
                                        Fax = cAcc.Fax__c,
                                        Website = cAcc.Website__c,
                                        TickerSymbol = cAcc.Ticker_Symbol__c,
                                        Ownership = cAcc.Ownership__c,
                                        NumberOfEmployees = Integer.valueof(cAcc.Employees__c),
                                        Sic = cAcc.SIC_Code__c,
                                        Description = cAcc.Description__c
                                    ));

            } else if (cAcc.Account__c != null){
                 accList.add(new Account(cAccount__c = cAcc.Id,
                                        Id = cAcc.Account__c,
                                        Name = cAcc.Name,         
                                        ParentId = accDataMerge?.get(cAcc.Parent_cAccount__c)?.Id,        
                                        AccountNumber = cAcc.Account_Number__c,
                                        Site = cAcc.Account_Site__c,
                                        Type = cAcc.Type__c,
                                        Industry = cAcc.Industry__c,
                                        AnnualRevenue = cAcc.Annual_Revenue__c,
                                        Rating = cAcc.Rating__c,
                                        Phone = cAcc.Phone__c,
                                        Fax = cAcc.Fax__c,
                                        Website = cAcc.Website__c,
                                        TickerSymbol = cAcc.Ticker_Symbol__c,
                                        Ownership = cAcc.Ownership__c,
                                        NumberOfEmployees = Integer.valueof(cAcc.Employees__c),
                                        Sic = cAcc.SIC_Code__c,
                                        Description = cAcc.Description__c
                                    
                                    ));
            }
        }
        if (accList.size()>0) {
            upsert accList;

            Map<String,String> updateData = new Map<String,String>();
            List<cAccount__c> updateList = new List<cAccount__c>();
            Boolean isUp = Trigger.isUpdate;

            for(Account Acc : accList){
                updateData.put(Acc.cAccount__c, Acc.Id);
            }
            for(cAccount__c cAcc : toprocess){
                if(cAcc.Account__c == null && !isUp){
                    cAccount__c c = new cAccount__c();
                    c.Id = cAcc.Id;
                    c.Account__c = updateData.get(cAcc.Id);
                    updateList.add(c);
                }
            }  
            if(updateList.size()>0){
                update updateList;
            }      
        }
    }

    //DELETE
    public static void deleteValue(){
        Set<Id> DeleteList = new Set<Id>();
        for(cAccount__c cAcc : toprocess){
            DeleteList.add(cAcc.Id);
        } 
        List<Account> delAccList = [SELECT id FROM Account WHERE cAccount__c IN : DeleteList];
        
        if(delAccList.size()>0){
            System.debug(delAccList);
            delete delAccList;
        }
    }
 
}




/*
    // delete
    if(Trigger.isBefore &&Trigger.isDelete){
        Set<Id> DeleteList = new Set<Id>(); 
        System.debug(DeleteList);
        for(cAccount__c cAcc : Trigger.old){
            DeleteList.add(cAcc.Id);
        }

        List<Account> DelAccList = [SELECT id FROM Account WHERE cAccount__c IN : DeleteList];
        //Map<String,Account> dataMerge = new Map<String,Account>();
        
        if(DelAccList.size() > 0){
            System.debug(DelAccList);
            delete DelAccList;
        }
    }


  
//---------------------------------------------------------------------------------------------

    //update
    if(Trigger.isAfter && Trigger.isUpdate){

        List<cAccount__c> cAccWithAcc = Trigger.new;
        Set<Id> cAId = new Set<Id>();
        Set<Id> pAId = new Set<Id>();
        for(cAccount__c c : cAccWithAcc){
            cAId.add(c.Id);
            pAId.add(c.Parent_cAccount__c);
        }
        
        Map<Id,cAccount__c> upCAList = new  Map<Id,cAccount__c>([SELECT Id,
                                                                    Parent_cAccount__r.Account__c
                                                                FROM cAccount__c 
                                                                WHERE Parent_cAccount__c 
                                                                IN : pAId]);

        Map<Id,Account> upAList =  new Map<Id, Account>([SELECT Id, 
                                                                Name, 
                                                                ParentId, 
                                                                AccountNumber, 
                                                                Site, 
                                                                Type, 
                                                                Industry, 
                                                                AnnualRevenue, 
                                                                Rating, 
                                                                Phone, 
                                                                Fax, 
                                                                Website, 
                                                                TickerSymbol, 
                                                                Ownership,
                                                                NumberOfEmployees, 
                                                                Sic,
                                                                Description  
                                                        FROM Account 
                                                        WHERE cAccount__c 
                                                        IN :cAId]);

        List<Account> accListUpdate = new List<Account>();

        for(cAccount__c cAcc : cAccWithAcc){
            if(upAList.size()>0){
                Account a = upAList.get(cAcc.Account__c);
                a.Name = cAcc.Name;   
                a.cAccount__c = cAcc.Id;            
                // acc.cAccount__c = cAcc.Id;
                //a.parentId = upCAList?.get(cAcc.Parent_cAccount__c)?.Account__c; // upCAList?.get(cAcc.Id) == cAccount
                a.parentId = upCAList?.get(cAcc.Id)?.Parent_cAccount__r.Account__c; // upCAList?.get(cAcc.Id) == cAccount
                a.AccountNumber = cAcc.Account_Number__c;
                a.Site = cAcc.Account_Site__c;
                a.Type = cAcc.Type__c;
                a.Industry = cAcc.Industry__c;
                a.AnnualRevenue = cAcc.Annual_Revenue__c;
                a.Rating = cAcc.Rating__c;
                a.Phone = cAcc.Phone__c;
                a.Fax = cAcc.Fax__c;
                a.Website = cAcc.Website__c;
                a.TickerSymbol = cAcc.Ticker_Symbol__c;
                a.Ownership = cAcc.Ownership__c;
                a.NumberOfEmployees = Integer.valueof(cAcc.Employees__c);
                a.Sic = cAcc.SIC_Code__c;
                a.Description = cAcc.Description__c;
                accListUpdate.add(a);
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
        //System.debug(Trigger.new.Size());


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

            Map<String,String> updatecAcc = new Map<String,String>();
            List<cAccount__c> updateList = new List<cAccount__c>();
       
            for(Account a : accList ){
                updatecAcc.put(a.cAccount__c, a.Id);
            }
            for(cAccount__c cAcc : Trigger.new){
                cAccount__c ca = new cAccount__c();
                ca.Id = cAcc.Id;
                ca.Account__c = updatecAcc.get(cAcc.Id);
                updateList.add(ca);
            }
            UPDATE updateList;
        }
    }
}
*/