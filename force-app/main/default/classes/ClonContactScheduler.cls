/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-15-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public class ClonContactScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        ClonContactBatch ccb = new ClonContactBatch(); 
        Database.executeBatch(ccb);
     }
  }

  /*
ScheduledMerge m = new ScheduledMerge();
String sch = '20 30 8 10 2 ?';
String jobID = System.schedule('Merge Job', sch, m);
  */