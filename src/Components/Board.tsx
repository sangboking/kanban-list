import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, toDoState } from '../atoms';
import DragabbleCard from './DragabbleCard';

const Wrapper = styled.div`
  background-color:${props=>props.theme.boardColor} ;
  padding-top : 10px;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
 background-color: ${props=>props.isDraggingOver ? "#dfe6e9" 
 :props.isDraggingFromThis ? "#b2bec3" :"transparent"};
 flex-grow: 1;
 transition: background-color .3s ease-in-out;
 padding: 20px;
`;

const TrashBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  /* top:0 ;
  left: 0; */
  transition: all 0.2s ease-in;
  &:hover {
    transform: scale(1.3);
    svg {
      color: red;
    }
  }
`;

const Form = styled.form`
  width:100%;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId:string;
}

interface IAreaProps {
  isDraggingOver : boolean;
  isDraggingFromThis : boolean;
}

interface IForm {
  toDo:string;
}


function Board({toDos,boardId}:IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const {register,setValue,handleSubmit} = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  return(
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input 
          {...register("toDo",{required:true})}
          type="text" 
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic,info) => (
          <Area 
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef} 
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard 
                key={toDo.id} 
                index={index} 
                toDoId={toDo.id} 
                toDoText={toDo.text} 
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  )
}

export default Board;