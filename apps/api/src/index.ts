import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API Routes
app.get('/api/registros', (req, res) => {
    res.json({ message: 'Registros endpoint ready' });
});

app.listen(port, () => {
    console.log(`[VERCFLOW API]: Server is running at http://localhost:${port}`);
});
