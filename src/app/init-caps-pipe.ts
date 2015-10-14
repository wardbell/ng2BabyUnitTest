import {Pipe} from 'angular2/angular2';

@Pipe({ name: 'initCaps' })
export class InitCapsPipe {
  transform(value: string) {
    return value.toLowerCase().replace(/(?:^|\s)[a-z]/g, function(m) {
      return m.toUpperCase();
    });
  }
}