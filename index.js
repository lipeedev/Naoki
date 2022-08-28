import { NaokiClient } from './src/NaokiClient.js';
(new NaokiClient()).start();

import { transform } from '@babel/core';

transform('code', {
    presets: ['@babel/preset-env']
});