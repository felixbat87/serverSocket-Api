const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
//cors
app.use(cors({ origin: true, credentials: true }));
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{ cors: { origin: true, credentials: true } });
const bodyParser = require("body-parser");
//uso url con parametros
app.use(express.urlencoded({ extended: true }));
//formato json en el express
app.use(express.json());
//Body Parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//puerto
const PORT = process.env.PORT || 2000;
// Server - App
server.listen(PORT, () => {
  console.log("Servidor en ejecucion:" + PORT);
});

io.on("connection", (socket) => {
  console.log("Socket - EXP: ", socket.id);
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "Servicio recibido",
  });
});

class GraficaData {

  labels = []=[];
  valores = [] = [0, 0, 0, 0];

  constructor() {}

  setLabels(labels=String=[]){
    this.labels=labels;
  }

  getDataGrafica() {
    return [
      
        {
          data:this.valores,
          label: 'Preguntas'
        }
      
    ];
  }

  incrementarValor(opcion=Number,valor=Number){

    this.valores[opcion] += valor;


    return this.getDataGrafica()

  }



}


const grafica = new GraficaData;

app.get('/grafica', (req, res) => {

  res.json(grafica.getDataGrafica());

});

app.post('/grafica',(req,res)=>{

  const opcion =req.body.opcion;
  const unidades= Number(req.body.unidades);

  grafica.incrementarValor(opcion,unidades);

  io.emit('cambio-grafica',grafica.getDataGrafica());

  res.json(grafica.getDataGrafica());

});