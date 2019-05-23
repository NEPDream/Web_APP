import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listfilter'
})
export class ListfilterPipe implements PipeTransform {

  transform(values: any[], ...args): any {
    if(args.length==2){
      var obj_type = args[0];
      var term = args[1].toLowerCase();
      if(obj_type == 'company'){
        return values.filter((company) => (company.name.toLowerCase().includes(term) 
                                            || company.comment.toLowerCase().includes(term) 
                                            || String(company.nbr_employee).toLowerCase().includes(term))
                            );
      }
      else if(obj_type == 'team'){
        return values.filter((team) => (team.name.toLowerCase().includes(term) 
                                        || team.comment.toLowerCase().includes(term) 
                                        || team.company.name.toLowerCase().includes(term) 
                                        || String(team.nbr_employee).toLowerCase().includes(term))
                            );
      }
      else if(obj_type == 'role'){
        return values.filter((role) => (role.name.toLowerCase().includes(term) 
                                        || role.comment.toLowerCase().includes(term)
                                        )
                            );
      }
      else if(obj_type == 'project'){
        return values.filter((project) => (project.name.toLowerCase().includes(term) 
                                          || project.comment.toLowerCase().includes(term)
                                          || project.company.name.toLowerCase().includes(term)
                                          || project.start_date.toLowerCase().includes(term)
                                          || project.due_date.toLowerCase().includes(term)
                                        )
                            );
      }
      else if(obj_type == 'employee'){
        return values.filter((employee) => (employee.name.toLowerCase().includes(term) 
                                          || employee.company_name.toLowerCase().includes(term)
                                          || employee.start_date.toLowerCase().includes(term)
                                          || employee.role.toLowerCase().includes(term)
                                          || employee.profile.toLowerCase().includes(term)
                                          || String(employee.is_full_time).toLowerCase().includes(term)
                                          || String(employee.active).toLowerCase().includes(term)
                                          || employee.team_name.toLowerCase().includes(term)
                                        )
                            );
      }
      else{
        return values;
      }
    }else{
      return null;
    }
  }

}
