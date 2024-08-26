import './App.css';
import StockTile from './components/StockTile';
// import ToDoListTile from './components/ToDoListTile';
// import ScheduleTile from './components/ScheduleTile';

function App() {
  return (

      <div className="dashboard">
      <StockTile symbol="NVDA" />  {/* 엔비디아 주식 */}
      <StockTile symbol="AAPL" />  {/* 애플 주식 */}
      <StockTile symbol="TSLA" />  {/* 애플 주식 */}
    </div>
  );
}

export default App;
