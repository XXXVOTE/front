import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Moment from "moment";
import { loginCheck } from "../../store/actions/userActions";
import { electioninfo } from "../../store/actions/electionActions";

import "./Voteinfo.scss";

function Voteinfo() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isLogin } = useSelector((state) => state.user);
  const { electionloading, electionlist } = useSelector(
    (state) => state.election
  );

  const now = 71;

  if (!isLogin) {
    if (localStorage.getItem("accessToken") !== null) {
      dispatch(loginCheck());
    }
  }

  useEffect(() => {
    if (!electionloading) {
      console.log("electionloading" + id);
      dispatch(electioninfo());
    }
  }, []);

  return (
    <div className="voteinfo">
      {electionlist.length == 0 && (
        <div className="election-list-none">
          <p>해당 정보를 다시 불러오고 있습니다.</p>
        </div>
      )}

      {electionlist.length > 0 &&
        electionlist.map((data) => {
          if (data.id == id) {
            let fullRange, nowRange;

            let candidateContent = [];
            for (let i = 0; i < data.candidates.length; i++) {
              candidateContent.push(
                <div key={data.candidates[i].candidateNumber}>
                  <div className="candidate-name">
                    {data.candidates[i].candidateNumber +
                      ". " +
                      data.candidates[i].candidateName}
                  </div>
                  <img
                    className="candidate-profile"
                    src={data.candidates[i].profile}
                    alt="프로필"
                  ></img>
                  <div className="candidate-promise">
                    {data.candidates[i].promise}
                  </div>
                  <div className="space"></div>
                </div>
              );
              fullRange = new Date(data.endDate) - new Date(data.startDate);
              console.log("lalala" + fullRange);
              nowRange = new Date() - new Date(data.startDate);
              console.log("hahaha" + nowRange);
              console.log("kakaak" + (nowRange / fullRange) * 100);
            }
            return (
              <>
                <div className="name-range">
                  <div className="name">
                    <div className="title">투표 명</div>
                    <div className="border"></div>
                    <div className="info"> {data.name} </div>
                  </div>
                  <div className="range">
                    <div className="title">기간 </div>
                    <div className="border"></div>
                    <div className="info">
                      {Moment(data.startDate).format("yyyy/MM/DD h:mm a")} ~
                      {Moment(data.endDate).format("yyyy/MM/DD h:mm a")}
                    </div>
                  </div>
                </div>
                <div className="title">투표 정보</div>
                <div className="border"></div>
                <div className="info">{data.info}</div>
                <div className="title">후보 정보</div>
                <div className="border"></div>
                <div className="info">{candidateContent}</div>
                <div className="title">투표 현황</div>
                <div className="border"></div>
                <div className="center">
                  <div className="center-row">
                    <div className="center-title">투표 참여율</div>
                  </div>
                  <div className="center-row-inner">
                    <div className="center-mark">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          borderRadius: "50%",
                          width: 15,
                          height: 15,
                          backgroundColor: "#067F7F",
                        }}
                      ></div>
                      정족수({data.quorum}명)
                    </div>
                    <div className="center-info">
                      {(now / data.total) * 100}%({now}명/
                      {data.total}명)
                    </div>
                  </div>
                  <ProgressBar
                    width={800}
                    percent={(now / data.total) * 100}
                    stepPositions={[(data.quorum / data.total) * 100]}
                    filledBackground="linear-gradient(to right, #06287f, #06287f)"
                    unfilledBackground="#8393bf"
                  >
                    <Step transition="scale">
                      {({ accomplished, index }) => (
                        <div
                          className={`indexedStep ${
                            accomplished ? "accomplished" : ""
                          }`}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "50%",
                            width: 15,
                            height: 15,
                            backgroundColor: "#067F7F",
                          }}
                        ></div>
                      )}
                    </Step>
                  </ProgressBar>
                  <div className="center-row">
                    <div className="center-title">남은 투표 기간</div>
                  </div>
                  <div className="center-row-inner">
                    <div className="center-mark"></div>
                    <div className="center-info">
                      {((nowRange / fullRange) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <ProgressBar
                    width={800}
                    percent={(nowRange / fullRange) * 100}
                    filledBackground="linear-gradient(to right, #06287f, #06287f)"
                    unfilledBackground="#8393bf"
                  ></ProgressBar>
                  <div className="space2"></div>
                </div>
              </>
            );
          }
        })}
    </div>
  );
}
export default Voteinfo;