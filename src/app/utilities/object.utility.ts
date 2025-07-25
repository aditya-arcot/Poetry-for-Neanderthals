export const sortObject = (
    obj: Record<string, unknown> | unknown[] | null | undefined
) => {
    if (typeof obj !== 'object' || Array.isArray(obj) || obj === null)
        return obj
    const sortedObject: Record<string, unknown> = {}
    const keys = Object.keys(obj).sort()
    keys.forEach(
        (key) =>
            (sortedObject[key] = sortObject(
                obj[key] as Record<string, unknown>
            ))
    )
    return sortedObject
}
