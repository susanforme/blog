
# rxjs

所有的Observerable 都是在subscribe后才会执行

```typescript
import { Observable, observeOn, asyncScheduler } from 'rxjs';

const observable = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
})
// 管道
.pipe(
  observeOn(asyncScheduler)
);

console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');
```

结果

```
just before subscribe
just after subscribe
got value 1
got value 2
got value 3
done
```