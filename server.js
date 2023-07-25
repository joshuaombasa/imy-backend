const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'imy'
})
const app = express()

app.use(cors())

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))



app.get('/', (req, res) => {
  res.send('This is heaven')
})

app.post('/upload', upload.single('userImage'), (req, res) => {

  const { name, location } = req.body

  const { originalname, filename, path } = req.file


  const sql = 'INSERT INTO uploaded_files (username, location, original_name, file_name, file_path) VALUES (?, ?, ?, ?, ?)'
  connection.query(
    sql,
    [name, location, originalname, filename, path],
    (error, results) => {
      res.send(results)
    })
})

app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params

  res.sendFile(filename,{root : './uploads/'} )
})

app.get('/getImages', (req, res) => {
  const sql = 'SELECT * FROM uploaded_files';
  connection.query(sql, (error, results) => {
    if (error) {
      // Handle any database error
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Unable to fetch images' });
    } else {
      // const images = results.map((row) => ({
      //     id: row.id,
      //     name: row.username,
      //     location: row.location,
      //     url: `http://localhost:3000/uploads/${row.file_name}`, // Full URL to access the image
      //   }));
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('App listening on 3000')
})

// app.get('/users', (req, res) => {
//     let sql = `SELECT original_name FROM uploaded_files`
//     connection.query(
//         sql,
//         (error, result) => {
//             res.send(result)
//         }
//     )
// })