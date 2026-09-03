const locationPopup = document.getElementById('locPopup');
const cepBox = document.getElementById('cepBox');

const locOpen = document.getElementById('locOpen');
const locClose = document.getElementById('locClose');
const decline = document.getElementById('decline');
const allow = document.getElementById('allow');

const cepOpen = document.getElementById('cepOpen');
const cepClose = document.getElementById('cepClose');
const cepInput = document.getElementById('cepInput');
const saveCep = document.getElementById('saveCep');



// janela pop up de localização

locOpen.addEventListener('click', () => {
  locationPopup.hidden = false;
});

function fecharPopupLocalizacao() {
  locationPopup.hidden = true;
}

locClose.addEventListener('click', fecharPopupLocalizacao);
decline.addEventListener('click', fecharPopupLocalizacao);


allow.addEventListener('click', () => {
  fecharPopupLocalizacao();

  if (!navigator.geolocation) {
    alert('Seu navegador não suporta geolocalização.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      alert('Localização ativada com sucesso!');
    },

    () => {
      alert(
        'Não foi possível acessar sua localização. Você pode informar o CEP.'
      );
    }
  );
});


// janela do CEP

cepOpen.addEventListener('click', () => {
  cepBox.hidden = false;
  cepInput.focus();
});

cepClose.addEventListener('click', () => {
  cepBox.hidden = true;
});

// salvar CEP

saveCep.addEventListener('click', () => {

  const cep = cepInput.value
    .replace(/\D/g, '')
    .trim();

  if (cep.length !== 8) {
    alert('Digite um CEP válido com 8 dígitos.');
    return;
  }

  const cepFormatado =
    cep.substring(0, 5) +
    '-' +
    cep.substring(5);

  localStorage.setItem(
    'pharmafindCep',
    cepFormatado
  );

  cepInput.value = cepFormatado;

  cepBox.hidden = true;

  alert(
    `CEP ${cepFormatado} definido para a consulta.`
  );

}); 


// carregar o CEP já salvo no localStorage

const cepSalvo =
  localStorage.getItem('pharmafindCep');

if (cepSalvo) {
  cepInput.value = cepSalvo;
}


// fechar as janelas com a tecla ESC

document.addEventListener('keydown', (event) => {

  if (event.key === 'Escape') {
    locationPopup.hidden = true;
    cepBox.hidden = true;
  }

});


// fechar a janela de localização ao clicar fora 

locationPopup.addEventListener('click', (event) => {

  if (event.target === locationPopup) {
    fecharPopupLocalizacao();
  }

});