import { info } from 'console';
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './Components/Board';

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width:100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width:100%;
  gap:10px;
  grid-template-columns: repeat(3,1fr);
`;





function App() { 
  const [toDos,setToDos] = useRecoilState(toDoState);
  const onDragEnd =(info:DropResult) =>{
    const {destination,draggableId,source} = info;
    if(!destination) return;
    if(destination.droppableId === "trash"){

    }
    if(destination?.droppableId === source.droppableId){
      //동일보드 에서 움직임
      setToDos((allBoards)=>{
        console.log(allBoards)
        console.log(allBoards["To Do"])
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index,1);
        boardCopy.splice(destination?.index,0,taskObj)
        return {
          ...allBoards,
          [source.droppableId]:boardCopy
        }
      })
    }
    if(destination?.droppableId !== source.droppableId){
      //다른보드로 움직임
      setToDos((allBoard)=>{
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination?.droppableId]];
        sourceBoard.splice(source.index,1);
        destinationBoard.splice(destination?.index,0,taskObj)
        return {
          ...allBoard,
          [source.droppableId]:sourceBoard,
          [destination.droppableId]:destinationBoard
        }
      })
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId)=>(
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;


