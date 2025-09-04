import "../assets/css/Detail.css"

import {useParams, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";



const Detail = ()=>{

    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [showDeletePass, setShowDeletePass] = useState(false);
    const [password, setPassword] = useState("");


    const {id} = useParams();
    const [board, setBoard] = useState("");

    // 댓글 상태 
    const [comments, setComments] = useState([])     // 모든 댓글 목록    
    const [newComment, setNewComment] = useState({  
        writer:"", //댓글 작성자
        pass:"",    // 댓글 비밀번호
        comments:"" //댓글 내용
    });

    const [commentDeletePass, setCommentDeletePass] = useState("");  // 삭제용 비밀번호
    const [deleteCommentId, setDeleteCommentId] = useState(null);    // 삭제하려는 댓글의 ID
    
  


    // 댓글 입력값 변경 핸들러 
    const onNewCommentChange = (e)=>{
        const {name, value} = e.target;
        setNewComment({
            ...newComment,
            [name]: value
        });
    }

    // 새 댓글 작성 후 서버에 저장하는 함수
    const submitNewComment = async (e) =>{
        e.preventDefault();
        const {writer, pass, contents } = newComment;

        // 필수 항목 확인
        if(!writer || !pass  || !contents){
            alert("작성자/비밀번호/내용을 입력하세요");
            return;
        }

        console.log(newComment);

        //백엔드에 댓글 등록 요청
        await axios.post(`http://localhost:8000/board/${id}/comments`,newComment);
        setNewComment({writer:"", pass:"", contents:""})

        //댓글 등록한 후에 바로 목록을 조회하도록 한다.
        fetchComments();
    }


    // 특정 댓글 삭제 모드로 전환하는 함수
    const openDeleteComment = (commentId)=>{
        setDeleteCommentId(commentId) ;    // 삭제할 댓글 ID 저장   
        setCommentDeletePass("");           // 비밀번호 입력창 초기화
    }

    // 댓글 삭제 확인 및 실행 함수
    const confirmDeleteComment = async ()=>{

        try{
             // 비밀번호 포함하여 백엔드에  delete를 요청
            await axios.delete(`http://localhost:8000/comments/${deleteCommentId}`,{data:{pass:commentDeletePass}})

            // 삭제 후 상태 초기화 및 목록 갱신
            setCommentDeletePass("");
            setDeleteCommentId(null);
            fetchComments();
        }catch(e){
            alert("삭제 실패");
        }
    }


    const updateReq = ()=>{
        setShowPass(true);
    }

    const deleteReq = ()=>{
        setShowDeletePass(true);
    }

    const passInput = (e)=>{
        const {name, value} = e.target;
        setPassword(value);
    }

    const passCheck = () =>{
        if(password === board.boardPass){
            navigate(`/update/${board.id}`);
        }else{
            alert("비밀번호가 일치하지 않습니다.");
        }
    }

    const deletPassCheck = ()=>{
        if(password === board.boardPass){
           axios.delete(`http://localhost:8000/board/${id}`).then((res)=>{
                navigate("/list");
           });
        }else{
            alert("비밀번호가 일치하지 않습니다.");
        }
    }

    useEffect(()=>{
        const list_db = axios.get(`http://localhost:8000/board/${id}`).then((res)=>{
          console.log(res.data[0]);
          setBoard(res.data[0]);

          //댓글 목록 가져오는 함수 호출
          fetchComments();   
        });
    },[]);

    const fetchComments= ()=>{
        axios.get(`http://localhost:8000/board/${id}/comments`).then((res)=>{
            console.log("댓글목록:",res.data);
            setComments(res.data);            
        });
    }
 
    return (
        <div className="detail-page">
            <h2>게시물 상세</h2>
            <h3>요청 id : {id}</h3>
            <table className="detail-table">
            <tbody>
                <tr>
                    <td>id</td>
                    <td>{board.id}</td>
                </tr>
                <tr>
                    <td>title</td>
                    <td>{board.boardTitle}</td>
                </tr>
                <tr>
                    <td>writer</td>
                    <td>{board.boardWriter}</td>
                </tr>
                <tr>
                    <td>contents</td>
                    <td>{board.boardContents}</td>
                </tr>
                <tr>
                    <td>hits</td>
                    <td>{board.boardHits}</td>
                </tr>
                <tr>
                    <td>date</td>
                    <td>{board.createdAt}</td>
                </tr>
                <tr>
                    <td>이미지</td>
                    <td>
                        {
                            board.fname?<img src={`http://localhost:8000${board.fname}`}/> : 'No Image'
                        }
                    </td>
                </tr>
            </tbody>
            </table>




            <button onClick={updateReq}>수정</button>
            {
                showPass && (
                  <div>
                    <input type="text" value={password} onChange={passInput}/>
                    <button onClick={passCheck}>확인</button>
                  </div>  
                )
            }
            <button onClick={deleteReq}>삭제</button>
            {
                showDeletePass && (
                   <div>
                        <input type="text" value={password} onChange={passInput}/>
                        <button onClick={deletPassCheck}>확인</button>
                   </div> 
                )
            }

            {/*  ====== 댓글 작성 폼 ======  */}
            <hr/>
            <h3>댓글</h3>
            <form className="comment-form" onSubmit={submitNewComment}>
                <input type="text"  name="writer" placeholder="작성자" value={newComment.writer} 
                    onChange={onNewCommentChange}/>
                <input type="password"  name="pass" placeholder="비밀번호" value={newComment.pass} 
                    onChange={onNewCommentChange}/>
                <input type="text"  name="contents" placeholder="댓글 내용을 입력하세요" value={newComment.contents} 
                    onChange={onNewCommentChange}/>
                <button type="submit">댓글 등록</button>
            </form>
            
            {/* ===== 댓글 목록  ===== */}
            <ul className="comment-list">
                {
                    comments.map((c)=>(
                        <li key={c.id} className="comment-item">
                            <div className="comment-meta">
                                <b>{c.writer}</b><span>{c.createdAt}</span>
                                <div className="comment-contents">{c.contents}</div>

                                {/* 댓글 삭제 버튼 */}
                                <div className="comment-actions">
                                    <button onClick={()=>openDeleteComment(c.id)}>댓글 삭제</button>
                                </div>

                                {/* 댓글 삭제시 비밀번호 입력창 표시 */}
                                {
                                    deleteCommentId === c.id && (
                                        <div className="comment-delete_box">
                                            <input type="password" placeholder="댓글 비밀번호"
                                                value={commentDeletePass}
                                                onChange={(e)=>setCommentDeletePass(e.target.value)}/>
                                            <button onClick={confirmDeleteComment}>확인</button>
                                            <button onClick={()=>setCommentDeletePass("")}>취소</button>
                                        </div>
                                    )
                                }
                            </div>
                        </li>
                    ))
                }
                {/* 댓글이 없는 경우 */}
                {comments.length === 0 && (<li className="no-comments">아직 댓글이 없습니다.</li>) }
            </ul>

        </div>
    )
}

export default Detail;