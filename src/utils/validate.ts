export const isValidUsername = (str: string) => ['admin', 'editor', 'ghl'].indexOf(str.trim()) >= 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
