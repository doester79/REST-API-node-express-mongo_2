// To Run: use npm run dev

const express = require('express')
const app = express()
const mongoose =require('mongoose')
const Product = require('./models/productModel')

require('dotenv/config');   //file containing login info for mongodb cloud atlas

//middleware
app.use(express.json())

//connect to mongodb cloud atlas
mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser:true,
        useUnifiedTopology:true 
    },)
    .then(()=> {
        app.listen(process.env.PORT, ()=> {
            console.log('\"console.log:\" Node API app on port', process.env.PORT)
        });
        console.log('Connected Successfully to MongoDb')
    })
    .catch((err)=> {console.error(err); 
});

// routes
app.get('/', (req, res) => {
    res.send('Node Api')
});

app.get('/products', async (req, res) => {
    try{
        const products = await Product.find({});
        res.status (200).json(products);
    }catch(error){
        res.status(500).json ({message: error.message})
    }
});


app.post('/products', async(req, res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product);

    }catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

//Update item in database
app.put('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            //cannot find product in db
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.delete('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})