const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/api/stock', async (req, res) => {
    let symbol = req.query.symbol;  // 쿼리 파라미터에서 symbol을 가져옵니다.
    
    if (!symbol) {
        return res.status(400).send('symbol 파라미터가 필요합니다.');
    }

    // symbol에 '.O'를 추가합니다.
    symbol += '.O';

    try {
        const response = await axios.get(`https://polling.finance.naver.com/api/realtime/worldstock/stock/${symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('서버에서 데이터를 가져오는 동안 오류가 발생했습니다.');
    }
});

app.listen(port, () => {
    console.log(`프록시 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
