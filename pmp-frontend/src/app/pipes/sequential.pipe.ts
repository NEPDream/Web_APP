import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sequential'
})
export class SequentialPipe implements PipeTransform {

  transform(values: any[], ...args): any {    
    if(args.length==1){
      if(args[0].length>5){
        try {
          var id_company = JSON.parse(args[0])['id'];
          return values.filter((item) => item.company.id == id_company);

        } catch (error) {
          console.log('unable to parse json', args[0]);
          return values;
        }
      }
    }else{
      return values;
    }
  }

}
