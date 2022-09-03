const translated = { 'pt-BR': ' e ', 'en-US': ' and ' };

const functions = {
    formatArray: (lang, arr, type = 0) => {
        if (type == 1) return arr.join(', ');
        else return arr.length > 1 ? arr.slice(0, -1).join(', ') + translated[lang] + arr.slice(-1) : arr.join(', ');
    },
    formatBytes: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    },
    removeDuplicates: (arr) => {
        return [...new Set(arr)];
    }
};

export { functions as Utils };