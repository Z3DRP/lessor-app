const goZeroTime = "0001-01-01T00:00:00Z";
const defaultUUID = "00000000-0000-0000-0000-000000000000";

export const isDefaultDate = (dateString: string | null | undefined) =>
  dateString != undefined
    ? new Date(dateString).getTime() === new Date(goZeroTime).getTime()
    : true;

export const formatDate = (dateArg: string | null | undefined) =>
  !isDefaultDate(dateArg) && dateArg != null
    ? new Date(dateArg).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      })
    : "--";

export const formatDateWithDefault = (
  dateArg: string | null | undefined,
  defaultValue: string = "--"
) =>
  !isDefaultDate(dateArg) && dateArg != null
    ? new Date(dateArg).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      })
    : defaultValue;

export const isDefaultUuid = (uid: string) => uid === defaultUUID;
