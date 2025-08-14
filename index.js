const btSearch = document.getElementById("search");
const inpMatricula = document.getElementById("matricula");
const linhaDados = document.getElementById("dados");
const linhaComponentes = document.getElementById("componentes");
const tblRelatorio = document.getElementById("relatorio");
const rowNome = document.getElementById("nome");

btSearch.onclick = () => {
    let matricula = inpMatricula.value;

    fetch('./dados.json')
    .then(resp => resp.json())
    .then(dados => {
        const linha = document.createElement("tr");
        dados.forEach((aluno) => {
            if(aluno.matricula == matricula) {
                //console.log(aluno);
                rowNome.innerHTML = aluno.nome;
                aluno.componentes.forEach((componente) => {
                    const colMedia = document.createElement("td");
                    const colPresenca = document.createElement("td");

                    const colComponente = document.createElement("th");
                    colComponente.innerHTML = componente.nome;
                    colComponente.colSpan = 2;

                    linhaComponentes.appendChild(colComponente);

                    colMedia.innerHTML = componente.media;
                    colPresenca.innerHTML = componente.presenca;
                    
                    linha.appendChild(colMedia);
                    linha.appendChild(colPresenca);
                });
            }
        });
        tblRelatorio.appendChild(linha);
    });
}