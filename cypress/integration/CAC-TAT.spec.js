/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(function () {
        cy.visit('./src/index.html')
    })


    it('verifica o título da aplicação', function () {

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    // Teste para validar o cadastro:

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'

        cy.clock()

        cy.get('#firstName').type('Francine')
        cy.get('#lastName').type('Akemi')
        cy.get('#email').type('francine@exemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    // Teste para validar e-mail inválido:

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#firstName').type('Francine')
        cy.get('#lastName').type('Akemi')
        cy.get('#email').type('francine@exemplo,com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', function () {
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('Francine')
        cy.get('#lastName').type('Akemi')
        cy.get('#email').type('francine@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('body')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        
        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Francine')
            .should('have.value', 'Francine')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Akemi')
            .should('have.value', 'Akemi')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('francine@exemplo.com')
            .should('have.value', 'francine@exemplo.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123')
            .should('have.value', '123')
            .clear()
            .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    /*Para selecionar uma opção do dropdown:
    1.Seleciona o elemento com o .get, 
    2.Encadeia um .select passando o texto da opção que queremos selecionar, 
    3. Depois encadeia uma verificação com .should*/

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    // Fazendo um teste agora selecionando pelo valor:

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    // Para testar elementos do tipo Radio:

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    /*Teste para ver se marca cada tipo de atendimento. No cy.get eu pego o input que abrange todos os types, no .should eu confirmo que tem 3 opções 
    e no .each eu digo que quero selecionar cada um deles. 
    O each recebe uma função de callback que recebe como argumento cada um dos elementos que foi selecionado para passar por cada um dos elementos.
    Uso o primeiro cy.wrap para empacotar cada um desses radios.
    O segundo cy.wrap uso para confirmar que eles foram checados. */

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    // O .last marca somente a última caixa. Aí posso dar o .uncheck
    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })


    // Seleciona o arquivo para upload:
    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    // Simula o arrastar do arquivo ao campo de upload:
    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
            })


    // Teste para ver se abre em outra aba. Basta certificarmos que há a propriedade _blank.
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })


    // Teste para abrir na mesma aba do cypress. Como se tivéssemos removido manualmente o target _blank.
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
    // Fazer a verificação: podemos verificar que a página que deve ser aberta contém determinado texto, por exemplo:

        cy.contains('Talking About Testing').should('be.visible')
    })
    
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      it('preenche a area de texto usando o comando invoke', function() {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
          .invoke('val', longText)
          .should('have.value', longText)
      })

      it('faz uma requisição HTTP', function() {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
          .should(function(response) {
            const { status, statusText, body } = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
          })
      })

      it('encontra o gato escondido', function() {
        cy.get('#cat')
          .invoke('show')
          .should('be.visible')
        cy.get('#title')
          .invoke('text', 'CAT TAT')
          cy.get('#subtitle')
          .invoke('text', 'Eu sou alérgico a gatos 😤')
      })
})



