import './db';
import app from './app';
import { createTomas, createDoctor, deleteOrdenes, ordenarTomas, editBoletas } from './lib/createTomas';

const main = () => {
    //ordenarTomas();
    app.listen(app.get('port'), () => console.log('Server running on port', app.get('port')));  
};

main();