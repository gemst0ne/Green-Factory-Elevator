describe('The Home Page', () => {

  before(() => {
    cy.viewport('macbook-13')
    cy.visit('/')
  })

  it('세팅 정상 표시', () => {
    cy.get('.setting')
    .should('be.visible')
  })

  it('elevator 정상 render', () => {
    let elevatorNum = 2;
    let floorNum = 5;
    cy.get('#_elevator').select(elevatorNum.toString())
    cy.get('#_floor').select(floorNum.toString())
    cy.get('#render').click();
    cy.get('[data-elevator-wrapper] > .column').should('have.length', elevatorNum)
    for(let i =1; i<=elevatorNum;i++){
      cy.get('#elevator'+i+'> .floor').should('have.length', floorNum)
    }
    cy.get("[data-btn]").should('have.length', floorNum)
  })

  it('elevator 버튼 정상 작동', () => {
    cy.get("[data-btn='3']").as("button").click()
    cy.get("[data-btn='5']").click()
    cy.wait(2000)
    cy.get(".elevator[data-floor='3']").should('exist')
    cy.wait(2000)
    cy.get(".elevator[data-floor='5']").should('exist')
  })

  it('activateButton API 정상작동', () => {
    cy.window().then((win) => {
      win.window.activateButton(1)
    })
    cy.wait(2000)
    cy.get(".elevator[data-floor='1']").should('exist')
  })

  it('isButtonActivated API 정상작동', () => {
    cy.window().then((win) => {
      win.window.activateButton(3)
    })
    cy.get("[data-btn='3']").should('have.class','active')
  })
})
