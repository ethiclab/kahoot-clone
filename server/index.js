(async function() {
require('dotenv').config();
const express = require('express')
    ,session = require('express-session')
    ,passport = require('passport')
    ,Auth0Stratagy = require('passport-auth0')
    ,bodyParser = require('body-parser')
    ,socket = require('socket.io')
    ,quizCtrl = require('./quizCtrl')
    ,{Quiz} = require('./utils/quiz')

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING,
    FRONTEND_URL
} =  require('./cfg.js')

const app = express();
const io = socket(app.listen(SERVER_PORT, ()=>{console.log('Connected on port',SERVER_PORT)}))

//When a connection to server is made from client
io.on('connection', socket => {
    
    // Host Connection
    socket.on('host-join', (data) => {
        socket.join(data.pin)   
    })
    //Player Join Room
    socket.on('player-joined', (data) => {
       socket.join(data) 
    })
    //Add player to Quiz Object
    socket.on('player-add', (data) => {
        socket.to(`${data.selectedPin}`).emit('room-joined', {name: data.nickname, id: socket.id});
    })

    socket.on('question-over', (data) => {
        socket.to(`${data.pin}`).emit('question-over')
    })
    socket.on('next-question', (data) => {
        socket.to(`${data.pin}`).emit('next-question')

    })
    socket.on('question-answered', (data) => {
        socket.to(data.pin).emit('player-answer', {name : data.name, answer: data.answer})
    })
   
    socket.on('sent-info', (data) => {
        io.to(data.id).emit('sent-info', {answeredCorrect: data.answeredCorrect, score: data.score});
    })

})

app.use(express.static(`${__dirname}/../build`))
app.use(bodyParser.json())
const pgp = require('pg-promise')()
const db = pgp(CONNECTION_STRING)
app.set('db', db)

app.use(session({
    secret:SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

///////auth0
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Stratagy({
    domain:DOMAIN,
    clientID:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    callbackURL:CALLBACK_URL,
    scope:'openid profile'
}, async (accessToken, refreshToken, extraParams, profile, done) => {
    console.log('profile', profile)
    // DB calls here 
    const db = app.get('db')
    let { id, displayName, picture } = profile
    const user = await db.oneOrNone(`SELECT * FROM USERS WHERE AUTH_ID = $1`, [ id ])
    console.log('user', user)
    if(user) {
      done(null, user.id)
    } else {
      const createdUser = await db.one(`INSERT INTO USERS (USER_NAME, AUTH_ID) VALUES ($1, $2) RETURNING *`, [ displayName, id ])
      done(null, createdUser.id)
    }
}))

passport.serializeUser( (id, done) => {
    done(null, id)
})

passport.deserializeUser( async (id, done) => {
    const db = app.get('db')
    const user = await db.one(`SELECT * FROM USERS WHERE ID = $1`, [ id ])
    done(null, user)
})

function check(req,res,next) {
    if(req.user){res.redirect(`${FRONTEND_URL}#/host`)
    } else {next()}
}
app.get('/auth', check, passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0',{
    successRedirect:`${FRONTEND_URL}#/host`
}))
app.get('/auth/logout', (req,res)=>{req.logOut();res.redirect(`${FRONTEND_URL}`)})

app.get('/auth/user', (req,res)=>{ 
    req.user
        ? res.status(200).send(req.user)
        : res.status(401).send('Not signed in')
})


/////////////////// DB calls for quizzes

//Get

app.get('/api/getQuizzes', quizCtrl.getQuizzes )
app.get('/api/getquestions/:id', quizCtrl.getQuestions)
app.get('/api/getquestion/:id', quizCtrl.getQuestion)
app.get('/api/getquiz/:id', quizCtrl.getQuiz)

//Put

app.put('/api/updatequestion', quizCtrl.updateQuestion)
app.put('/api/updatequiz', quizCtrl.updateQuiz)

//Post

app.post('/api/newquestion', quizCtrl.addQuestion)
app.post('/api/newquiz', quizCtrl.newQuiz ) 

//Delete

app.delete('/api/deletequiz/:id', quizCtrl.deleteQuiz)
app.delete('/api/deletequestion/:id', quizCtrl.deleteQuestion)
})()
