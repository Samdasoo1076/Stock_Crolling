import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StockNewsTile.css';

function StockNewsTile({ symbol }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/news?symbol=${symbol}`);
                const data = response.data;

                if (data && data.stockNews.length > 0) {
                    // stockNews에서만 뉴스 항목을 추출
                    const articles = data.stockNews.flatMap(newsGroup => newsGroup.items);
                    setNews(articles);
                } else {
                    console.error('API 데이터 가져오기 실패:', data);
                }
            } catch (error) {
                console.error('데이터를 가져오는 동안 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [symbol]);

    return (
        <div className="news-tile">
            <h2>{symbol} 관련 뉴스</h2>
            {loading ? (
                <p>뉴스를 불러오는 중...</p>
            ) : news.length > 0 ? (
                <ul>
                    {news.map((article, index) => (
                        <li key={index} className="news-item">
                            {article.imageOriginLink ? (
                                <img src={article.imageOriginLink} alt={article.title} />
                            ) : null}
                            <div className="news-item-content">
                                <h3>
                                    <a href={`https://finance.naver.com/news/news_read.naver?article_id=${article.articleId}&office_id=${article.officeId}`} target="_blank" rel="noopener noreferrer">
                                        {article.title}
                                    </a>
                                </h3>
                                <p>{article.body.substring(0, 120)}...</p>
                                <p className="news-source">{article.officeName} | {new Date(article.datetime).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>뉴스가 없습니다.</p>
            )}
        </div>
    );
}

export default StockNewsTile;
