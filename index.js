const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const mongoose=require('mongoose');
const app=express();
const Task=require('./model/task');
const port=4000;
const cors=require('cors');

//Create Http server
const server=http.createServer(app);
const io=socketIO(server);

// Enable CORS
app.use(cors());

//req body middleware
app.use(express.json())
//connect mongoDB

const URI="mongodb+srv://rajkiran335:rajkiran335@cluster0.3frasmh.mongodb.net/task-manager?retryWrites=true&w=majority"
mongoose.connect(URI,{
    useNewUrlParser:true,
   // useUnifiedTopology:true
}).then(()=>{
    console.log(`connected to mongodb.....`);
}).catch((err)=>{
    console.error(`Error while connecting to MongoDB`,err)
})

//Define a route for the HomePasge
app.get('/',(req,res)=>{
    res.send(`Wellcome to the Real-time Task Manager`)
})

//define API routes for tasks
app.get('/tasks',async (req,res)=>{
    try{
        const tasks=await Task.find()
        res.json(tasks)
    }
    catch (err){
        console.error(`error fetching tasks`,err);
        res.status(500).json({error:"Internal Server Error"})
    }
});
//create task

app.post('/tasks',async (req,res)=>{
    console.log(req.body)
    try{
        const task=await Task.create(req.body);
       //emit 'taskCreated' event to all connected clients
        io.emit('taskCreated',task);
        res.status(201).json(task);

    }
    catch(err){
        console.error(`Error creating task`,err);
        res.status(500).json({error:"Internalserver error"})

    }

})
//update task

app.put('/task/:id',async (req,res)=>{
    try{
        const task=await Task.findByIdAndUpdate(req.params.id,{
            status:req.body.status
        })

         if(!task){
            return res.status(404).json({error:"Task not found"})
         }
           //emit 'taskUpdated' event to all connected clients
           io.emit('taskUpdated',task);
         res.json(task)
    }
    catch(err){
        console.error(`Error updating task`,err);
        res.status(500).json({error:'Internal server error'})
    }
})
//delete task api

app.delete('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      // Emit 'taskDeleted' event to all connected clients
      io.emit('taskDeleted', task);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

//socket io connection event
io.on('connection',(socket)=>{
    console.log('New client connected');
    //handle the client disconnection
    socket.on('disconnect',()=>{
        console.log(`Client disconnected`)
    })
})

//start the server
app.listen(port,()=>{
    console.log(`server running  on port ${port}`)
})