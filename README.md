<a name="module_BroadCastCalendar"></a>

## BroadcastCalendar
React Component that displays a calendar based on react-date-range

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| minDate | <code>Date</code> | Disables dates before this date |
| maxDate | <code>Date</code> | Disables dates after this date |
| format | <code>string</code> | display date text and validate according to momentjs format (e.g. 'MM/DD/YYYY') |
| label | <code>string</code> | Input label placeholder |
| theme | <code>Object</code> | A theme.scss |
| valueLink | <code>ValueLink</code> | The bidirectional binding object |
| startDate | <code>string (or) momentjs Object (or) function</code> | Start Date of the date range |
| endDate | <code>string (or) momentjs Object (or) function</code> | End Date of the date range |
| firstDayOfWeek | <code>number</code> | First day of each week (e.g. 1 - Monday, 0 - Sunday ) |
| linkedCalendars | <code>boolean</code> | Calendars displayed to be continuous or not (default false)|
| calendars | <code>number</code> | Number of calendars to be displayed (default 2) |
| twoStepChange | <code>boolean</code> | Calls the onChange after two clicks (default false) |

**Example**  
```js
<BroadcastCalendar valueLink={ vlink } format='10/09/2017' firstDayOfWeek={1} twoStepChange={true} />
```
