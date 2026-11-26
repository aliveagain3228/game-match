export const getSafeCallbackUrl = (value: string | null) =>
    value && value.startsWith('/') && !value.startsWith('//') ? value : '/'