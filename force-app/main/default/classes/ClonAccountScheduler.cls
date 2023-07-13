/**
 * @description       : 
 * @author            : seol.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 05-15-2023
 * @last modified by  : seol.kim@dkbmc.com
**/
public class ClonAccountScheduler implements Schedulable {
    public void execute(SchedulableContext sc) {
        ClonAccountBatch cab = new ClonAccountBatch(); 
        Database.executeBatch(cab);
     }
  }

  /*
ScheduledMerge m = new ScheduledMerge();
String sch = '20 30 8 10 2 ?';
String jobID = System.schedule('Merge Job', sch, m);
  */