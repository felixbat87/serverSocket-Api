const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
//cors
app.use(cors({ origin: true, credentials: true }));
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: true, credentials: true } });
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
  mapaSocket(socket);

});



class Marcador {

  constructor(
    id = String,
    nombre = String,
    lng = Number,
    lat = Number,
    color = String
  ) {}

}

class Mapa{

  marcadores =Marcador={
  

   '1': {
      id: '1',
      nombre: 'Fernando',
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      color: '#dd8fee'
    },
   '2': {
      id: '2',
      nombre: 'Amy',
      lng: -75.75195645527508, 
      lat: 45.351584045823756,
      color: '#790af0'
    },
   '3': {
      id: '3',
      nombre: 'Orlando',
      lng: -75.75900589557777, 
      lat: 45.34794635758547,
      color: '#19884b'
    }




  }
  

 constructor(){}

 getMarcadores(){
  
   return this.marcadores;

 }

 agregarMarcador(marcador=Marcador){

  this.marcadores[marcador.id] =marcador;


 }

 borrarMarcador(id=String){

  delete this.marcadores[id];
  return this.getMarcadores();

 }

 moverMarcador(marcador=Marcador){

  this.marcadores[marcador.id].lng=marcador.lng;
  this.marcadores[marcador.id].lat=marcador.lat;

 }


}

//Mapa Rest Servir
//Sockets conexion
const mapa=new Mapa();

function mapaSocket(socket){

  socket.on("marcador-nuevo",(marcador=Marcador)=>{
 
    mapa.agregarMarcador(marcador);
    socket.broadcast.emit("marcador-nuevo",marcador);

      
  });

//Borrar marcador 
  socket.on("marcador-borrar",(id=String)=>{
 
    mapa.borrarMarcador(id);
    socket.broadcast.emit("marcador-borrar",id);
    
      
  });
  //Mover Marcador
  socket.on("marcador-mover",(marcador=Marcador)=>{
 
    mapa.moverMarcador(marcador);
    socket.broadcast.emit("marcador-mover",marcador);
    
      
  });

}






app.get('/mapa',(req,res)=>{

  res.json(mapa.getMarcadores());

});


