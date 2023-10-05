import { useEffect, useState } from 'react'
import './App.css'
import allLists from './components/all-jsons'
import Tile from './components/Tile'
import shuffleArray from './components/shuffle-array'


function App() {
  const [mainScreen, setMainScreen] = useState(true)
  const [selectedOpt, setSelectedOpt] = useState("")
  const [lengthSlot, setLengthSlot] = useState(0)
  const [currentWords, setCurrentWords] = useState([])

  useEffect(() => { readSlotLength() }, [currentWords])

  function hideMainScreen(level, listOfWords) {
    setSelectedOpt(level)
    readStorage(level, listOfWords)
    setMainScreen(prev => !prev)
    setLengthSlot(0)
  }

  // read array from local storage if exist, if not then shuffle 
  function readStorage(selectedLevel, arr) {
    const wordsFromLocStorage = JSON.parse(localStorage.getItem(`${selectedLevel}`)) || shuffleArray(arr)
    setCurrentWords(wordsFromLocStorage)
  }

  function saveInLocal(name, arr) {
    localStorage.setItem(name, JSON.stringify(arr))
  }

  function handleUnhide(id) {
    setCurrentWords(prevWords => prevWords.map(word => word.id === id ? { ...word, hidden: !word.hidden } : word))
  }

  function handleKnown(id) {
    const newArr = currentWords.filter((word) => word.id !== id)
    if (newArr.length === 0) {
      deleteLocal()
    } else {
      setCurrentWords(newArr)
      saveInLocal(`${selectedOpt}`, newArr)
    }
  }

  function handleUnknown(id) {
    const newArr = currentWords.filter((word) => word.id !== id)
    const removedElement = currentWords.filter((word) => word.id === id)
    removedElement[0].hidden = true
    newArr.push(removedElement[0])
    setCurrentWords(newArr)
    saveInLocal(`${selectedOpt}`, newArr)
  }

  // delete local storage data for current set
  function deleteLocal() {
    localStorage.removeItem(`${selectedOpt}`);
    window.location.reload(false);
  }

  // additional slot for saving current list of words
  // START
  function handleSaveSlot() {
    saveInLocal(`${selectedOpt}slot1`, currentWords);
    readSlotLength();
  }

  function handleReadSlot() {
    const readedData = JSON.parse(localStorage.getItem(`${selectedOpt}slot1`))
    readedData && setCurrentWords(readedData)
  }

  function readSlotLength() {
    const readedData = JSON.parse(localStorage.getItem(`${selectedOpt}slot1`))
    readedData ? setLengthSlot(readedData.length) : setLengthSlot(0)
  }
  // additional slot END

  if (mainScreen) {
    // show menu
    return (
      <>
        <h1>SELECT SET</h1>
        {allLists.map((level, ind) => <button key={ind} className="button--menu" onClick={() => hideMainScreen(level.name, level.arr)} >{level.name}</button>)}
      </>
    )
  } else {
    // show selected set
    return (
      <>
        <div className="icons">
          <div className="info">
            <h1>SET {selectedOpt}</h1>
            <h4>REMAIN: {currentWords.length}</h4>
          </div>
          <div class="menu">
            <button className="btn-menu btn-home" onClick={() => setMainScreen(prev => !prev)}>
              <i class="fa-solid fa-house"></i><span>HOME</span>
            </button>
            <button className="btn-menu btn-slot" onClick={handleSaveSlot}>
              <i class="fa-solid fa-arrow-right-to-bracket"></i><span>SAVE</span>
            </button>
            {lengthSlot ? <button className="btn-menu btn-read" onClick={handleReadSlot}><i class="fa-solid fa-arrow-right-from-bracket"></i> <span>READ ({lengthSlot})</span></button> : ""}
          </div>
        </div>
        <div className="card">
          {currentWords.length > 0 &&
            <Tile
              key={currentWords[0].id}
              id={currentWords[0].id}
              wordPol={currentWords[0].wordPol}
              wordEng={currentWords[0].wordEng}
              pron={currentWords[0].pron}
              sentPol={currentWords[0].sentPol}
              sentEng={currentWords[0].sentEng}
              handleUnhide={handleUnhide}
              handleUnknown={handleUnknown}
              handleKnown={handleKnown}
              hidden={currentWords[0].hidden} />}
        </div >
      </>
    )
  }

}

export default App
