import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockTile({ symbol }) {  // 'symbol'을 props로 받습니다.
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/stock?symbol=${symbol}`);
                const data = response.data;

                if (data && data.datas) {
                    const stockInfo = data.datas[0];
                    setStockData(stockInfo);
                } else {
                    console.error('API 데이터 가져오기 실패:', data);
                }
            } catch (error) {
                console.error('데이터를 가져오는 동안 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);  // 'symbol'이 변경될 때마다 데이터를 다시 가져옵니다.

    return (
        <div className="tile">
            <h2>{symbol} 주식</h2>
            {loading ? (
                <p>데이터를 불러오는 중...</p>
            ) : stockData ? (
                <div>
                    <p>종가: {stockData.closePrice} USD</p>
                    <p>전일 대비: {stockData.compareToPreviousClosePrice} ({stockData.fluctuationsRatio}%)</p>
                    <p>시가: {stockData.openPrice} USD</p>
                    <p>고가: {stockData.highPrice} USD</p>
                    <p>저가: {stockData.lowPrice} USD</p>
                    <p>거래량: {stockData.accumulatedTradingVolume}</p>
                    <p>거래 가치: {stockData.accumulatedTradingValue}</p>
                    <p>마지막 거래 시간: {new Date(stockData.localTradedAt).toLocaleString()}</p>
                    {stockData.overMarketPriceInfo && (
                        <div>
                            <h3>애프터 마켓 가격</h3>
                            <p>가격: {stockData.overMarketPriceInfo.overPrice} USD</p>
                            <p>전일 대비: {stockData.overMarketPriceInfo.compareToPreviousClosePrice} ({stockData.overMarketPriceInfo.fluctuationsRatio}%)</p>
                            <p>상태: {stockData.overMarketPriceInfo.overMarketStatus}</p>
                            <p>마지막 거래 시간: {new Date(stockData.overMarketPriceInfo.localTradedAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>주식 데이터를 불러올 수 없습니다.</p>
            )}
        </div>
    );
}

export default StockTile;
