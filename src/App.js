import './App.css';
import StockTile from './components/StockTile';
import ToDoListTile from './components/ToDoListTile';
import ScheduleTile from './components/ScheduleTile';
import StockNewsTile from './components/StockNewsTile'; 

function App() {
  return (

      <div className="dashboard">
      <StockTile symbol="NVDA" />
      <StockTile symbol="AAPL" />
      <StockTile symbol="TSLA" />
      <ScheduleTile />
      <ToDoListTile />
      <StockNewsTile symbol="NVDA" />
    </div>
  );
}

export default App;
