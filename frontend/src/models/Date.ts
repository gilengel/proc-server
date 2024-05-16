export function CreateNowTimestamp(): string {
  return CreateDateTimestamp(new Date());
}

export function CreateDateTimestamp(date: Date): string {
  return date.toJSON().slice(0, -1);
}
