

Files:
- Header.css
- Home.css
- Save.css
- Register.css
- Login.css
- List.css
- Detail.css
- Update.css

Optional wrappers:
   - Home root:    <div className="home">
   - Save root:    <div className="form-page">
   - Register root:<div className="form-page register">
   - Login root:   <div className="form-page login">
   - Update root:  <div className="update-page">


Detail.jsx
<table className="detail-table">     <---  추가하기
  <tbody>
    <tr>
      <td>id</td>
      <td>{board.id}</td>
    </tr>
    ...
  </tbody>
</table>