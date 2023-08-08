 /**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 08-08-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
trigger CaseChangeOwnerTrigger on aCase__c (before insert, before update) {

    List<aCase__c> toProcess = null;

    switch on Trigger.operationType {
        when BEFORE_INSERT {
            toProcess = Trigger.new;
            insertValue();
        }
        when BEFORE_UPDATE {
            toProcess = Trigger.new;
            updateValue();
        }

    }
    public Static void insertValue(){

        List<CustomUser__c> cuList = [select Id,Name, CaseOrigin__c, User__c from CustomUser__c ];
        System.debug('cuList=>' + cuList);
    
        Map<String,String> userMap = new Map<String, String>();

        for(CustomUser__c cu : cuList){
            userMap.put(cu.CaseOrigin__c, cu.User__c); //Map.put(key,value);
        }
        System.debug('userMap=>' + userMap);
    
        for(aCase__c con : toProcess){
            if(userMap.get(con.CaseOrigin__c) != null){
                con.OwnerId = userMap.get(con.CaseOrigin__c); //Map.get(key);
                System.debug('userMap.get(con.CaseOrigin__c)=>' + userMap.get(con.CaseOrigin__c));
            }
        }
    }

    public Static void updateValue(){

        List<CustomUser__c> cuList = [select Id,Name, CaseOrigin__c, User__c from CustomUser__c ];
        System.debug('cuList=>' + cuList);
    
        Map<String,String> userMap = new Map<String, String>();

        for(CustomUser__c cu : cuList){
            userMap.put(cu.CaseOrigin__c, cu.User__c); //Map.put(key,value);
        }
        System.debug('userMap=>' + userMap);
    
        for(aCase__c con : toProcess){
            if(userMap.get(con.CaseOrigin__c) != null){
                con.OwnerId = userMap.get(con.CaseOrigin__c); //Map.get(key);
                System.debug('userMap.get(con.CaseOrigin__c)=>' + userMap.get(con.CaseOrigin__c));

            } else if (userMap.get(con.CaseOrigin__c) == null) {
                con.OwnerId = con.CreatedById; 
            }
            
        }

    }
}