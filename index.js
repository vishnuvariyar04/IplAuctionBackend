import express from 'express';
import ownerRoutes from './routes/ownerRoutes.js';
import playerRoutes from './routes/playerRoutes.js'; 
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/owners', ownerRoutes);
app.use('/players', playerRoutes);

app.get('/', (req, res) => { res.send('HEllooooo') });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});