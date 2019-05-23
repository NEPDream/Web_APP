import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageslist'
})
export class MessageslistPipe implements PipeTransform {

  transform(values: any[], ...args): any {
    var list_name = args[0];
    return values.filter((item) => item.room_type.toUpperCase().indexOf('GM'.toUpperCase()) !=-1);
  }

}
