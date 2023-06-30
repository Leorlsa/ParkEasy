const vagasContainer = document.getElementById('status');
const vagas = [];

const TARIFA_CARRO = 5.00;    // Tarifa para carros médios por minuto
const TARIFA_MOTO = 2.00;           // Tarifa para motos por minuto
const CARENCIA_TEMPO = 15;          // Carência de 15 segundos em minutos

// Função auxiliar para formatar o tempo em HH:MM:SS
function formatarTempo(tempo, vaga) {
  const horas = Math.floor(tempo / 3600);
  const minutos = Math.floor((tempo % 3600) / 60);
  const segundos = tempo % 60;

  const tempoFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  if (vaga.tamanho === 'moto') {
    if (segundos > 15 && segundos <= 59 && minutos === 0) {
      cobranca = TARIFA_MOTO;
      vaga.valor = cobranca;
      atualizarValor(vaga);
    }
  }
  
  if (vaga.tamanho === 'carro') {
    if (segundos > 15 && segundos <= 59 && minutos === 0) {
      cobranca = TARIFA_CARRO;
      vaga.valor = cobranca;
      atualizarValor(vaga);
    }
  }
  if (minutos >= 1 && segundos <= 15 && vaga && vaga.valor !== undefined) {
    let cobranca = 0;
    if (vaga.tamanho === 'moto') {
      cobranca = minutos * TARIFA_MOTO; // Tarifa de R$ 2 por minuto para motos
    } else if (vaga.tamanho === 'carro') {
      cobranca = minutos * TARIFA_CARRO; // Tarifa de R$ 5 por minuto para carros
    }

    if (cobranca > vaga.valor) {
      vaga.valor = cobranca;
      console.log(`Cobrança: R$ ${cobranca.toFixed(2)}`);
      atualizarValor(vaga); // Atualiza o valor da vaga
    }
  } else {
    atualizarValor(vaga); // Atualiza o valor da vaga mesmo que não seja um minuto completo
  }
  return tempoFormatado;
}



// Função para criar uma vaga
function criarVaga(id) {
  const vaga = {
    id: id,
    cliente: '',
    carro: '',
    placa: '',
    valor: '',
    tempo: 0,
    intervalId: null,
    section: null,
    vagaDiv: null,
    tempoParagraph: null,
    cancelarButton: null,
    pagarButton: null
  };

  vaga.section = document.createElement('section');
  vaga.section.id = `vaga${id}`;

  vaga.vagaDiv = document.createElement('div');
  vaga.vagaDiv.classList.add('vaga', 'empty-bg');
  vaga.vagaDiv.id = `vaga${id}`;

  const vagaTitle = document.createElement('h3');
  vagaTitle.textContent = `Vaga ${id}`;

  const clienteParagraph = document.createElement('p');
  clienteParagraph.textContent = 'Nome do cliente:';

  const carroParagraph = document.createElement('p');
  carroParagraph.textContent = 'Carro:';

  const placaParagraph = document.createElement('p');
  placaParagraph.textContent = 'Placa:';

  const valorParagraph = document.createElement('p');
  valorParagraph.textContent = 'Valor:';

  vaga.tempoParagraph = document.createElement('p');
  vaga.tempoParagraph.textContent = 'Tempo: 00:00:00';
  vaga.tempoParagraph.style.fontWeight = 'bold';
  vaga.tempoParagraph.style.fontSize = '16px';

  vaga.cancelarButton = document.createElement('button');
  vaga.cancelarButton.textContent = 'Cancelar Reserva';
  vaga.cancelarButton.classList.add('cancel-button');
  vaga.cancelarButton.addEventListener('click', function() {
    cancelarReserva(vaga);
  });

  vaga.pagarButton = document.createElement('button');
  vaga.pagarButton.textContent = 'Pago';
  vaga.pagarButton.classList.add('pay-button');
  vaga.pagarButton.addEventListener('click', function() {
    efetuarPagamento(vaga);
  });

  // Aplica estilos para separar horizontalmente os botões
  vaga.cancelarButton.style.display = 'inline-block';
  vaga.pagarButton.style.display = 'inline-block';
  vaga.cancelarButton.style.marginRight = '10px';

  vaga.vagaDiv.appendChild(vagaTitle);
  vaga.vagaDiv.appendChild(clienteParagraph);
  vaga.vagaDiv.appendChild(carroParagraph);
  vaga.vagaDiv.appendChild(placaParagraph);
  vaga.vagaDiv.appendChild(valorParagraph);
  vaga.vagaDiv.appendChild(vaga.tempoParagraph);
  vaga.vagaDiv.appendChild(vaga.cancelarButton);
  vaga.vagaDiv.appendChild(vaga.pagarButton);

  vaga.section.appendChild(vaga.vagaDiv);

  vagasContainer.appendChild(vaga.section);

  vagas.push(vaga);
}

