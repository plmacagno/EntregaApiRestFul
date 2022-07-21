const fs = require('fs/promises');
const CFile = require('./contenedor/fs-mode');
const express = require("express");
const { Router } = express;
const multer = require ('multer');
const app = express();


// Utilizar JSON en las request (Cuerpo)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//
const instanceFile = new CFile('./productos/productos.json');
const routerProductos = Router();


app.get('/api/productos', async (req, res)=>{
   
    try{
        await instanceFile.open();
        return res.json(await instanceFile.getAll())
    } catch (error) {
        console.log(error.message);
    }   
 })


app.post('/api/productos/', async (req, res) => {
    try{ 
        const body = req.body;
        let newProd = {
            title: "Telefono Antiguo",
            price: 3500,
            thumbnaid: "https://pixabay.com/es/photos/tel%c3%a9fono-viejo-anticuado-vintage-1916165/",
                        
        };
        
        await instanceFile.save(newProd);
        return res.status(201).json({prod:newProd});
               
    
    } catch (error) {
        console.log(error.message);
    }   
        

});

app.get("/api/productos/:id", async (req, res) =>{
    try{
        await instanceFile.open();
        const id = parseInt(req.params.id);
        if ( id >= 0 ) {
            const usuario = await instanceFile.getById(id);
            return res.json(usuario);
        }else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error.message);
    }   
})

app.put("/api/productos/:id", async (req, res)=>{

    try{   
        await instanceFile.open();        
        const id = parseInt(req.params.id);
        const nuevo = req.body;
        const prod = await instanceFile.getById(id);
        if (prod){
            const updateProd = await instanceFile.update(id,nuevo);
            return res.status(201).json({prod:updateProd});
            
        }else {
                return res.status(404).json({message:'producto no encontrado'});
        }
    }catch (error) {
        console.log(error.message);
    }   

})

routerProductos.delete('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        if (id >= 0) {

           const producto = instanceFile.deleteById(id);
           
           if (producto){ 
            
            const updateProd = await instanceFile.saveAll(instanceFile);
            return res.status(201).json({prod:updateProd});
           
            } else {
             res.status(404).send({ error: 'Producto no encontrado' });
            }
        }
    }catch (error) {
        console.log(error.message);
    }   
})

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/public/index.html")
})

var storage = multer.diskStorage({
    destination : function (req, file, cb){
    cb (null, 'uploads')
    },
    filename: function (req, file, cb){
    cb (null, file.fieldname + '-' + Date.now ()+ '.jpg')
    }
})
var upload = multer({storage: storage});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a Image');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
})


app.use("/api/productos", routerProductos);

const PORT = 8080;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`)
});

server.on("error", error => console.log(`Error: ${error}`))