import express from "express"
import mysql from "mysql"
import cors from "cors"
import multer from "multer" //파일 업로드를 위해서 필요한 미들웨어
import path from "path"     //경로 관련 유틸리티 (확장자추출, 경로 결합)       
import { fileURLToPath } from "url" // __filename, __dirname  
import fs from "fs"     //파일 시스템 접근
import bcrypt from "bcrypt"
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json())

//현재 모듈의 파일 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//파일을 업로드할 디렉토리 생성
const uploadDir = path.join(__dirname, "images");

//해당 폴더가 없으면 생성하도록 한다.
fs.mkdirSync(uploadDir, {recursive:true})

//파일업로드된 폴더를 프론트엔드에서 직접 접근할 수 있도록  static 미들웨어로 설정
app.use("/images", express.static(uploadDir))

//프론트엔드에서 서비스 요청할 때 자동 수행되어 
//해당위치에 파일을 복사할  Multer 정보 설정
const storage = multer.diskStorage({
    // 업로드 파일을 저장할 폴더를 지정
    destination:(req,file,cb)=>cb(null,uploadDir),

    //저장할 파일명 
    filename:(req,file,cb)=>cb(null, Date.now() + path.extname(file.originalname))
});

// Multer  인스턴스 생성
const upload = multer({storage});

//////=========회원가입 처리 ===============//////////////////////////////////////////////////////////

// 커넥션 풀 설정
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWWORD,
    port: process.env.PORT,
    database: process.env.DATABASE,
    connectionLimit:10,
    dateStrings:true
});

// 커넥션풀 이용 sql함수
function query(sql, params=[]){
    return new Promise((resolve, reject)=>{
        pool.query(sql, params, (err, rows)=>{
            if(err) return reject(err);
            resolve(rows);
        } )
    });
}



import jwt from "jsonwebtoken"; // jsonwebtoken 라이브러리를 임포트
const JWT_SECRET = "75d42966660aaebaea8e837528a1f71"; // JWT 서명/검증에 사용할 시크릿을 환경변수에서 읽어옵니다.

// ===== JWT 미들웨어 =====
// 로그인 필요 API에 붙여서 요청을 필터링(토큰 검사)합니다.
function auth(req, res, next) { 
  const authHeader = req.headers.authorization || ""; // 요청 헤더에서 Authorization 값을 읽고, 없으면 빈 문자열로 처리
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null; // "Bearer " 접두사가 있으면 토큰 부분만 추출, 아니면 null
  if (!token) { // 토큰이 없는 경우
    return res.status(401).json({ ok: false, msg: "토큰이 없습니다." }); // 401 상태코드로 미인증 응답 반환
  } // if 끝

  try { // 예외 처리 시작 (jwt.verify에서 오류가 날 수 있음)
    const decoded = jwt.verify(token, JWT_SECRET); // 토큰을 검증하고 페이로드를 복호화
    req.user = decoded; // { id, email, name, iat, exp } 등의 정보를 요청 객체에 저장
    next(); // 다음 미들웨어/라우트 핸들러로 진행
  } catch (e) { // 검증 실패(만료/위조 등) 시
    return res.status(401).json({ ok: false, msg: "유효하지 않은 토큰입니다." }); // 401 상태코드로 거부
  } 
} 


//회원가입
app.post("/api/register", async (req, res)=>{
    try{

        // 사용자의 입력값을 각각의 변수에 저장
        const {email, password, name} = req.body;

        // 모든 항목에 입력값이 있는지 확인
        if(!email || !password || !name){
            return res.status(400).json({ok:false, msg:"모든 값을 입력하세요"});
        }

        // 이메일이 중복되는지 확인
        const exists = await query("select id from member where email=?", [email]);

        if(exists.length > 0){
            return res.status(409).json({ok:false, meg:"이미 가입한 이메일입니다."});
        }

        // 사용자가 입력한 비밀번호를 암호화 한다.
        const hashedPassword = await bcrypt.hash(password, 10);


        // 새로운 회원을 insert
        const result = await query("insert into member(email,password,name) values(?,?,?)", [email,hashedPassword,name])
        
        return res.json({
            ok:true,
            user:{id:result.insertId, email, name}
        })

    }catch(e){
        return res.status(500).json({ok:false, msg:"서버오류"});
    }
});

//로그인 처리
app.post("/api/login", async(req, res)=>{
    try{
        const {email, password} = req.body;
        console.log("email:",email);
        console.log("password:",password);
        

        if(!email ||     !password){
            return res.status(400).json({ok:false, msg:"이메일과 비밀번호를 입력하세요"});
        }

        // const rows = await query("select id,email,name,password where email=?",[email]);
        const rows = await query("select id, email, name,password from member where email=?", [email]);

        console.log("db email:",rows[0].email);
        console.log("db password:",rows[0].password);

        if(rows.length === 0){
            return res.status(401).json({ok:false, msg:"존재하지 않는 이메일입니다."});
        }

        // DB에 저장된 비밀번호
        const dbPassword = rows[0].password;

        // 입력받은 비밀번호를 암호화 해서 DB의 비밀번호가 일치하는지 검사
        const match =  await bcrypt.compare(password, dbPassword);

        //비밀번호가 올바르지 않다면
        if(!match){
            return res.status(401).json({ok:false, msg:"이메일 또는 비밀번호가 올바르지 않습니다."});
        }
        
        // 사용자 정보(id, email, name)를 담은 객체를 생성        
        const payload = {id:rows[0].id, email:rows[0].email, name:rows[0].name };           

        // payload를 이용해 JWT 액세스 토큰 생성 (비밀키: JWT_SECRET, 만료시간: 1시간)
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });      

        // 클라이언트에게 로그인 성공 응답(JSON) 반환
        return res.json({       
            ok:true,              // 요청 성공 여부 표시
            msg:"로그인 성공",    // 메시지
            user: payload,        // 사용자 기본 정보(payload)
            accessToken           // 생성된 액세스 토큰
        });

    }catch(e){
        res.status(500).json({ok:false, msg:"서버 오류"})
    }
})


