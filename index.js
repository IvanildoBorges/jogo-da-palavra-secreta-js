// Seletores principais
const main = document.getElementById('inicio');
const secaoPalavraJogador1 = document.getElementById('setup-j1');
const botaoVamosLa = document.querySelector('#inicio button');
const avatar = document.querySelector('#avatar .imagem-player');
const avatarVencedor = document.querySelector('#avatar .vencedor');
const campoPalavraJ1 = document.getElementById('palavraJ1');
const dicaJ1 = document.getElementById('dicaJ1');
const botaoProximoJogador = document.querySelector('#setup-j1 button');
const secaoPalavraJogador2 = document.getElementById("setup-j2");
const botaoComecar = document.querySelector('#setup-j2 button');
const campoPalavraJ2 = document.getElementById('palavraJ2');
const dicaJ2 = document.getElementById('dicaJ2');
const secaoJogo = document.getElementById('jogo');
const tituloTurno = document.getElementById("turno");
const palavraExibida = document.getElementById("palavraExibida");
const dicaAtual = document.getElementById("dicaAtual");
const letrasTentadas = document.getElementById("letrasTentadas");
const mensagem = document.getElementById("mensagem");
const letra = document.getElementById("letra");
const botaoAdivinhar = document.querySelector("#jogo > button:nth-of-type(1)");
const botaoVezDoOutroJogador = document.getElementById("btnProximo");
const modalDeFim = document.getElementById("modal-fim");
const tituloVencedor = document.getElementById("vencedor");
const palavraAcertadaVencedor = document.querySelector("#modal-fim .modal-conteudo .palavra-acertada");
const botaoRecomecar = document.getElementById("reiniciar");
const botaoNovoJogo = document.getElementById("novo-jogo");

let palavraJ1 = '', palavraJ2 = '';
let dicaJ1Texto = '', dicaJ2Texto = '';
let exibicaoJ1 = [], exibicaoJ2 = [];
let letrasTentadasJ1 = [], letrasTentadasJ2 = [];
let jogadorAtual = 2; // Jogador 2 começa adivinhando
let proximoTimeout = null;

/* Eventos */
botaoVamosLa.addEventListener("click", () => {
  main.style.display = 'none';
  secaoPalavraJogador1.style.display = 'flex';
  avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/35/woman-7646415_1280.png");
});

botaoProximoJogador.addEventListener("click", () => {
  const palavra = campoPalavraJ1.value.trim().toUpperCase();
  if (!palavra) return alert("Jogador 1 precisa digitar a palavra!");
  palavraJ1 = palavra;
  dicaJ1Texto = dicaJ1.value.trim();
  secaoPalavraJogador1.style.display = 'none';
  secaoPalavraJogador2.style.display = 'flex';
  avatar.classList.toggle("inverte-posicao");
  avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2013/07/13/13/24/snow-160956_1280.png");
});

botaoComecar.addEventListener("click", () => {
  const palavra = campoPalavraJ2.value.trim().toUpperCase();
  if (!palavra) return alert("Jogador 2 precisa digitar a palavra!");
  palavraJ2 = palavra;
  dicaJ2Texto = dicaJ2.value.trim();
  exibicaoJ1 = Array(palavraJ1.length).fill("_");
  exibicaoJ2 = Array(palavraJ2.length).fill("_");
  letrasTentadasJ1 = [];
  letrasTentadasJ2 = [];
  secaoPalavraJogador2.style.display = 'none';
  secaoJogo.style.display = 'flex';
  atualizarTela();
});

botaoAdivinhar.addEventListener("click", () => tentarLetra());
botaoVezDoOutroJogador.addEventListener("click", () => {
  clearInterval(proximoTimeout);
  trocarJogador();
});
botaoRecomecar.addEventListener("click", () => {
  resetarJogo(false); // reinicia o jogo diretamente
});

botaoNovoJogo.addEventListener("click", () => {
  resetarJogo(true); // volta para o início, usuário clica "Vamos lá" 
});

// Função auxiliar para atualizar a lista de letras tentadas com cores
function atualizarLetrasTentadas(tentadas, palavraAlvo) {
  letrasTentadas.innerHTML = ""; // limpa a UL
  tentadas.forEach(letra => {
    const li = document.createElement("li");
    li.textContent = letra;
    li.classList.add(palavraAlvo.includes(letra) ? "letra-acertada" : "letra-errada");
    letrasTentadas.appendChild(li);
  });
}

