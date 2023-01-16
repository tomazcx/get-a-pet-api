import express from 'express'
import cors from 'cors'
import userRouter from './routes/UserRoutes.js'
import petRouter from './routes/PetRoutes.js'
const app = express()

//allow to send json responses
app.use(express.json())

//solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

//public folder for imgs
app.use(express.static("public"))

//routes
app.use("/user", userRouter)
app.use("/pet", petRouter)

app.listen(8080, () => console.log("Servidor iniciado em localhost:8080"))