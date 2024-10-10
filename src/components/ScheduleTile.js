import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ScheduleTile.css';

function ScheduleTile() {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newSchedule, setNewSchedule] = useState({
        title: '',
        description: '',
        hour: '00',
        minute: '00',
    });

    const fetchSchedules = async (date) => {
        const formattedDate = date.toISOString().split('T')[0]; 
        try {
            const response = await axios.get('http://localhost:5000/api/schedules');
            const filteredSchedules = response.data.filter(schedule =>
                schedule.date.startsWith(formattedDate)
            );
            setSchedules(filteredSchedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    useEffect(() => {
        fetchSchedules(selectedDate);
    }, [selectedDate]);

    const handleAddSchedule = async () => {
        if (!newSchedule.title) {
            toast.error("제목을 입력하세요.");
            return;
        }
    
        try {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
    
            const hour = newSchedule.hour || '00';
            const minute = newSchedule.minute || '00';
    
            const fullDate = `${year}-${month}-${day} ${hour}:${minute}:00`;
    
            await axios.post('http://localhost:5000/api/schedules', {
                date: fullDate,
                title: newSchedule.title,
                description: newSchedule.description
            });
            
            setNewSchedule({ title: '', description: '', hour: '00', minute: '00' });
            fetchSchedules(selectedDate); 
            toast.success("일정이 성공적으로 추가되었습니다.");
        } catch (error) {
            console.error('일정 추가 중 오류 발생:', error);
            toast.error("일정 추가 중 오류가 발생했습니다.");
        }
    };
    
    

    return (
        <div className="schedule-tile">
            <h2>스케줄 관리</h2>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
            />
            {/* <h3>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} 스케줄</h3> */}

            {schedules.length > 0 ? (
                <ul>
                    {schedules.map(schedule => (
                        <li key={schedule.id}>
                            <strong>{schedule.title}</strong> - {new Date(schedule.date).toLocaleTimeString()}
                            <p>{schedule.description}</p>
                            {schedule.completed ? <p>완료됨</p> : <p>미완료</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>선택한 날짜에 스케줄이 없습니다.</p>
            )}
            <div className="add-schedule">
                <h3>일정 추가</h3>
                <input
                    type="text"
                    placeholder="제목"
                    value={newSchedule.title}
                    onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })}
                />
                <textarea
                    placeholder="설명"
                    value={newSchedule.description}
                    onChange={e => setNewSchedule({ ...newSchedule, description: e.target.value })}
                ></textarea>
                <div className="time-inputs">
                    <select
                        value={newSchedule.hour}
                        onChange={e => setNewSchedule({ ...newSchedule, hour: e.target.value })}
                    >
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, '0')}>
                                {String(i).padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                    :
                    <select
                        value={newSchedule.minute}
                        onChange={e => setNewSchedule({ ...newSchedule, minute: e.target.value })}
                    >
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, '0')}>
                                {String(i).padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAddSchedule}>일정 추가하기</button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}

export default ScheduleTile;