//////////////////////////////////////////////////////////////////////////////

const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    port:process.env.PORT,
    database:process.env.DATABASE
});

db.connect(err =>{
    console.log("db 연결성공");
    console.log("err:",err);
});


//댓글 삭제
app.delete("/comments/:commentId", (req, res)=>{
    const {commentId} = req.params;
    const {pass} = req.body;

    console.log("commentId:",commentId);
    console.log("pass:",pass);
    

    if(!pass) res.status(400).json({message:"pass는 필수입니다."});

    //비밀번호 일치 확인 후 삭제
    const selectSql = "select pass from comment_table where id=?";
    db.query(selectSql, [commentId], (err, rows) =>{
        if(err) return res.status(500).json({message:"DB 오류", err});
        if(rows.length === 0) return res.status(404).json({message:"존재하지 않는 댓글"});

        if(rows[0].pass !== pass){
            res.status(403).json({message:"비밀번호가 일치 하지 않습니다."});
        }

        const deleteSql = "delete from comment_table where id=?";
        db.query(deleteSql, [commentId], (err, result)=>{
            if(err)  return res.status(500).json({message:"DB 오류"});
            return res.status(200).json({message:"댓글 삭제 완료"});
        })
    })
})


// 댓글 목록 조회
app.get("/board/:id/comments", (req, res)=>{
    const {id} = req.params;
    const sql = `select id,board_id,writer,contents, createdAt from comment_table where board_id=? order by id desc`;
    db.query(sql, [id], (err,result)=>{
        if(err) return res.status(500).json({message:"DB 오류",err});
        res.json(result);
    })
})



// 댓글 작성
app.post("/board/:id/comments", (req, res)=>{
    const {id} = req.params;
    const {writer, pass, contents} = req.body;
    console.log("id:",id);
    console.log("writer:",writer);
    console.log("pass:",pass);
    console.log("contents:",contents);

    const sql = `insert into comment_table(board_id,writer,pass,contents) values(?,?,?,?)`;
    db.query(sql,[id,writer,pass,contents], (err,result)=>{
        if(err) return res.status(500).json({message:"DB 오류",err});
        res.status(200).json({id:result.insertId})
    });
})


app.delete("/board/:id", async(req,res)=>{
    const {id} =req.params;
    const sql = "delete from board_table where id=?";
    await db.query(sql, [id], (err, results, fields)=>{
        res.status(200).send("삭제완료");
    })
});



app.put("/board/update/:id", async(req, res)=>{
    const {id,boardTitle, boardContents} = req.body.board;
    console.log("*** 게시물 수정 ***");
    console.log("id:",id);
    console.log("boardTitle:",boardTitle);
    console.log("boardContents:",boardContents);

    const sql = `update board_table set boardTitle=?,boardContents=? where id=?`;
    await db.query(sql,[boardTitle,boardContents,id], (err, results, fields)=>{
        res.status(200).send("수정완료");
    });
});

app.get("/board/list", (req, res)=>{
    console.log("/board/list call");
    const sql = "select * from board_table";
    db.query(sql, (err, results, fields)=>{        
        res.json(results);
        /*
        setTimeout( ()=>{
            res.json(results);
        }, 3000 );
        */
    });
});


app.get("/board/:id", async(req, res)=>{
    const {id} = req.params;
    const hitSql = "update board_table set boardHits = boardHits + 1 where id=?";
    await db.query(hitSql,[id], (err, rows, fields) =>{});
    const sql = "select * from board_table where id=?";
    await db.query(sql, [id], (err, results, fields)=>{
        console.log("results:",results);
        res.json(results);
    })
});



app.post("/board/save", upload.single("image"),(req,res)=>{
    const {boardTitle,boardWriter,boardPass,boardContents} = req.body;
    console.log(boardTitle,boardWriter,boardPass,boardContents);
    
    //업로드한 파일의 정보를 갖고 온다.
    const file = req.file;

    //만약 업로드 한 파일이있으면 파일이름을 그렇지 않으면 null을 저장한다.
    const fname = file? `/images/${file.filename}`:null;
   
    const sql = "insert into board_table(boardTitle,boardWriter,boardPass,boardContents,fname) values(?,?,?,?,?)";
    db.query(sql, [boardTitle, boardWriter, boardPass, boardContents, fname], (err, results, fields)=>{
        console.log("err:",err);
        console.log("results:",results);
        console.log("fields:",fields);
    })
    res.status(200).send("작성완료");
});


app.listen(8000, ()=>{
    console.log("서버 가동!111");
})