const goZeroTime = "0001-01-01T00:00:00Z";

export const isDefaultDate = (dateString: string | undefined) =>
  dateString != undefined
    ? new Date(dateString).getTime() === new Date(goZeroTime).getTime()
    : true;
