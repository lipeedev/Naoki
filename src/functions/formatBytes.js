function formatBytes(bytes, fixed = 2) {
    const GB = 1024; // 1 GB = 1024 MB
    const sizeTypes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const f = Math.floor(Math.log(bytes) / Math.log(GB));

    return parseFloat((bytes / Math.pow(GB, f)).toFixed(fixed)) + ' ' + sizeTypes[f];
}

export { formatBytes };