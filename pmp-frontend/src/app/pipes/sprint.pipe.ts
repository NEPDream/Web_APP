import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sprint'
})
export class SprintPipe implements PipeTransform {

  transform(values: any[], ...args): any {
    if(args.length==2){
      var sprint_name = args[1];
      return values.filter((item) => item.sprint.name.toUpperCase().indexOf(sprint_name.toUpperCase()) !=-1);
    }else if(args.length==1){
      var sprint_name = args[0];
      return values.filter((item) => item.name.toUpperCase().indexOf(sprint_name.toUpperCase()) !=-1);
    }else{
      return values;
    }
  }

}
