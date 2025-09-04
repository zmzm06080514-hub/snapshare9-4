import "../assets/css/Save.css"
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Save = () =>{
     
    const navigate = useNavigate();

    const [board, setBoard] = useState({
        boardTitle:"",
        boardWriter:"",
        boardPass:"",
        boardContents:"",
        image:null
    });

    const fileUpdate = (e)=>{
        setBoard({
            ...board,
            image:e.target.files[0]
        });
    }

    const inputUpdate = (e) =>{
        const {name, value} = e.target;
        setBoard({
            ...board,
            [name]:value
        });
       // console.log(board);
    }

    const boardSave = async (e) =>{
        e.preventDefault();

        //파일업로드와 함께 다른데이터를 서버로 전송하려면 멀티파트 전송 객체를 생성
        const formData = new FormData();
        formData.append("boardTitle", board.boardTitle);
        formData.append("boardWriter", board.boardWriter);
        formData.append("boardPass", board.boardPass);
        formData.append("boardContents", board.boardContents);

        if(board.image) formData.append("image", board.image);
        
        console.log(board);
        let res = await axios.post("http://localhost:8000/board/save", formData);
        console.log("res",res);
        setBoard("");
        navigate("/list")
    }

    return(
        <div className="form-page">
            <h2>Save.jsx</h2>
            <form onSubmit={boardSave}>
                제목 : <input type="text" name="boardTitle" value={board.boardTitle || ""} onChange={inputUpdate}/><br/>
                작성자 : <input type="text" name="boardWriter" value={board.boardWriter || ""} onChange={inputUpdate}/><br/>
                비밀번호 : <input type="text" name="boardPass" value={board.boardPass || ""} onChange={inputUpdate}/><br/>
                내용 : <input type="text" name="boardContents" value={board.boardContents || ""} onChange={inputUpdate}/><br/>
                파일 : <input type="file" accept="image/*" onChange={fileUpdate}/>
                <input type="submit" value={"작성"}/>
            </form>
        </div>
    );    
}

export default Save;