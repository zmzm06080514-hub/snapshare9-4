import "../assets/css/Update.css"
import {useParams, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios"

const Update = ()=>{
    const navigate = useNavigate();
    const {id} = useParams();
    const [board, setBoard] = useState({
        id:"",
        boardTitle:"",
        boardWriter:"",       
        boardContents:""
    });

    useEffect(()=>{
        const list_db = axios.get(`http://localhost:8000/board/${id}`).then((res)=>{
          console.log(res.data[0]);
          setBoard(res.data[0]);
        });
    },[]);

    const inputUpdate = (e) =>{
        const {name, value} = e.target;
        setBoard({
            ...board,
            [name]:value
        });
       // console.log(board);
    }
    
    const boardUpdate = async (e)=>{
        e.preventDefault();   
        setBoard({
            ...board,
            id:id
        });
        console.log("수정할 board:",board);
        let res = await axios.put(`http://localhost:8000/board/update/${id}`, {
            board:board
        });
        console.log("res:",res);
        navigate(`/board/${id}`)
    }

    return (
        <div className="update-page">
            <h2>Update.jsx</h2>
            <form onSubmit={boardUpdate}>
                제목 : <input type="text" name="boardTitle" value={board.boardTitle || ""} onChange={inputUpdate}/><br/>
                작성자 : <input type="text" name="boardWriter" value={board.boardWriter || ""} onChange={inputUpdate}/><br/>                
                내용 : <input type="text" name="boardContents" value={board.boardContents || ""} onChange={inputUpdate}/><br/>
                <input type="submit" value={"수정"}/>
            </form>
        </div>
    );
}

export default Update;