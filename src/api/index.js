const express=require('express')

const clientesRouter=require('./clientes')
const produtosRouter=require('./produtos')
const lojasRouter=require('./lojas')

const router=express.Router();

router.use('/clientes',clientesRouter)
router.use('/produtos',produtosRouter)
router.use('/lojas',lojasRouter)

module.exports=router