/* Funções */
function atualizarTela() {
  const ehJogador1 = jogadorAtual === 1;
  const exibicao = ehJogador1 ? exibicaoJ2 : exibicaoJ1;
  const dica = ehJogador1 ? dicaJ2Texto : dicaJ1Texto;
  const tentadas = ehJogador1 ? letrasTentadasJ1 : letrasTentadasJ2;
  const palavra = ehJogador1 ? palavraJ2 : palavraJ1;

  tituloTurno.textContent = `Jogador ${jogadorAtual} adivinhe a palavra`;
  palavraExibida.textContent = exibicao.join(" ");
  dicaAtual.textContent = dica ? `Dica: ${dica}` : "";
  atualizarLetrasTentadas(tentadas, palavra); // <-- Aqui atualiza com cor
  mensagem.textContent = "";
  letra.value = "";
  letra.focus();
  botaoAdivinhar.style.display = 'inline-block';
  botaoVezDoOutroJogador.style.display = 'none';

  if (ehJogador1) {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/35/woman-7646415_1280.png");
    } else {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2013/07/13/13/24/snow-160956_1280.png");
    }
}

function tentarLetra() {
  const letraDigitada = letra.value.trim().toUpperCase();
  if (!letraDigitada.match(/^[A-Z]$/)) return;

  const ehJogador1 = jogadorAtual === 1;
  const palavra = ehJogador1 ? palavraJ2 : palavraJ1;
  const exibicao = ehJogador1 ? exibicaoJ2 : exibicaoJ1;
  const tentadas = ehJogador1 ? letrasTentadasJ1 : letrasTentadasJ2;

  if (tentadas.includes(letraDigitada)) {
    mensagem.textContent = "⚠️ Você já tentou essa letra.";
    return;
  }

  tentadas.push(letraDigitada);
  let acertou = false;
  for (let i = 0; i < palavra.length; i++) {
    if (palavra[i] === letraDigitada) {
      exibicao[i] = letraDigitada;
      acertou = true;
    }
  }

  palavraExibida.textContent = exibicao.join(" ");

  if (acertou) {
    mensagem.textContent = "✅ Letra correta!";

    if (ehJogador1) {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/47/woman-7646432_1280.png");
    } else {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/01/16/18/28/snowman-6942897_1280.png");
    }
  } else {
    mensagem.textContent = "❌ Letra incorreta.";
    
    if (ehJogador1) {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/16/03/crying-7647358_1280.png");
    } else {
      avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2018/03/26/14/19/snow-3262840_1280.png");
    }
  }

  atualizarLetrasTentadas(tentadas, palavra); // <-- Aqui também

  botaoAdivinhar.style.display = "none";
  iniciarContagemTroca();

  if (!exibicao.includes("_")) {
    secaoJogo.style.display = "none";
    modalDeFim.style.display = "flex";
    tituloVencedor.textContent = `🎉 Jogador ${jogadorAtual} venceu!`;
    palavraAcertadaVencedor.innerHTML = `Palavra: <span class="letra-acertada">${exibicao.join("")}</span>`;

    avatar.style.display = "none";
    avatarVencedor.style.display = "block";

    if (ehJogador1) {
      avatarVencedor.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/47/woman-7646432_1280.png");
    } else {
      avatarVencedor.setAttribute("src", "https://cdn.pixabay.com/photo/2022/01/16/18/28/snowman-6942897_1280.png");
    }
  }
}

function iniciarContagemTroca() {
  let tempo = 5;
  botaoVezDoOutroJogador.textContent = `Próximo jogador (${tempo})`;
  botaoVezDoOutroJogador.style.display = "inline-block";

  proximoTimeout = setInterval(() => {
    tempo--;
    botaoVezDoOutroJogador.textContent = `Próximo jogador (${tempo})`;
    if (tempo === 0) {
      clearInterval(proximoTimeout);
      trocarJogador();
    }
  }, 1000);
}

function trocarJogador() {
  jogadorAtual = jogadorAtual === 1 ? 2 : 1;
  avatar.classList.toggle("inverte-posicao") 
  atualizarTela();
}

function resetarJogo(paraTelaInicial = false) {
  // Limpar variáveis
  palavraJ1 = '';
  palavraJ2 = '';
  dicaJ1Texto = '';
  dicaJ2Texto = '';
  exibicaoJ1 = [];
  exibicaoJ2 = [];
  letrasTentadasJ1 = [];
  letrasTentadasJ2 = [];
  jogadorAtual = 2;
  clearInterval(proximoTimeout);

  // Limpar campos
  campoPalavraJ1.value = '';
  campoPalavraJ2.value = '';
  dicaJ1.value = '';
  dicaJ2.value = '';
  letra.value = '';
  mensagem.textContent = '';
  letrasTentadas.innerHTML = '';

  // Resetar telas
  secaoJogo.style.display = 'none';
  secaoPalavraJogador1.style.display = 'none';
  secaoPalavraJogador2.style.display = 'none';
  modalDeFim.style.display = 'none';
  avatar.style.display = "block";
  avatarVencedor.style.display = "none";
  avatar.classList.remove("inverte-posicao"); // remove qualquer inversão anterior

  if (paraTelaInicial) {
    main.style.display = 'flex'; // volta pro início
    avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/40/woman-7646421_1280.png");  // imagem inicial
  } else {
    avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2022/12/10/01/35/woman-7646415_1280.png");  // imagem da tela do jogador 1
    secaoPalavraJogador1.style.display = 'flex'; // inicia nova partida
  }
}
