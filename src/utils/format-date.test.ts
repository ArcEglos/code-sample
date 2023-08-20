import { formatDate, formatDateTime } from "./format-date";

test("Date formatting respects local time zone if given", async () => {
  const formattedDate = formatDate(
    "2022-07-23T23:00:00-04:00",
    "America/New_York"
  );

  expect(formattedDate).toEqual("Saturday, July 23, 2022");
});

test("Datetime formatting respects local time zone if given", async () => {
  const formattedDate = formatDateTime(
    "2022-03-22T23:00:00-04:00",
    "America/New_York"
  );

  expect(formattedDate).toEqual("March 22, 2022 at 11:00:00 PM EDT");
});

// Testing the opposite case of using the local timezone of the machine
// in case no timezone is provided is hard to test in a way that would
// not introduce flakyness depending on machine settings. The additional
// complexity of this would likely cause more harm than it prevents.
