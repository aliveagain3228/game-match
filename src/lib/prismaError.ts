export const isPrismaError = (error: unknown, code: string) =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code