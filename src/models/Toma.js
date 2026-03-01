import { model, Schema } from 'mongoose';

const TomaSchema = new Schema({
    nombre: { 
        type: String,
    },
    n: {
        type: Number,
        unique: true
    }
});

export default model('Toma', TomaSchema);

