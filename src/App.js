import { useRef, useState } from "react";
import styled from "styled-components";
import { motion, LayoutGroup } from "framer-motion";

const Container = styled(motion.div)`
  min-height: 80px;
  width: 80px;
  background-color: grey;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const Node = styled(motion.div)`
  height: 50px;
  width: 50px;
  background-color: blue;
  border-radius: 50%;
  pointer-events: ${({ dragging }) => (dragging ? "none" : "auto")};
  //remove the pointer events when the element is being dragged this will allow the
  //onMouseUpCapture to fire on the drop target
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
`;

const Actor = ({ member, setDraggedItem }) => {
  const [dragging, setDragging] = useState(false);

  function startDrag() {
    setDragging(true);
    setDraggedItem(member);
  }

  function endDrag() {
    setDragging(false);
    setTimeout(() => {
      setDraggedItem("");
    }, 0);
    //this setTimeout is important it allows the the current dragged
    //item state to be written to the drop target array before the dragged item is reset
  }

  return (
    <Node
      drag
      dragConstraints={{ left: 0, right: 0, bottom: 0, top: 0 }}
      dragElastic={1}
      dragTransition={{ bounceStiffness: 0 }}
      //need the drag constraints, elastic, and transition in order for things to work right
      //try commenting them out and see how it works
      onDragStart={startDrag}
      onDragEnd={endDrag}
      dragging={dragging}
      //this is the boolean that gets passed to the styled component to remove the pointerEvents
      //not sure why console throws an error for this
    >
      {member}
    </Node>
  );
};

function App() {
  const [team1, setTeam1] = useState(["1", "2", "3", "4", "5"]);
  const [team2, setTeam2] = useState([]);
  const [draggedItem, setDraggedItem] = useState("");

  function handleDrop(team) {
    if (draggedItem.length > 0) {
      if (team === "team2") {
        setTeam2([...team2, draggedItem]);
        let copy = JSON.parse(JSON.stringify(team1));
        setTeam1(copy.filter((member) => member !== draggedItem));
      } else if (team === "team1") {
        setTeam1([...team1, draggedItem]);
        let copy = JSON.parse(JSON.stringify(team2));
        setTeam2(copy.filter((member) => member !== draggedItem));
      }
    }
  }

  return (
    <div className='App'>
      <Container onMouseUpCapture={() => handleDrop("team1")}>
        <LayoutGroup>
          {team1.map((member, i) => (
            <Actor key={i} setDraggedItem={setDraggedItem} member={member} />
          ))}
        </LayoutGroup>
      </Container>

      <Container onMouseUpCapture={() => handleDrop("team2")}>
        {team2.map((member, i) => (
          <Actor key={i} setDraggedItem={setDraggedItem} member={member} />
        ))}
      </Container>
    </div>
  );
}

export default App;
