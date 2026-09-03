const medicamentos = [

  {
    nome: "Dipirona 500 mg",
    descricao: "20 comprimidos",
    tipo: "Genérico",
    farmacia: "Farmácia Vida",
    preco: 8.99,
    imagem:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Paracetamol 750 mg",
    descricao: "20 comprimidos",
    tipo: "Genérico",
    farmacia: "Saúde Popular",
    preco: 7.99,
    imagem:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Ibuprofeno 400 mg",
    descricao: "10 cápsulas",
    tipo: "Genérico",
    farmacia: "Bem Estar",
    preco: 10.99,
    imagem:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Loratadina 10 mg",
    descricao: "12 comprimidos",
    tipo: "Genérico",
    farmacia: "Farmácia Vida",
    preco: 11.99,
    imagem:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Omeprazol 20 mg",
    descricao: "28 cápsulas",
    tipo: "Genérico",
    farmacia: "Saúde Popular",
    preco: 14.99,
    imagem:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Simeticona 40 mg",
    descricao: "20 comprimidos",
    tipo: "Similar",
    farmacia: "Bem Estar",
    preco: 12.99,
    imagem:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Cetirizina 10 mg",
    descricao: "12 comprimidos",
    tipo: "Referência",
    farmacia: "Farmácia Vida",
    preco: 18.99,
    imagem:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "AAS 100 mg",
    descricao: "30 comprimidos",
    tipo: "Similar",
    farmacia: "Saúde Popular",
    preco: 9.99,
    imagem:
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Dramina 50 mg",
    descricao: "10 comprimidos",
    tipo: "Referência",
    farmacia: "Bem Estar",
    preco: 16.99,
    imagem:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=85"
  },

  {
    nome: "Vitamina C 500 mg",
    descricao: "30 comprimidos",
    tipo: "Similar",
    farmacia: "Farmácia Vida",
    preco: 13.99,
    imagem:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=85"
  }

];


const searchInput =
document.getElementById("searchInput");

const sortSelect =
document.getElementById("sortSelect");

const typeSelect =
document.getElementById("typeSelect");

const pharmacySelect =
document.getElementById("pharmacySelect");

const productsGrid =
document.getElementById("productsGrid");

const resultsCount =
document.getElementById("resultsCount");

const emptyState =
document.getElementById("emptyState");


function formatarPreco(valor) {
    
  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


function atualizarProdutos() {

  const pesquisa =
    searchInput.value
      .toLowerCase()
      .trim();


  let resultados =
    medicamentos.filter(
      medicamento =>

        medicamento.nome
          .toLowerCase()
          .includes(pesquisa)

    );


  if (typeSelect.value !== "all") {

    resultados =
      resultados.filter(
        medicamento =>
          medicamento.tipo ===
          typeSelect.value
      );

  }


  if (pharmacySelect.value !== "all") {

    resultados =
      resultados.filter(
        medicamento =>
          medicamento.farmacia ===
          pharmacySelect.value
      );

  }


  if (sortSelect.value === "priceAsc") {

    resultados.sort(
      (a, b) =>
        a.preco - b.preco
    );

  }


  if (sortSelect.value === "priceDesc") {

    resultados.sort(
      (a, b) =>
        b.preco - a.preco
    );

  }


  productsGrid.innerHTML = "";


  resultados.forEach(
    medicamento => {

      const card =
        document.createElement("article");


      card.classList.add(
        "product-card"
      );


      card.innerHTML = `

        <img
          src="${medicamento.imagem}"
          alt="Imagem ilustrativa de ${medicamento.nome}"
          loading="lazy"
        >

        <div class="product-content">

          <span class="product-type">
            ${medicamento.tipo}
          </span>

          <h3>
            ${medicamento.nome}
          </h3>

          <p class="product-description">
            ${medicamento.descricao}
          </p>

          <p class="product-pharmacy">
            ${medicamento.farmacia}
          </p>

          <div class="product-price">
            ${formatarPreco(medicamento.preco)}
          </div>

          <a
            class="offer-button"
            href="#"
          >
            Ver oferta
          </a>

        </div>

      `;


      const botao =
        card.querySelector(
          ".offer-button"
        );


      botao.addEventListener(
        "click",
        event => {

          event.preventDefault();

          alert(
            `${medicamento.nome}

Preço demonstrativo: ${formatarPreco(medicamento.preco)}

Farmácia: ${medicamento.farmacia}`
          );

        }
      );


      productsGrid.appendChild(card);

    }
  );


  resultsCount.textContent =
    `${resultados.length} ${
      resultados.length === 1
        ? "item"
        : "itens"
    }`;


  emptyState.hidden =
    resultados.length !== 0;

}


searchInput.addEventListener(
  "input",
  atualizarProdutos
);


sortSelect.addEventListener(
  "change",
  atualizarProdutos
);


typeSelect.addEventListener(
  "change",
  atualizarProdutos
);


pharmacySelect.addEventListener(
  "change",
  atualizarProdutos
);


atualizarProdutos();