// - it("최초에 페이지에 접속하면 빈 화면이 표시된다")
// - it("제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다")
// - it("제목 영역을 클릭하고 텍스트를 입력했을 때 2줄 이상의 텍스트는 입력되지 않고 텍스트가 잘린다")
// - it("소제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다")
// - it("소제목 영역을 클릭하고 텍스트를 입력했을 때 2줄 이상의 텍스트는 입력되지 않고 텍스트가 잘린다")
// - it("이미지 영역이 비어있는 경우, 영역을 클릭하고 이미지를 선택했을 때 선택한 이미지가 화면에 나타난다")
// - it("이미지 영역에 이미지가 있는 경우, 키보드 delete키를 눌렀을 때 이미지가 삭제된다")
// - it("save 버튼을 클릭했을 때 이미지 포맷 형식으로 썸네일이 저장된다")
// - it("init 버튼을 클릭했을 때 화면 내에 입력된 문자나 이미지 모두 초기화된다")

describe("Thumbnail Creator 앱 테스트", () => {
  beforeEach("페이지 방문", () => {
    cy.visit("/");
  });

  it("제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다", () => {
    cy.get("#heading")
      .click()
      .type("제목입니다.")
      .should("have.value", "제목입니다.");
  });

  xit("제목 영역을 클릭하고 텍스트를 입력했을 때 화면 이상으로 텍스트가 넘어가면 텍스트가 잘린다", () => {});

  it("소제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다", () => {
    cy.get("#subheading")
      .click()
      .type("소제목입니다.")
      .should("have.value", "소제목입니다.");
  });

  xit("소제목 영역을 클릭하고 텍스트를 입력했을 때 화면 이상으로 텍스트가 넘어가면 텍스트가 잘린다", () => {});

  it("이미지를 선택했을 때 선택한 이미지가 화면에 나타난다", () => {
    const fileName = "logo192.png"; // 테스트할 이미지 파일 이름

    cy.fixture(fileName).then((fileContent) => {
      console.log(fileContent);
      cy.get('input[type="file"]').attachFile(
        {
          fileContent: fileContent,
          fileName: fileName,
          mimeType: "image/png",
        },
        { subjectType: "input" }
      );
      cy.wait(2000); // 이미지 로딩을 기다릴 시간 (2초)
      cy.get("#img-div").then(($div) => {
        const backgroundImage = $div.css("background-image");
        expect(backgroundImage).to.match(/^url\("data:image\/png;base64/);
      });
    });
  });

  it("이미지 영역에 이미지가 있는 경우, 키보드 delete키를 눌렀을 때 이미지가 삭제된다", () => {
    const fileName = "logo192.png"; // 테스트할 이미지 파일 이름

    cy.fixture(fileName).then((fileContent) => {
      console.log(fileContent);
      cy.get('input[type="file"]').attachFile(
        {
          fileContent: fileContent,
          fileName: fileName,
          mimeType: "image/png",
        },
        { subjectType: "input" }
      );
    });

    cy.get("#img-area").click();
    cy.get("body").trigger("keydown", { keyCode: 46 }); // delete 키 누르기
    cy.get("input[type='file']").should("exist");
  });
});
