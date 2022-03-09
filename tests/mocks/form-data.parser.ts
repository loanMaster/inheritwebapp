function getBoundary(contentType: string): string {
  const contentTypeArray = contentType.split(";").map((item) => item.trim());
  const boundaryPrefix = "boundary=";
  let boundary = contentTypeArray.find((item) =>
    item.startsWith(boundaryPrefix)
  ) as string;
  boundary = boundary.slice(boundaryPrefix.length);
  if (boundary) boundary = boundary.trim();
  return boundary;
}

function getMatching(value: string, regex: RegExp) {
  const matches = value.match(regex);
  if (!matches || matches.length < 2) {
    return null;
  }
  return matches[1];
}

export const parseFormData = (contentType: string, body: string) => {
  const boundary = getBoundary(contentType);
  const result: {
    file?: { size: number; content: string };
    values: { [key: string]: string };
  } = { values: { name: "" } };
  const rawDataArray = body.split(boundary);
  for (const item of rawDataArray) {
    // Use non-matching groups to exclude part of the result
    let name = getMatching(item, /(?:name=")(.+?)(?:")/);
    if (!name || !(name = name.trim())) continue;
    const value = getMatching(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
    if (!value) continue;
    let filename = getMatching(item, /(?:filename=")(.*?)(?:")/);
    if (filename && (filename = filename.trim())) {
      const file = { content: value, size: value.length, "Content-Type": "" };
      let contentType = getMatching(item, /(?:Content-Type:)(.*?)(?:\r\n)/);
      if (contentType && (contentType = contentType.trim())) {
        file["Content-Type"] = contentType;
      }
      result.file = file;
    } else {
      result.values[name] = value;
    }
  }
  return result;
};
