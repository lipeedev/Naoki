const translated = { 'pt-BR': ' e ', 'en-US': ' and ' };

function formatArray(language, array = [], type = 0) {
    if (type == 1) return array.join(', ');
    else return array.length > 1 ? array.slice(0, -1).join(', ') + translated[language] + array.slice(-1) : array.join(', ');
}

export { formatArray };