const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // JSON 형식의 본문을 파싱하기 위한 미들웨어

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2134',
    database: 'My_web',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 주식 정보
app.get('/api/stock', async (req, res) => {
    let symbol = req.query.symbol;
    
    if (!symbol) {
        return res.status(400).send('symbol 파라미터가 필요합니다.');
    }

    symbol += '.O';

    try {
        const response = await axios.get(`https://polling.finance.naver.com/api/realtime/worldstock/stock/${symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('서버에서 데이터를 가져오는 동안 오류가 발생했습니다.');
    }
});

// 주식 뉴스 
app.get('/api/news', async (req, res) => {
    let symbol = req.query.symbol;
    if (!symbol) {
        return res.status(400).send('symbol 파라미터가 필요합니다.');
    }
    
    if (!symbol.endsWith('.O')) {
        symbol += '.O';
    }

    const url = `https://api.stock.naver.com/news/integration/${symbol}`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('서버에서 데이터를 가져오는 동안 오류가 발생했습니다:', error);
        res.status(500).send('서버에서 뉴스를 가져오는 동안 오류가 발생했습니다.');
    }
});

// 모든 스케줄 가져오기
app.get('/api/schedules', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM schedules ORDER BY date');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
});

// 일정 추가 엔드포인트
app.post('/api/schedules', async (req, res) => {
    const { date, title, description } = req.body;

    console.log('Received date:', date); // 이 줄을 추가하여 fullDate가 제대로 전달되는지 확인

    if (!date || !title) {
        return res.status(400).send('날짜와 제목은 필수입니다.');
    }

    try {
        const query = 'INSERT INTO schedules (date, title, description, completed) VALUES (?, ?, ?, FALSE)';
        const [result] = await pool.execute(query, [date, title, description]);

        res.status(201).json({ id: result.insertId, date, title, description, completed: false });
    } catch (error) {
        console.error('일정 추가 중 오류 발생:', error);
        res.status(500).send('서버 오류로 인해 일정을 추가할 수 없습니다.');
    }
});


// 스케줄 업데이트하기 (완료 여부와 완료 날짜 포함)
app.put('/api/schedules/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        // 먼저 기존 스케줄 데이터를 가져옵니다.
        const [rows] = await pool.query('SELECT * FROM schedules WHERE id = ?', [id]);
        const existingSchedule = rows[0];

        if (!existingSchedule) {
            return res.status(404).json({ error: '스케줄을 찾을 수 없습니다.' });
        }

        // 업데이트 시 필드를 변경하지 않는다면 기존 값을 사용합니다.
        const date = existingSchedule.date;
        const title = existingSchedule.title;
        const description = existingSchedule.description;
        const completedAt = completed ? new Date() : null;

        // 업데이트 쿼리 실행
        const [result] = await pool.query(
            'UPDATE schedules SET date = ?, title = ?, description = ?, completed = ?, completed_at = ? WHERE id = ?',
            [date, title, description, completed, completedAt, id]
        );

        res.json(result);
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
});


// 스케줄 삭제하기
app.delete('/api/schedules/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
        res.json(result);
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Failed to delete schedule' });
    }
});

// 모든 할 일 목록 가져오기
app.get('/api/todo', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM todo_list ORDER BY created_at');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching todo list:', error);
        res.status(500).json({ error: 'Failed to fetch todo list' });
    }
});

// 할 일 추가하기
app.post('/api/todo', async (req, res) => {
    const { task } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO todo_list (task) VALUES (?)', [task]);
        res.json({ id: result.insertId, task, completed: false });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// 할 일 업데이트하기 (완료 여부와 완료 날짜 포함)
app.put('/api/todo/:id', async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    try {
        const completedAt = completed ? new Date() : null;
        const [result] = await pool.query(
            'UPDATE todo_list SET task = ?, completed = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [task, completed, completedAt, id]
        );
        res.json(result);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// 할 일 삭제하기
app.delete('/api/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM todo_list WHERE id = ?', [id]);
        res.json(result);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(port, () => {
    console.log(`프록시 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
