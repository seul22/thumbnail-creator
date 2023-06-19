import React, { ChangeEvent, useEffect, useState } from "react";
import "./Thumbnail.css";
import { toPng } from "html-to-image";
import placeholderImg from "../../assets/placeholder_img.png";
import randomImg from "../../assets/arrow.png";
import BackgroundColors from "./type/ColorPairs";

const Thumbnail = () => {
  const [img, setImg] = useState<any>(null);
  const [clickImgFlag, setClickImgFlag] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("");
  const [subheading, setSubheading] = useState<string>("");

  /** 배경 linear-gradient 색상 list */
  const backgroundColors: BackgroundColors = [
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
    ["#ff9966", "#ff5e62"],
    ["#159957", "#155799"],
    ["#d66d75", "#e29587"],
    ["#4568dc", "#b06ab3"],
    ["#3a7bd5", "#3a6073"],
    ["#000428", "#004e92"],
  ];

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.keyCode === 46 && clickImgFlag) {
        //delete
        setImg(null);
        setClickImgFlag(false);
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
  const clickInitBtn = (): void => {
    setImg(null);
    setClickImgFlag(false);
    setHeading("");
    setSubheading("");
  };

  /** random 버튼 클릭 */
  const clickChangeBackgroundBtn = (): void => {
    let index: number = Math.floor(Math.random() * backgroundColors.length);

    const thumbnailArea: HTMLElement | null =
      document.querySelector("#thumbnail-area");
    if (thumbnailArea) {
      thumbnailArea.style.background = `linear-gradient(${backgroundColors[index][0]}, ${backgroundColors[index][1]})`;
    }
  };

  /** save 버튼 클릭 */
  const clickSaveBtn = (): void => {
    const thumbnail: HTMLElement | null =
      document.querySelector("#thumbnail-area");

    if (thumbnail) {
      // div 내부의 input, img 요소를 가져옴
      const headingElement: HTMLElement | null =
        thumbnail.querySelector("#heading");
      const subheadingElement: HTMLElement | null =
        thumbnail.querySelector("#subheading");
      const imgAreaElement: HTMLElement | null =
        thumbnail.querySelector("#img-area");

      if (headingElement && subheadingElement && imgAreaElement) {
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
          // 저장 후 input 요소들의 visibility를 다시 visible로 바꿈
          headingElement.style.visibility = "visible";
          subheadingElement.style.visibility = "visible";
          imgAreaElement.style.visibility = "visible";
        });
      }
    }
  };

  /** 이미지 file 선택 및 이미지 미리보기 */
  const changeImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImg(reader.result);
      };
    }
  };

  /** 생성한 썸네일이미지 a태그로 save */
  const saveImg = (url: string) => {
    let link: HTMLAnchorElement = document.createElement("a");
    link.href = url;
    link.download = "files";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** input text change */
  const changeText = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "heading") {
      setHeading(e.target.value);
    } else {
      setSubheading(e.target.value);
    }
  };

  /** image가 있을 때 image 클릭 */
  const clickImgArea = () => {
    setClickImgFlag(true);
    const imgAreaElement: HTMLElement | null =
      document.querySelector("#img-area");
    if (imgAreaElement) {
      imgAreaElement.style.border = "2px";
      imgAreaElement.style.borderColor = "white";
      imgAreaElement.style.borderStyle = "dashed";
    }
  };

  return (
    <div className="container-sm">
      <div id="title-area">
        <p>
          Thumbnail <span style={{ color: "#8B00E5" }}>C</span>
          <span style={{ color: "#B4007C" }}>r</span>
          <span style={{ color: "#F900AB" }}>e</span>
          <span style={{ color: "#FF0E72" }}>a</span>
          <span style={{ color: "#FF7E48" }}>t</span>
          <span style={{ color: "#FFC141" }}>o</span>
          <span style={{ color: "#EFE150" }}>r</span>
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
          onClick={clickChangeBackgroundBtn}
        >
          <img src={randomImg} style={{ width: "23px" }}></img>
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
            </div>
          )}
          {!img && (
            <div id="img-area">
              <label htmlFor="input-file">
                <div
                  id="img-div"
                  style={{ backgroundImage: `url(${placeholderImg})` }}
                ></div>
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
    </div>
  );
};

export default Thumbnail;
