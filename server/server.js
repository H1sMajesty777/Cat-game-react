const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Простое логирование
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Тестовый эндпоинт
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Здесь будут эндпоинты для аутентификации
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body
  
  // Заглушка для будущей регистрации
  res.json({ 
    message: 'Registration endpoint (will be implemented)',
    username 
  })
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  
  // Заглушка для будущего логина
  res.json({ 
    message: 'Login endpoint (will be implemented)',
    token: 'mock-jwt-token',
    username 
  })
})

// Эндпоинты для игровых данных
app.get('/api/game/leaderboard', (req, res) => {
  // Заглушка для таблицы лидеров
  res.json({
    leaderboard: [
      { username: 'Player1', score: 100 },
      { username: 'Player2', score: 80 },
      { username: 'Player3', score: 60 }
    ]
  })
})

app.post('/api/game/score', (req, res) => {
  const { score } = req.body
  
  // Заглушка для сохранения счета
  res.json({ 
    message: 'Score saved',
    score 
  })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints:`)
  console.log(`   GET  /api/health`)
  console.log(`   POST /api/auth/register`)
  console.log(`   POST /api/auth/login`)
  console.log(`   GET  /api/game/leaderboard`)
  console.log(`   POST /api/game/score`)
})