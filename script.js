
//Classe de Associação de Dados recolhidos e construção do objeto literal
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {

            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }

        return true

    }
}

//Classe geração de indice dinâmico
class BD {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //Função para gerar indice dinâmico e as informações não serem sobrepostas no LocalStorage
    getnextID() {

        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1

    }

    //Função que transforma o objeto literal em JSON e guarda no Local Storage do Browser

    gravarDespesa(d) {
        let id = this.getnextID()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)

    }

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        //recuperar as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {
            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //tratamento de valores null

            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()


        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD()

//Função de Cadastro de Despesa

function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {

        bd.gravarDespesa(despesa)
        document.getElementById('modalTitulo').innerHTML = 'Registro de dados cadastrado com sucesso!'
        document.getElementById('corTitulo').className = 'text-success'
        document.getElementById('modalConteudo').innerHTML = 'Dados de despesa cdastrados com sucesso'
        document.getElementById('CTABtn').innerHTML = 'Tudo OK!'
        document.getElementById('CTABtn').className = 'btn btn-success'

        $('#registraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {

        document.getElementById('modalTitulo').innerHTML = 'Erro na Gravação dos Dados!'
        document.getElementById('corTitulo').className = 'text-danger'
        document.getElementById('modalConteudo').innerHTML = 'Erro na gravação dos dados.Verifique se todos os campos estão preenchidos!'
        document.getElementById('CTABtn').innerHTML = 'Voltar e Corrigir'
        document.getElementById('CTABtn').className = 'btn btn-danger'

        $('#registraDespesa').modal('show')
    }

}

//Listagem e carregamento de dados de despesa a partir do Local Storage

function carregarListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }


    //prenchimento do body da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o Array despeas e lista os elementos
    despesas.forEach(function (d) {


        //criando o HTML para preencher com os elementos do Array despesas
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`


        //ajustar o valor do tipo que aparece na tela
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //exclusão de despesa
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`

        btn.onclick = function () {


            let id = this.id.replace('id_despesa_', '')
            //alert(id)

            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)



    })
}

//Filtro de despesas
function pesquisarDespesa() {

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)

    this.carregarListaDespesas(despesas, true)

}

