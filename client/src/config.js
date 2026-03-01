import os from 'os-browserify/browser';

export const CONFIG = {
    DOMAIN: os.hostname() === 'localhost' ? 'http://localhost:3001/v1' : 'http://192.168.1.30:3001/v1',
}