import React, { useEffect, useState } from "react";
import "./Thumbnail.css";
import { toPng } from "html-to-image";
import placeholder from "../../assets/placeholder_img.png";
import random from "../../assets/arrow.png";

const Thumbnail = () => {
  const [img, setImg]: any = useState(null);
  const [clickImgFlag, setClickImgFlag] = useState(false);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  const backgroundColors = [
    ["#24243e", "#2c5364"],
    ["#8360c3", "#2ebf91"],
    ["#009FFF", "#ec2F4B"],
    ["#654ea3", "#eaafc8"],
    ["#DA4453", "#89216B"],
    ["#4e54c8", "#8f94fb"],
    ["#134E5E", "#71B280"],
    ["#800080", "#ffc0cb"],
    ["#ff9966", "#ff5e62"],
    ["#000046", "#1CB5E0"],
    ["#232526", "#414345"],
  ];

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      console.log(e.keyCode);
      if (e.keyCode === 46) {
        //esc
        console.log(clickImgFlag);
        if (clickImgFlag) {
          setImg(null);
          setClickImgFlag(false);
        }
      }
    };

    const handleClick = (e: any) => {
      if (e.target.id !== "img-div") {
        const imgAreaElement: any = document.querySelector("#img-area");
        imgAreaElement.style.borderWidth = "0px";
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [clickImgFlag]);

  /** init 버튼 클릭 */
  const clickInitBtn = () => {
    setImg(null);
    setClickImgFlag(false);
    setHeading("");
    setSubheading("");
  };

  const clickBackgroundClr = () => {
    let number = Math.floor(Math.random() * backgroundColors.length);

    const thumbnailArea: any = document.querySelector("#thumbnail-area");
    thumbnailArea.style.background = `linear-gradient(${backgroundColors[number][0]}, ${backgroundColors[number][1]})`;
  };

  /** save 버튼 클릭 */
  const clickSaveBtn = () => {
    const thumbnail: any = document.querySelector("#thumbnail-area");
    console.log(thumbnail);

    // div 내부의 input, img 요소를 가져옴
    const headingElement = thumbnail.querySelector("#heading");
    const subheadingElement = thumbnail.querySelector("#subheading");
    const imgAreaElement = thumbnail.querySelector("#img-area");

    // input 요소의 값이 비어있으면 visibility:hidden
    if (heading === "") {
      headingElement.style.visibility = "hidden";
    }
    if (subheading === "") {
      subheadingElement.style.visibility = "hidden";
    }
    if (img === null) {
      imgAreaElement.style.visibility = "hidden";
    }

    toPng(thumbnail).then((image) => {
      saveImg(image);
      headingElement.style.visibility = "visible";
      subheadingElement.style.visibility = "visible";
      imgAreaElement.style.visibility = "visible";
    });
  };

  /** 이미지 file 선택 및 이미지 미리보기 */
  const changeImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader.result);
        setImg(reader.result);
      };
    }
  };

  /** a태그로 생성한 썸네일 save */
  const saveImg = (url: string) => {
    var link = document.createElement("a");
    link.href = url;
    link.download = "files";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const changeText = (e: any) => {
    if (e.target.id === "heading") {
      setHeading(e.target.value);
    } else {
      setSubheading(e.target.value);
    }
  };

  /** image 클릭했을 때 */
  const clickImgArea = () => {
    setClickImgFlag(true);
    const imgAreaElement: any = document.querySelector("#img-area");
    console.log(imgAreaElement);
    imgAreaElement.style.border = "2px";
    imgAreaElement.style.borderColor = "white";
    imgAreaElement.style.borderStyle = "dashed";
  };

  return (
    <>
      <div id="title-area">
        <p>
          Thumbnail <span style={{ color: "#8B00E5" }}>C</span>
          <span style={{ color: "rgb(180 0 124)" }}>r</span>
          <span style={{ color: "#F900AB" }}>e</span>
          <span style={{ color: "#FF0E72" }}>a</span>
          <span style={{ color: "#FF7E48" }}>t</span>
          <span style={{ color: "#FFC141" }}>o</span>
          <span style={{ color: "rgb(239 225 80)" }}>r</span>
        </p>
      </div>
      <div id="btn-area">
        <button
          type="button"
          id="btn-init"
          className="btn btn-secondary"
          style={{ marginRight: "5px" }}
          onClick={clickInitBtn}
        >
          Init
        </button>
        <button
          type="button"
          id="btn-random"
          className="btn btn-light"
          style={{ marginRight: "5px" }}
          onClick={clickBackgroundClr}
        >
          <img src={random} style={{ width: "23px" }}></img>
        </button>
        <button
          type="button"
          id="btn-save"
          className="btn btn-primary"
          onClick={clickSaveBtn}
        >
          Save
        </button>
      </div>
      <div id="thumbnail-div">
        <div id="thumbnail-area">
          {img && (
            <div id="img-area" onClick={clickImgArea}>
              <div
                id="img-div"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
              {/* <img id="image" src={img}></img> */}
            </div>
          )}
          {!img && (
            <div id="img-area">
              <label htmlFor="input-file">
                <div
                  id="img-div"
                  style={{ backgroundImage: `url(${placeholder})` }}
                >
                  {/* <img src={placeholder} id="placeholder-img" /> */}
                </div>
              </label>

              <input
                type="file"
                id="input-file"
                accept="image/*"
                onChange={(e) => changeImgFile(e)}
                style={{ display: "none" }}
              />
            </div>
          )}
          <div id="text-area">
            <input
              className="input-text"
              id="heading"
              placeholder="제목을 입력하세요"
              onChange={changeText}
              value={heading}
              maxLength={20}
            />
            <input
              type="text"
              className="input-text"
              id="subheading"
              placeholder="소제목을 입력하세요"
              onChange={changeText}
              value={subheading}
              maxLength={30}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Thumbnail;
