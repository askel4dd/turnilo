/*
 * Copyright 2015-2016 Imply Data, Inc.
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from "chai";
import { Timezone } from "chronoshift";
import { appendDays, datesEqual, endingDate, formatTimeRange, formatYearMonth, getDayInMonth, prependDays } from "./time";

describe("Time", () => {
  it("calculates date equality properly", () => {
    expect(datesEqual(null, new Date()), "null and not null").to.equal(false);
    expect(datesEqual(null, null), "null and null").to.equal(true);
    expect(datesEqual(new Date("1995-02-24T00:00:00.000Z"), new Date("1995-02-24T00:00:00.000Z")), "equal dates").to.equal(true);
    expect(datesEqual(new Date("1995-02-24T00:00:00.000Z"), new Date("1995-02-24T00:02:00.000Z")), "not equal dates").to.equal(false);
  });

  it("prepends days", () => {
    let testFirstWeek: Date[] = [];
    for (let i = 1; i < 5; i++) {
      testFirstWeek.push(new Date(Date.UTC(1995, 2, i)));
    }

    const prepended = prependDays(Timezone.UTC, testFirstWeek, 5);
    expect(prepended).to.deep.equal([
      new Date("1995-02-24T00:00:00.000Z"),
      new Date("1995-02-25T00:00:00.000Z"),
      new Date("1995-02-26T00:00:00.000Z"),
      new Date("1995-02-27T00:00:00.000Z"),
      new Date("1995-02-28T00:00:00.000Z"),
      new Date("1995-03-01T00:00:00.000Z"),
      new Date("1995-03-02T00:00:00.000Z"),
      new Date("1995-03-03T00:00:00.000Z"),
      new Date("1995-03-04T00:00:00.000Z")
    ]);
  });

  it("appends days", () => {
    let testWeek: Date[] = [];
    for (let i = 1; i < 5; i++) {
      testWeek.push(new Date(Date.UTC(1995, 2, i)));
    }

    const append = appendDays(Timezone.UTC, testWeek, 5);
    expect(append).to.deep.equal([
      new Date("1995-03-01T00:00:00.000Z"),
      new Date("1995-03-02T00:00:00.000Z"),
      new Date("1995-03-03T00:00:00.000Z"),
      new Date("1995-03-04T00:00:00.000Z"),
      new Date("1995-03-05T00:00:00.000Z"),
      new Date("1995-03-06T00:00:00.000Z"),
      new Date("1995-03-07T00:00:00.000Z"),
      new Date("1995-03-08T00:00:00.000Z"),
      new Date("1995-03-09T00:00:00.000Z")
    ]);
  });

  const TZ_KATHMANDU = new Timezone("Asia/Kathmandu"); // +5.8;
  const TZ_TIJUANA = new Timezone("America/Tijuana"); // -8.0
  const TZ_Kiritimati = new Timezone("Pacific/Kiritimati");  // +14.0

  it("get day in month", () => {
    const date = new Date("1995-03-09T00:00:00.000Z");
    expect(getDayInMonth(date, TZ_TIJUANA), "tijuana walltime").to.equal(8);
    expect(getDayInMonth(date, TZ_KATHMANDU), "kathmandu walltime").to.equal(9);
    expect(getDayInMonth(date, TZ_Kiritimati), "kiritimati walltime").to.equal(9);
  });

  it("get walltime month returns full month and year according to walltime", () => {
    let date = new Date("1965-02-02T13:00:00.000Z");
    expect(formatYearMonth(date, TZ_TIJUANA), "basic tijuana").to.equal("February 1965");
    expect(formatYearMonth(date, TZ_KATHMANDU), "basic kathmandu").to.equal("February 1965");
    expect(formatYearMonth(date, TZ_Kiritimati), "basic kiritimati").to.equal("February 1965");
    date = new Date("1999-12-31T20:15:00.000Z");
    expect(formatYearMonth(date, TZ_TIJUANA), "y2k tijuana").to.equal("December 1999");
    expect(formatYearMonth(date, TZ_KATHMANDU), "y2k kathmandu").to.equal("January 2000");
    expect(formatYearMonth(date, TZ_Kiritimati), "y2k kiritimati").to.equal("January 2000");
  });

  describe("endingDate", () => {
    it("should subtract one day if it has 0:00 time", () => {
      expect(endingDate(new Date("2019-01-02T00:00Z"), Timezone.UTC))
        .to.eql(new Date("2019-01-01T00:00Z"));
    });

    it("should floor to start of the day otherwise", () => {
      expect(endingDate(new Date("2019-01-02T00:30Z"), Timezone.UTC))
        .to.eql(new Date("2019-01-02T00:00Z"));
    });
  });

  describe("formatTimeRange", () => {
    describe("should add year correctly", () => {
      it("should use long format for different years", () => {
        const range = {
          start: new Date("1997-02-21T11:00Z"),
          end: new Date("1999-05-30T16:21Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb 1997 11:00 - 30 May 1999 16:21");
      });

      it("should use long format for same year but not current", () => {
        const range = {
          start: new Date("1997-02-21T11:00Z"),
          end: new Date("1997-05-30T16:21Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb 1997 11:00 - 30 May 1997 16:21");
      });

      it("should omit year for both current years", () => {
        const range = {
          start: new Date("2019-02-21T11:00Z"),
          end: new Date("2019-05-30T16:21Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb 11:00 - 30 May 16:21");
      });
    });

    describe("should handle full day ranges", () => {
      it("should show one date", () => {
        const range = {
          start: new Date("1999-02-21Z"),
          end: new Date("1999-02-22Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb 1999");
      });

      it("should show one short date for current year", () => {
        const range = {
          start: new Date("2019-02-21Z"),
          end: new Date("2019-02-22Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb");
      });
    });

    describe("should omit hour and subtract day if range is multiple days", () => {
      it("should show just dates", () => {
        const range = {
          start: new Date("1997-02-21Z"),
          end: new Date("1999-05-30Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb 1997 - 29 May 1999");
      });

      it("should show just days and months", () => {
        const range = {
          start: new Date("2019-02-21Z"),
          end: new Date("2019-05-30Z")
        };
        expect(formatTimeRange(range, Timezone.UTC)).to.be.eq("21 Feb - 29 May");
      });
    });
  });
});
