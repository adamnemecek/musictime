# musictime

Small class to work with timings in a musical context. They are defined as bars/beats/sixteenths, and can be converted to and from actual time in seconds (by supplying a bpm).

### install

```sh
npm install musictime
```

## creating an instance
There are a few ways to create a `MusicTime` instance:
```javascript
import MusicTime from 'musictime';

const t1 = new MusicTime(0, 0, 0);            // constructor accepts bars, beats, sixteenths (all 0-based)
const t2 = MusicTime.fromString('1.2.3');   // parsing from a string can make data with a lot of timings much cleaner
const t3 = MusicTime.fromTime(10, 120);     // creates an instance at 10s (at 120bpm)
```

The bars, beats and sixteenths parameters in the constructor all default to `0`.
```javascript
new MusicTime()    // same as new MusicTime(0, 0, 0);
new MusicTime(1)   // new MusicTime(1, 0, 0)
```

Each instance has a `bars`, `beats` and `sixteenths` property.
```typescript
const time = new MusicTime(1,2,3)
time1.bars       // 1
time1.beats      // 2
time1.sixteenths // 3

// all times will be normalized after creation:
const time = new MusicTime(0,0,16); 
time2.bars       // 1
time2.beats      // 0
time2.sixteenths // 0
```
__At the moment you should not set these 3 properties__ 

## converting to seconds
Supply a bpm to convert an instance to seconds.
```javascript
new MusicTime(0,120,0).toTime(120); // = 60
```

Results from these `toTime` calls will be stored in a cache, so that multiple requests (with the same bpm) will skip unnessesary calculations. This cache is global and is used by all `MusicTime` instances (`MusicTime.TO_TIME_CACHE`). If for some reason you want to clear this cache:
```javascript
MusicTime.clearCache();
```

## some operations
```javascript
// calculations
const result1 = t1.add(t2);
const result2 = t2.subtract(t1);
const result3 = t2.multiply(3);

// also available as static methods
const result4 = MusicTime.add(t1, t2);
const result5 = MusicTime.subtract(t2, t1);
const result6 = MusicTime.multiply(t2, 3);

const clone = result1.clone();    // clones the instance
new MusicTime(1,2,3).toString();  // "1.2.3"
```

## comparison
Instances have a `valueOf` method (returning the total number of sixteenths), which makes direct comparison through relational operators (`> < >= <=`) possible:
```javascript
const time1 = new MusicTime(1, 0, 0);
const time2 = new MusicTime(2, 0, 0);

time1 > time2 // true
time1 < time2 // false
```

## beatsPerBar and sixteenthsPerBeat
Both values default to 4, but can be overridden in the constructor (4th and 5th parameter, respectively)

```javascript
new MusicTime(1,2,3,3,8); // 3 beats per bar, 8 sixteenths per beat
```


## limitations
- there is currently nothing more than the sixteenth grid (although the `sixteenthsPerBeat` can be adjusted)
- conversions from a time in seconds will floor to that grid and discard any remaining timeinfo
- timings with unequal `beatsPerBar` and `sixteenthsPerBeat` settings cannot be summed or subtracted
- anything regarding negative numbers and timings is untested and will probably lead to incorrect results.

