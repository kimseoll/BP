/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 08-16-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
global class pickListFile extends VisualEditor.DynamicPickList {
    String defaultVal = '-- none --';

    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('defaultVal', 'defaultVal');
        return defaultValue;
    }


    global override VisualEditor.DynamicPickListRows getValues() {

        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        Schema.DescribeFieldResult fieldResult = ContentVersion.Category__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            VisualEditor.DataRow value = new VisualEditor.DataRow(pickListVal.getLabel(),pickListVal.getValue());
            myValues.addRow(value);
        }
        return myValues;
    }
}
