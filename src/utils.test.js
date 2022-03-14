import { endOfMonth, startOfMonth } from 'date-fns';
import {
  calcFocusDate,
  calculateBroadcastWeekNumber,
  shouldRenderBroadcastDay,
  defineCellBorder,
} from './utils';

describe('calcFocusDate', () => {
  const ranges = [
    {
      startDate: new Date(2021, 0, 10),
      endDate: new Date(2022, 10, 20),
    },
  ];

  describe('when focusedRange[1] equals 0', () => {
    test('should return startDate', () => {
      expect(
        calcFocusDate(new Date(), {
          ranges,
          focusedRange: [0, 0],
          displayMode: 'dateRange',
        })
      ).toEqual(startOfMonth(ranges[0].startDate));
    });
  });

  describe('when focusedRange[1] equals 1', () => {
    test('should return endDate', () => {
      expect(
        calcFocusDate(new Date(), {
          ranges,
          focusedRange: [0, 1],
          displayMode: 'dateRange',
        })
      ).toEqual(endOfMonth(ranges[0].endDate));
    });
  });
});

describe('calculateBroadcastWeekNumber', () => {
  it('should return 9 for 2/21/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('2/21/2022'));
    expect(result).toBe(9);
  });

  it('should return 8 for 2/20/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('2/20/2022'));
    expect(result).toBe(8);
  });

  it('should return 1 for 01/02/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('01/02/2022'));
    expect(result).toBe(1);
  });

  it('should return 2 for 01/03/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('01/03/2022'));
    expect(result).toBe(2);
  });

  it('should return 1 for 12/27/2021', () => {
    const result = calculateBroadcastWeekNumber(new Date('12/27/2021'));
    expect(result).toBe(1);
  });

  it('should return 52 for 12/25/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('12/25/2022'));
    expect(result).toBe(52);
  });

  it('should return 1 for 12/26/2022', () => {
    const result = calculateBroadcastWeekNumber(new Date('12/26/2022'));
    expect(result).toBe(1);
  });

  it('should return 1 for 01/01/2023', () => {
    const result = calculateBroadcastWeekNumber(new Date('01/01/2023'));
    expect(result).toBe(1);
  });

  it('should return 52 for 12/24/2023', () => {
    const result = calculateBroadcastWeekNumber(new Date('12/24/2023'));
    expect(result).toBe(52);
  });

  it('should return 53 for 12/25/2023', () => {
    const result = calculateBroadcastWeekNumber(new Date('12/25/2023'));
    expect(result).toBe(53);
  });
});

describe('shouldRenderBroadcastDay', () => {
  // broadcast week starts on Mondays and finishes on Sundays
  const JanuaryMonthNumber = 0;
  const MarchMonthNumber = 2;
  const AprilMonthNumber = 3;
  const MayMonthNumber = 4;

  describe('5th broadcast week days', () => {
    it('should be rendered if last day of that week does not belong to next month', () => {
      expect(shouldRenderBroadcastDay(new Date('01/24/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/25/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/26/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/27/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/28/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/29/2022'), JanuaryMonthNumber)).toBeTruthy();
      expect(shouldRenderBroadcastDay(new Date('01/30/2022'), JanuaryMonthNumber)).toBeTruthy();
    });

    it('should not be rendered if last day of that week belongs to next month', () => {
      expect(shouldRenderBroadcastDay(new Date('04/26/2022'), AprilMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/27/2022'), AprilMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/28/2022'), AprilMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/29/2022'), AprilMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/30/2022'), AprilMonthNumber)).toBeFalsy();
    });
  });

  describe('6th broadcast week days', () => {
    it('should not be rendered', () => {
      expect(shouldRenderBroadcastDay(new Date('01/31/2022'), JanuaryMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('05/30/2022'), MayMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('05/31/2022'), MayMonthNumber)).toBeFalsy();
    });
  });

  describe('1st broadcast week days', () => {
    it('should not be rendered on previous month', () => {
      expect(shouldRenderBroadcastDay(new Date('03/30/2022'), MarchMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('03/31/2022'), MarchMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/01/2022'), MarchMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/02/2022'), MarchMonthNumber)).toBeFalsy();
      expect(shouldRenderBroadcastDay(new Date('04/03/2022'), MarchMonthNumber)).toBeFalsy();
    });
  });
});

describe('defineCellBorder', () => {
  describe('should not have border styling', () => {
    it('if is not droadcast calendar', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: false,
        weekNumber: false,
        month: new Date('03/31/2022'),
        day: new Date('03/14/2022'),
      });
      expect(result).toEqual({});
    });
  
    it('if day is not disabled', () => {
      const result = defineCellBorder({
        disabled: false,
        broadcastCalendar: true,
        weekNumber: false,
        month: new Date('03/31/2022'),
        day: new Date('03/14/2022'),
      });
      expect(result).toEqual({});
    });
  
    it('if cell is weekNumber', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: true,
        weekNumber: true,
        month: new Date('03/31/2022'),
        day: new Date('03/14/2022'),
      });
      expect(result).toEqual({});
    });
  });

  describe('disabled broadcast days should have border styling', () => {
    it('with top, right, bottom and left borders if day is sunday and is last brodacast week', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: true,
        weekNumber: false,
        month: new Date('03/27/2022'),
        day: new Date('03/27/2022'),
      });
      expect(result.borderWidth).toEqual('1px 1px 1px 1px');
    });

    it('with top, right and left borders if day is sunday and is not last brodacast week', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: true,
        weekNumber: false,
        month: new Date('03/27/2022'),
        day: new Date('03/20/2022'),
      });
      expect(result.borderWidth).toEqual('1px 1px 0px 1px');
    });

    it('with top, bottom and left borders if day is not sunday and is last brodacast week', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: true,
        weekNumber: false,
        month: new Date('03/27/2022'),
        day: new Date('03/24/2022'),
      });
      expect(result.borderWidth).toEqual('1px 0px 1px 1px');
    });

    it('with top  and left borders if day is not sunday and is not last brodacast week', () => {
      const result = defineCellBorder({
        disabled: true,
        broadcastCalendar: true,
        weekNumber: false,
        month: new Date('03/27/2022'),
        day: new Date('03/15/2022'),
      });
      expect(result.borderWidth).toEqual('1px 0px 0px 1px');
    });
  });
});
