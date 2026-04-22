import { BarberModel } from './model.js';
import { BarberView } from './view.js';
import { BarberController } from './controller.js';

// Inicializa o sistema MVC
const app = new BarberController(new BarberModel(), new BarberView());