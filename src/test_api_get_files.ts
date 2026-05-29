import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const secret = process.env.JWT_SECRET || 'fallback_secret_key';
const token = jwt.sign({ id: '60d21b4667d0d8992e610c85', email: 'test@example.com' }, secret);

console.log('Generated token:', token);

async function test() {
    try {
        console.log('Sending request to http://localhost:3000/files ...');
        const res = await fetch('http://localhost:3000/files', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);
    } catch (error: any) {
        console.error('Request failed with error:', error.message);
    }
}

test();
