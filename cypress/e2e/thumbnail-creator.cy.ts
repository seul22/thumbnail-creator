// - it("최초에 페이지에 접속하면 빈 화면이 표시된다")
// - it("제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다")
// - it("제목 영역을 클릭하고 텍스트를 입력했을 때 20글자까지만 화면에 입력된다")
// - it("소제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다")
// - it("소제목 영역을 클릭하고 텍스트를 입력했을 때 30글자까지만 화면에 입력된다")
// - it("이미지 영역이 비어있는 경우, 영역을 클릭하고 이미지를 선택했을 때 선택한 이미지가 화면에 나타난다")
// - it("이미지 영역에 이미지가 있는 경우, 이미지를 선택하면 이미지에 border가 생긴다")
// - it("이미지 영역이 선택되어 있을 때, 다른 영역을 클릭하면 이미지에 border가 사라진다")
// - it("이미지 영역에 이미지가 있는 경우, 이미지 선택 후 키보드 delete키를 눌렀을 때 이미지가 삭제된다")
// - it("save 버튼을 클릭했을 때 이미지 포맷 형식으로 썸네일이 저장된다")
// - it("랜덤 버튼 클릭 시 썸네일 배경색이 변경된다")
// - it("init 버튼을 클릭했을 때 화면 내에 입력된 문자나 이미지 모두 초기화된다")

const fileUpload = () => {
  const fileName = "logo192.png"; // 테스트할 이미지 파일 이름

  cy.fixture(fileName).then(($fileContent) => {
    console.log($fileContent);
    cy.get('input[type="file"]').attachFile(
      {
        fileContent: $fileContent,
        fileName: fileName,
        mimeType: "image/png",
      },
      { subjectType: "input" }
    );
  });
};

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

  it("제목 영역을 클릭하고 텍스트를 입력했을 때 20글자까지만 화면에 입력된다", () => {
    cy.get("#heading")
      .click()
      .type("123456789012345678901")
      .should("have.value", "12345678901234567890");
  });

  it("소제목 영역을 클릭하고 텍스트를 입력했을 때 입력한 텍스트가 화면에 나타난다", () => {
    cy.get("#subheading")
      .click()
      .type("소제목입니다.")
      .should("have.value", "소제목입니다.");
  });

  it("소제목 영역을 클릭하고 텍스트를 입력했을 때 30글자까지만 화면에 입력된다", () => {
    cy.get("#subheading")
      .click()
      .type("1234567890123456789012345678901")
      .should("have.value", "123456789012345678901234567890");
  });

  it("이미지를 선택했을 때 선택한 이미지가 화면에 나타난다", () => {
    fileUpload();

    cy.wait(1000); // 이미지 로딩을 기다릴 시간 (1초)
    cy.get("#img-div").then(($div) => {
      const backgroundImage = $div.css("background-image");
      expect(backgroundImage).to.match(/^url\("data:image\/png;base64/);
    });
  });

  it("이미지 영역에 이미지가 있는 경우, 이미지를 선택하면 이미지에 border가 생긴다", () => {
    fileUpload();

    cy.get("#img-area").click();
    cy.get("#img-area").should(
      "have.css",
      "border",
      "2px dashed rgb(255, 255, 255)"
    );
  });

  it("이미지 영역이 선택되어 있을 때, 다른 영역을 클릭하면 이미지에 border가 사라진다", () => {
    fileUpload();

    cy.get("#img-area").click();
    cy.get("#heading").click();
    cy.get("#img-area").should("have.css", "borderWidth", "0px");
  });

  it("이미지 영역에 이미지가 있는 경우, 이미지 선택 후 키보드 delete키를 눌렀을 때 이미지가 삭제된다", () => {
    fileUpload();

    cy.get("#img-area").click();
    cy.get("body").trigger("keydown", { keyCode: 46 }); // delete 키 누르기
    cy.get("input[type='file']").should("exist");
  });

  it("랜덤 버튼 클릭 시 썸네일 배경색이 변경된다", () => {
    let prevBackgroundColor = "";
    cy.get("#thumbnail-area").then(($div) => {
      prevBackgroundColor = $div.css("background");
    });

    cy.get("#btn-random").click();

    // 변경된 배경색 확인
    cy.get("#thumbnail-area").then(($div) => {
      const updatedBackgroundColor = $div.css("background");
      expect(prevBackgroundColor).not.to.eq(updatedBackgroundColor);
    });
  });

  it("init 버튼을 클릭했을 때 화면 내에 입력된 문자나 이미지 모두 초기화된다", () => {
    cy.get("#btn-init").click();
    cy.get("input[type='file']").should("exist");
    cy.get("#heading").should("have.value", "");
    cy.get("#subheading").should("have.value", "");
  });
});
