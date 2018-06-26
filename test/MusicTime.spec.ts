import {expect} from 'chai';
import MusicTime from "../src/";

describe('MusicTime', () => {
  it('should not normalize bars', () => {
    expect(new MusicTime(20,0,0).toString()).to.equal('20.0.0');
  });

  it('should normalize beats', () => {
    expect(new MusicTime(0,16,0).toString()).to.equal('4.0.0');
  });

  it('should normalize sixteenths', () => {
    expect(new MusicTime(0,0,27).toString()).to.equal('1.2.3');
  });

  it('should convert to seconds', () => {
    expect(new MusicTime(0,120,0).toTime(120)).to.equal(60);
  });

  it('should convert from seconds', () => {
    expect(MusicTime.fromTime(1, 120).toString()).to.equal('0.2.0');
  });

  it('should add two compatible times', () => {
    expect(new MusicTime(0,8,0).add(new MusicTime(0,0,17)).toString()).to.equal('3.0.1');
  });

  it('should multiply a time', () => {
    expect(new MusicTime(0,8,0).multiply(4).toString()).to.equal('8.0.0');
  });

  it('should check validness of strings', () => {
    const valid = ['0.0.0', '100.100.100'];
    const invalid = ['-1.0.0', '0.0.-1', 'a.b.c', '1', '1.2', '..'];

    const validChecks:boolean[] = valid.map(entry => MusicTime.stringIsValid(entry));
    const invalidChecks = invalid.map(entry => MusicTime.stringIsValid(entry));

    expect(validChecks.every(entry => entry === true)).to.equal(true);
    expect(invalidChecks.every(entry => entry === false)).to.equal(true);
  });

  it('should subtract two compatible times', () => {
    expect(new MusicTime(0,8,0).subtract(new MusicTime(1,0,0)).toString()).to.equal('1.0.0');
  });

  it('should check equality', () => {
    const t1 = MusicTime.fromString('1.0.1');
    const t2 = MusicTime.fromString('1.0.01');

    expect(t1.equals(t2)).to.equal(true);
    expect(new MusicTime(0,8,0).equals(new MusicTime(2,0,0))).to.equal(true);
  });

  it('should init timeConfig when nothing is set', () => {
    const conf = new MusicTime(0, 0, 0).getTimeConfig();
    expect(conf.sixteenthsPerBeat).to.equal(4);
    expect(conf.beatsPerBar).to.equal(4);
  });

  it('should set timeConfig', () => {
    const conf = new MusicTime(0, 0, 0, {sixteenthsPerBeat: 3, beatsPerBar: 4}).getTimeConfig();
    expect(conf.sixteenthsPerBeat).to.equal(3);
    expect(conf.beatsPerBar).to.equal(4);
  });

  it('should convert to full bars', () => {
    expect(new MusicTime(0,0,16).getTotalBars()).to.equal(1);
  });

  it('should convert to partial bars', () => {
    expect(new MusicTime(0,0,24).getTotalBars()).to.equal(1.5);
  });

  it('should get beats', () => {
    expect(new MusicTime(0,0,10).getTotalBeats()).to.equal(2.5);
  });

  it('should convert to full sixteenths', () => {
    expect(new MusicTime(1,0,0).getTotalSixteenths()).to.equal(16);
  });

  // it('should convert to partial sixteenths', () => {
  //   expect(new MusicTime(1,0,0).getSixteenths()).to.equal(16);
  // });


  it('should clone', () => {
    const time = new MusicTime(11,13,58);
    const clone = time.clone();
    expect(time.equals(clone)).to.equal(true);
  });

  it('should convert from valid string', () => {
    expect(MusicTime.fromString('1.2.3').toString()).to.equal('1.2.3');
  });

  it('should use default values in constructor', () => {
    const items = [
      new MusicTime().toString(),
      new MusicTime(1).toString(),
      new MusicTime(1, 2).toString(),
    ];
    expect(items).to.deep.equal(['0.0.0', '1.0.0', '1.2.0']);
  });

  it('should fail when creating an instance from an invalid string', () => {
    expect(() => {
      MusicTime.fromString('invalid')
    }).to.throw();
  });

  it('should check validity of a string', () => {
    expect(MusicTime.stringIsValid('test')).to.equal(false);
    expect(MusicTime.stringIsValid('10.10.10')).to.equal(true);
  });

  it('should compare instances', () => {
    const time1 = new MusicTime(1,0,0);
    const time2 = new MusicTime(2,0,0);
    const time9 = new MusicTime(9,0,0);
    const time11 = new MusicTime(11,0,0);

    expect(time1 < time2).to.equal(true);
    expect(time1 > time2).to.equal(false);
    expect(time2 > time1).to.equal(true);
    expect(time2 < time1).to.equal(false);
    expect(time9 > time11).to.equal(false);
    expect(time11 > time9).to.equal(true);
  });
});
