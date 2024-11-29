const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const app = express()

app.use(express.static(path.join(__dirname, 'views'))); 
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config();

app.use(
    cors({
            origin:"*",
            credentials:"true"
        })
)

const userRouter = require('./routes/user')
const sequelize = require('./util/database');
const User = require('./models/user')
const Message = require('./models/messages')
app.use('/user',userRouter)

User.hasMany(Message)
Message.belongsTo(User)

sequelize
.sync()
.then(d=>{

    app.listen(process.env.PORT,()=>{
        console.log("server running at default 3002 port")
    })
}).catch(e=>{
    console.log(e)
})