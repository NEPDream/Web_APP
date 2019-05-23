import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'issuePipe'
})
export class IssuePipePipe implements PipeTransform {

  transform(values: any[], ...args): any {
    // console.log(values, args);
    if(args.length==2){
      var user = args[0];
      var project = args[1];
      if(user =='' && project ==''){
        return values;
      }else if(user !='' && project ==''){
        return values.filter((item) => item.employee.name.toUpperCase().indexOf(user.toUpperCase()) !=-1);
      }
      else if(user =='' && project !=''){
        return values.filter((item) => item.project.name.toUpperCase().indexOf(project.toUpperCase()) !=-1);
      }
      else if(user !='' && project !=''){
        return values.filter((item) => (item.employee.name.toUpperCase().indexOf(user.toUpperCase()) !=-1)&&(item.project.name.toUpperCase().indexOf(project.toUpperCase()) !=-1) ) ;
      }else{
        return values;
      }
    }
    else if(args.length=1){
      var list_name = args[0];
      return values.filter((item) => item.room_type.toUpperCase().indexOf(list_name.toUpperCase()) !=-1);
    }
  }

}