function cancelarReserva(vaga) {
  vaga.cliente = '';
  vaga.carro = '';
  vaga.placa = '';
  vaga.valor = '';
  vaga.tempo = 0;
  vaga.tempoParagraph.textContent = 'Tempo: 00:00:00';
  vaga.tempoParagraph.style.fontWeight = 'bold';
  vaga.tempoParagraph.style.fontSize = '16px';
  vaga.tempoParagraph.style.visibility = 'visible';
  vaga.vagaDiv.classList.add('empty-bg');
  vaga.vagaDiv.classList.remove('red-bg');

  atualizarValor(vaga);

  if (vaga.intervalId) {
    clearInterval(vaga.intervalId);
    vaga.intervalId = null;
  }

  vaga.vagaDiv.querySelector('p:nth-of-type(1)').textContent = 'Nome do cliente:';
  vaga.vagaDiv.querySelector('p:nth-of-type(2)').textContent = 'Carro:';
  vaga.vagaDiv.querySelector('p:nth-of-type(3)').textContent = 'Placa:';
  vaga.vagaDiv.querySelector('p:nth-of-type(4)').textContent = 'Valor:';
}
// Array para armazenar os valores pagos


// Função para atualizar o estado visual da vaga
function atualizarEstadoVisualVaga(vaga) {
  if (vaga.cliente !== '' || vaga.carro !== '' || vaga.placa !== '') {
    vaga.vagaDiv.classList.add('red-bg');
    vaga.vagaDiv.classList.remove('empty-bg');
  } else {
    vaga.vagaDiv.classList.add('empty-bg');
    vaga.vagaDiv.classList.remove('red-bg');
  }

  atualizarValor(vaga); // Chamada para atualizar o valor
}


// Função para obter os valores pagos armazenados no Local Storage
function getValoresPagosArmazenados() {
  const valoresPagosArmazenados = localStorage.getItem('valoresPagos');
  return valoresPagosArmazenados ? JSON.parse(valoresPagosArmazenados) : [];
}

// Função para atualizar os valores pagos armazenados no Local Storage
function atualizarValoresPagosArmazenados() {
  localStorage.setItem('valoresPagos', JSON.stringify(valoresPagos));
}

// Inicializar a lista de valores pagos com os dados armazenados no Local Storage
valoresPagos = getValoresPagosArmazenados();

function efetuarPagamento(vaga) {
  if (vaga && vaga.valor !== undefined) {
    const valorPago = parseFloat(vaga.valor);
    if (!isNaN(valorPago)) {
      // Adicionar o valor pago ao array
      valoresPagos.push(valorPago);
      console.log(`Pagamento efetuado: R$ ${valorPago.toFixed(2)}`);
      // Atualizar o valor da vaga para vazio
      vaga.valor = '';
      cancelarReserva(vaga); // Atualizar o valor da vaga
      exibirValoresPagos(); // Atualizar a exibição dos valores pagos
      atualizarValoresPagosArmazenados(); // Atualizar os valores pagos armazenados
    } else {
      console.log('Valor inválido. Pagamento não efetuado.');
      cancelarReserva(vaga);
      alert("Essa vaga ainda está em carência")
    }
  }
}
// Seletor do botão
const btnExcluirValor = document.getElementById('excluirValor');

// Adicionar o event listener ao botão
btnExcluirValor.addEventListener('click', limparLocalStorage);

// Função para limpar o Local Storage
function limparLocalStorage() {
  localStorage.removeItem('valoresPagos');
  valoresPagos = []; // Limpar a variável de valores pagos
  exibirValoresPagos(); // Atualizar a exibição dos valores pagos
}

