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

  meses = ["enero", "febrero", "marzo", "abril"];
  valores = [] = [0, 0, 0, 0];

  constructor() {}

  getDataGrafica() {
    return [
      
        {
          data:this.valores,
          label: "Ventas"
        }
      
    ];
  }

  incrementarValor(mes=String,valor=Number){

    mes=mes.toLowerCase().trim();

    for (let i in this.meses){

        if(this.meses[i]=== mes){

            this.valores[i]+= valor;
        }

    }


    return this.getDataGrafica()

  }



}


const grafica = new GraficaData;

app.get('/grafica', (req, res) => {

  res.json(grafica.getDataGrafica());

});

app.post('/grafica',(req,res)=>{

  const mes =req.body.mes;
  const unidades= Number(req.body.unidades);

  grafica.incrementarValor(mes,unidades);

  io.emit('cambio-grafica',grafica.getDataGrafica());

  res.json(grafica.getDataGrafica());

});