import './App.css';
import StockTile from './components/StockTile';
import ToDoListTile from './components/ToDoListTile';
import ScheduleTile from './components/ScheduleTile';
import StockNewsTile from './components/StockNewsTile'; 

function App() {
  return (

      <div className="dashboard">
      <StockTile symbol="NVDA" />  {/* 엔비디아 주식 */}
      <StockTile symbol="AAPL" />  {/* 애플 주식 */}
      <StockTile symbol="TSLA" />  {/* 애플 주식 */}
      <ScheduleTile />
      <ToDoListTile />
      <StockNewsTile symbol="NVDA" /> 
    </div>
  );
}

export default App;
