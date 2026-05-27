type FirestoreTimestampLike = {
  toDate?: () => Date;
  seconds?: number;
};

export function formatDate(value: string | Date | unknown): string {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function toDate(value: string | Date | unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  if (value && typeof value === "object") {
    const timestamp = value as FirestoreTimestampLike;

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    }

    if (typeof timestamp.seconds === "number") {
      return new Date(timestamp.seconds * 1000);
    }
  }

  return null;
}
