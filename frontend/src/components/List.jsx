// List.jsx
import "../assets/css/List.css"
import { useEffect, useMemo, useState } from "react"; // React 훅 import
import axios from "axios"; // HTTP 통신을 위한 axios
import { Link } from "react-router-dom"; // 라우팅을 위한 Link 컴포넌트
import loadingGIF from "../assets/loading.gif";

const PAGE_SIZE = 5; // 한 페이지에 보여줄 게시글 수

const List = () => {
  // 상태 관리
  const [list, setList] = useState([]); // 전체 게시물 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [err, setErr] = useState(null); // 에러 메시지
  const [page, setPage] = useState(1); // 현재 페이지 번호

  // 🔎 검색 상태
  const [field, setField] = useState("all"); // 검색 항목 (전체/제목/작성자/내용)
  const [q, setQ] = useState(""); // 검색어 입력값
  const [debouncedQ, setDebouncedQ] = useState(""); // 디바운스 처리된 검색어, debounced:입력이 튀는 것을 막아준다.

  // 입력 후 300ms 지나면 검색어 반영 (디바운스)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t); // 컴포넌트 언마운트 시 타이머 제거
  }, [q]);

  // 검색 조건이 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, field]);

  // 최초 목록 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); // 로딩 시작
        const res = await axios.get("http://localhost:8000/board/list"); // 서버에서 데이터 가져오기
        setList(res.data || []); // 목록 저장
      } catch (e) {
        console.error(e);
        setErr("목록을 불러오는 중 오류가 발생했습니다."); // 에러 처리
      } finally {
        setLoading(false); // 로딩 종료
      }
    })();
  }, []);

  // 🔎 검색 필터링
  const filtered = useMemo(() => {
    if (!debouncedQ) return list; // 검색어 없으면 전체 반환
    const qLower = debouncedQ.toLowerCase(); // 검색어 소문자 변환
    return list.filter((b) => {
      const title = (b.boardTitle || "").toLowerCase();
      const writer = (b.boardWriter || "").toLowerCase();
      const contents = (b.boardContents || "").toLowerCase();

      // 검색 항목에 따라 필터링
      if (field === "title") return title.includes(qLower);
      if (field === "writer") return writer.includes(qLower);
      if (field === "contents") return contents.includes(qLower);

      // 전체 검색
      return (
        title.includes(qLower) ||
        writer.includes(qLower) ||
        contents.includes(qLower)
      );
    });
  }, [list, debouncedQ, field]);

  // 전체 데이터 개수와 페이지 수 계산
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 현재 페이지가 총 페이지 수를 넘으면 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // 현재 페이지 데이터만 추출
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // 페이지 이동 함수
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  // 로딩 중일 때 화면 표시
  if (loading)
    return (
      <div className="list-page">
        {/* <p>불러오는 중…</p> */}
        <img src={loadingGIF} alt="로딩 중" width="200" />
      </div>
    );

  // 에러 발생 시 화면 표시
  if (err)
    return (
      <div className="list-page">
        <p>{err}</p>
      </div>
    );

  // 현재 페이지의 시작/끝 인덱스 계산
  const startIdx = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="list-page">
      <h2>게시물 목록</h2>

      {/* 🔎 검색 바 */}
      <form
        className="search-bar"
        onSubmit={(e) => e.preventDefault()} // 엔터 눌러도 새로고침 안되게
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {/* 검색 항목 선택 */}
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          aria-label="검색 항목"
          style={{ height: 36 }}
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="writer">작성자</option>
          <option value="contents">내용</option>
        </select>

        {/* 검색어 입력창 */}
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색어를 입력하세요"
          aria-label="검색어"
          style={{ flex: "1 1 280px", height: 34, padding: "0 10px" }}
        />

        {/* 검색어 지우기 버튼 */}
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="검색어 지우기"
            style={{ height: 36 }}
          >
            지우기
          </button>
        )}
      </form>

      {/* 메타 정보 (총 개수, 범위, 검색 조건) */}
      <div className="list-meta">
        <span>총 {total}건</span>
        <span>{total > 0 && ` · ${startIdx}–${endIdx}`}</span>
        {debouncedQ && (
          <span style={{ marginLeft: 8, opacity: 0.8 }}>
            (검색어: “{debouncedQ}”, 항목: {field})
          </span>
        )}
      </div>

      {/* 게시물 테이블 */}
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((board) => (
              <tr key={board.id}>
                <td>{board.id}</td>
                <td>
                  <Link to={`/board/${board.id}`}>{board.boardTitle}</Link>
                </td>
                <td>{board.boardWriter}</td>
                <td>{board.createdAt}</td>
                <td>{board.boardHits}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="페이지네이션">
          <button onClick={goFirst} disabled={page === 1}>
            « 처음
          </button>
          <button onClick={goPrev} disabled={page === 1}>
            ‹ 이전
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // 현재 페이지 기준 5개 버튼 윈도우
            const windowSize = 5;
            const start = Math.floor((page - 1) / windowSize) * windowSize + 1;
            const n = start + i;
            if (n > totalPages) return null;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={n === page ? "active" : ""}
              >
                {n}
              </button>
            );
          })}

          <button onClick={goNext} disabled={page === totalPages}>
            다음 ›
          </button>
          <button onClick={goLast} disabled={page === totalPages}>
            마지막 »
          </button>
        </nav>
      )}
    </div>
  );
};

export default List; // 컴포넌트 export