// Função para carregar os valores pagos ao carregar a página
window.addEventListener('load', function() {
  valoresPagos = getValoresPagosArmazenados();
  exibirValoresPagos();
});
function exibirValoresPagos() {
  const cardValoresPagos = document.getElementById('valoresPagosCard');
  const listaValoresPagos = document.getElementById('listaValoresPagos');
  const totalValoresPagos = document.getElementById('totalValoresPagos');

  // Limpar lista
  listaValoresPagos.innerHTML = '';
  
  let total = 0;

  for (let i = 0; i < valoresPagos.length; i++) {
    const valor = valoresPagos[i];

    // Criar elemento <li> para cada valor pago
    const itemLista = document.createElement('li');
    itemLista.textContent = `R$ ${valor.toFixed(2)}`;
    listaValoresPagos.appendChild(itemLista);

    total += valor;
  }

  // Atualizar total
  totalValoresPagos.textContent = `Total: R$ ${total.toFixed(2)}`;

  // Exibir o card de valores pagos
  cardValoresPagos.style.display = 'block';
}

// Função para iniciar a contagem de tempo para uma vaga
function iniciarContagemTempo(vaga) {
  vaga.intervalId = setInterval(() => {
    vaga.tempo++;
    vaga.tempoParagraph.textContent = `Tempo: ${formatarTempo(vaga.tempo, vaga)}`;
    atualizarValor(vaga); // Chamada para atualizar o valor
  }, 1000);
}

// Função para parar a contagem de tempo para uma vaga
function pararContagemTempo(vaga) {
  clearInterval(vaga.intervalId);
  vaga.intervalId = null;
  atualizarValor(vaga); // Chamada para atualizar o valor
}



// Função para atualizar o valor no parágrafo correspondente

function atualizarValor(vaga) {
  const valor = parseFloat(vaga.valor);
  const valorParagraph = vaga.vagaDiv.querySelector('p:nth-of-type(4)');
  if (!isNaN(valor) && valor !== 0) {
    valorParagraph.textContent = `Valor: R$ ${valor.toFixed(2)}`;
  } else {
    valorParagraph.textContent = 'Valor: R$ 00.00';
  }
}


// Função para reservar uma vaga
function reservarVaga(nome, carro, placa, vagaNum) {
  const vaga = vagas.find(v => v.id === vagaNum);

  if (vaga && nome && carro && placa) { // Verificar se vaga, nome, carro e placa estão preenchidos
    vaga.cliente = nome;
    vaga.carro = carro;
    vaga.placa = placa;
    vaga.valor = '';
    vaga.tamanho = document.getElementById('tamanho').value;

    atualizarEstadoVisualVaga(vaga);

    if (!vaga.intervalId) {
      iniciarContagemTempo(vaga);
      document.getElementById('msg').textContent = 'Reserva efetuada com sucesso!'; // Mensagem de texto
      setTimeout(() => {
        document.getElementById('msg').textContent = ''; // Limpar a mensagem após 5 segundos
      }, 5000); // Atraso de 5 segundos (5000 milissegundos)
    }

    vaga.tempo = 0;
    vaga.tempoParagraph.textContent = `Tempo: ${formatarTempo(vaga.tempo, vaga)}`;
    vaga.tempoParagraph.style.fontWeight = 'bold';
    vaga.tempoParagraph.style.fontSize = '16px';
    vaga.tempoParagraph.style.visibility = 'visible';

    vaga.vagaDiv.querySelector('p:nth-of-type(1)').textContent = `Nome do cliente: ${nome}`;
    vaga.vagaDiv.querySelector('p:nth-of-type(2)').textContent = `Carro: ${carro}`;
    vaga.vagaDiv.querySelector('p:nth-of-type(3)').textContent = `Placa: ${placa}`;

    atualizarValor(vaga);

    // Resetar os valores dos campos de entrada
    document.getElementById('nome').value = '';
    document.getElementById('carro').value = '';
    document.getElementById('placa').value = '';
    document.getElementById('tamanho').value = '';
  } else {
    document.getElementById('msg').textContent = 'Algo deu errado!'; // Mensagem de texto
    setTimeout(() => {
      document.getElementById('msg').textContent = ''; // Limpar a mensagem após 5 segundos
    }, 5000); // Atraso de 5 segundos (5000 milissegundos)
  }
}



// Função para lidar com o evento de reserva
function handleReserva(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const carro = document.getElementById('carro').value;
  const placa = document.getElementById('placa').value;
  const vagaNum = parseInt(document.getElementById('vaga').value);

  reservarVaga(nome, carro, placa, vagaNum);
}

// Função de inicialização
function init() {
  for (let i = 1; i <= 10; i++) {
    criarVaga(i);
  }

  const reservarBtn = document.getElementById('reservarBtn');
  reservarBtn.addEventListener('click', handleReserva);
}

// Inicializa o programa
init();
