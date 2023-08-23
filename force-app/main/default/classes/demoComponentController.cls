/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 08-23-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public with sharing class demoComponentController {



    @AuraEnabled
    public static List<ContentVersion> getFiles(String ContentDocumentId, String category, String recordId){

        List<ContentDocumentLink> cdlList = [SELECT Id, 
                                                LinkedEntityId, 
                                                ContentDocumentId                    
                                            FROM ContentDocumentLink                  
                                            WHERE LinkedEntityId =: recordId
                                            ];
        System.debug('cdlList=>' + cdlList);

        Set<Id> documentIds = new Set<Id>();

        for(ContentDocumentLink link : cdlList){
            documentIds.add(link.id);
        }
        System.debug('documentIds => '+documentIds);

        List<ContentDocument> cdList = [SELECT Id
                                        FROM ContentDocument 
                                        WHERE id =: documentIds
                                        ];
        System.debug('cdList => '+ cdList);
 
        Set<Id> documentId = new Set<Id>();
        for(ContentDocument cd : cdList){
            documentId.add(cd.Id);
        }
        System.debug('documentId => '+documentId);

        List<ContentVersion> cvList = [SELECT Id, 
                                                    Title, 
                                                    Category__c,
                                                    FileType,
                                                    CreatedDate,
                                                    ContentDocumentId 
                                            FROM ContentVersion
                                            WHERE Category__c =: category 
                                            AND ContentDocumentId =: documentId];
                                          
                                            System.debug('cvList => '+cvList);

    return cvList;
            
      
        
    }



    @AuraEnabled
    public static void updateFiles(String uploadedFiles , String pickListName){
        
    
        Map<String, Object> valuesMap = new Map<String, Object>();
        List<ContentVersion> contentVersionsToUpdate = new List<ContentVersion>();
        for(Object obj : (List<Object>)JSON.deserializeUntyped(uploadedFiles)){
           // 값을 Map으로 변환
           Map<String, Object> data = (Map<String, Object>)obj;
           String cvId = (String) data.get('contentVersionId');
           System.debug(cvId);
           ContentVersion cvRecord = new ContentVersion();
           cvRecord.Category__c = pickListName;
           cvRecord.Id = cvId;
           contentVersionsToUpdate.add(cvRecord);
           System.debug(cvRecord);
           //|DEBUG|data => {contentBodyId=05T5i00000ipRzZEAU, contentVersionId=0685i00000Boni2AAB, documentId=0695i00000BHyrwAAD, mimeType=image/png, name=images.png}
        }




        update contentVersionsToUpdate;
    }
}