import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "./VoteNew.scss";
import Modal2 from "../../components/Modal/Modal2";
import Modal3 from "../../components/Modal/Modal3";

import "react-datepicker/dist/react-datepicker.css";
import img from "../../img/1619702385.jpg";
import profileAdd from "../../img/profile_add.svg";

const VoteNew = ({ history }) => {
  const [electionName, setElectionName] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startTime, endTime] = dateRange;
  const [total, setTotal] = useState();
  const [quorum, setQuorum] = useState();
  const [electionInfo, setElectionInfo] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const openModal2 = () => {
    setModal2Visible(true);
  };
  const closeModal2 = () => {
    setModal2Visible(false);
  };
  const openModal3 = () => {
    setModal3Visible(true);
  };
  const closeModal3 = () => {
    setModal3Visible(false);
  };

  let candidateContent = [];
  for (let i = 0; i < candidates.length; i++) {
    candidateContent.push(
      <div key={candidates[i].number}>
        <div className="candidate-name">
          {candidates[i].number + ". " + candidates[i].candidateName}
          <button></button>
        </div>
        <img
          className="candidate-profile"
          src={candidates[i].profile}
          alt="프로필"
        ></img>
        <div>{candidates[i].candidateInfo}</div>
        <div className="space"></div>
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch("https://jggg.loca.lt/election/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYXJlNTAyQHVvcy5hYy5rciIsImlhdCI6MTY1MjY3NTA0OH0.PD4D6kzkOSNr3QErG5_T7Lui8HA0ItdToJaNdKFnToc",
      },
      body: JSON.stringify({
        createElectionDTO: {
          electionName: electionName,
          startTime: startTime,
          endTime: endTime,
          quorum: parseInt(quorum),
          total: parseInt(total),
          electionInfo: electionInfo,
        },
        candidates: candidates,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem("wtw-token", response.token);
        }
      });
    history.push("/");
  };
  const handleModal2Click = (_name, _file, _info) => {
    const newCandidate = {
      number: candidates.length + 1,
      candidateName: _name,
      profile: _file,
      candidateInfo: _info,
    };
    const newCandidates = [...candidates];
    newCandidates.push(newCandidate);
    setCandidates(newCandidates);
    setIsSubmitActive(true);
  };
  const handleModal3Click = () => {
    console.log("modal3");
    setAgree(true);
  };
  return (
    <>
      {modal2Visible && (
        <Modal2 onClose={closeModal2} onClick={handleModal2Click}></Modal2>
      )}
      {modal3Visible && (
        <Modal3 onClose={closeModal3} onClick={handleModal3Click}></Modal3>
      )}
      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="name-range">
            <div className="name">
              <p className="form-title">투표명</p>
              <div className="border"></div>
              <input
                className="input-name"
                type="text"
                placeholder="투표 명을 입력해주세요."
                value={electionName}
                required
                onChange={(event) => {
                  setElectionName(event.target.value);
                  console.log(startTime + endTime);
                }}
              ></input>
            </div>
            <div className="range">
              <p className="form-title">투표 기간</p>
              <div className="border"></div>
              <div className="right-margin">
                <DatePicker
                  required
                  className="datepicker"
                  dateFormat="yyyy/MM/d"
                  selectsRange={true}
                  startDate={startTime}
                  endDate={endTime}
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  isClearable={true}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="form-title">투표 정보</p>
            <div className="border"></div>
            <div className="content-margin">
              <textarea
                required
                className="electionInfo"
                value={electionInfo}
                onChange={(event) => {
                  setElectionInfo(event.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div>
            <p className="form-title">후보 정보</p>
            <div className="border"></div>
            <div className="content-margin">
              {candidateContent}
              <p className="candidate-name">새로운 후보 추가하기</p>
              <img
                onClick={(event) => {
                  console.log("lala");
                  event.preventDefault();
                  openModal2();
                }}
                className="candidate-profile"
                // src={profileAdd}
                src="https://uosvotepk.s3.ap-northeast-2.amazonaws.com/candidate/electionID-999/candidate0-profile"
                alt="후보 추가하기"
              ></img>
            </div>

            <div className="space"></div>
          </div>
          <div>
            <p className="form-title">유권자 수 및 정족수</p>
            <div className="border"></div>
            <div className="content-margin">
              <div>
                <p className="id-password-desc">유권자 수</p>
                <input
                  required
                  className="input-number"
                  type="number"
                  value={total}
                  spellCheck={false}
                  onChange={(event) => setTotal(event.target.value)}
                />
              </div>
              <div>
                <p className="id-password-desc">정족수</p>
                <input
                  required
                  className="input-number"
                  type="number"
                  value={quorum}
                  spellCheck={false}
                  onChange={(event) => setQuorum(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space2" />
          <div className="center">
            <div>
              <input
                type="checkbox"
                required
                checked={agree}
                onClick={(event) => {
                  setAgree(!agree);
                }}
              ></input>
              <a
                className="submit-agree"
                onClick={(event) => {
                  event.preventDefault();
                  openModal3();
                }}
              >
                관련 사항을 확인 했으며 동의 합니다.
              </a>
            </div>
            <button
              className={
                isSubmitActive ? "button-submit" : "button-submit-unactive"
              }
              type="submit"
              disabled={!isSubmitActive}
            >
              {isSubmitActive ? "투표 개설 승인 요청" : "후보자를 등록해주세요"}
            </button>
          </div>
          <div className="space" />
        </form>
      </div>
    </>
  );
};

export default VoteNew;
