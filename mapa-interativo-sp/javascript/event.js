//Script que pega as info dos json e alimenta a toolbox e a info-container

document.addEventListener('DOMContentLoaded', () => {
  fetch('dados/data.json') 
    .then(response => response.json())
    .then(data => {
      const paths = document.querySelectorAll('path');
      const tooltip = document.getElementById('tooltip');
      const map = document.getElementById('map-container');
      const poloInfoDiv = document.getElementById('polo-info');
      const municipioNameDiv = document.getElementById('municipio-name');

      let isMouseInside = false;

      if (!paths.length) {
        console.error("Nenhum elemento 'path' encontrado.");
      }

      paths.forEach(path => {
        path.addEventListener('mouseenter', (e) => {
          const id = path.getAttribute('data-id');
          const info = data[id];

          tooltip.style.display = 'block';
          tooltip.innerHTML = `
            <strong>${info.title}</strong><br>
            Polos: ${info.polos}
          `;
          tooltip.style.left = e.pageX + 10 + 'px';
          tooltip.style.top = e.pageY + 10 + 'px';

          isMouseInside = true;
        });

        path.addEventListener('mousemove', (e) => {
          tooltip.style.left = e.pageX + 10 + 'px';
          tooltip.style.top = e.pageY + 10 + 'px';
        });

        path.addEventListener('mouseleave', () => {
          isMouseInside = false;

          setTimeout(() => {
            if (!isMouseInside) {
              tooltip.style.display = 'none';
            }
          }, 50);
        });

       
        path.addEventListener('click', (e) => {
          const id = path.getAttribute('data-id');
          const info = data[id];
          const poloIds = info.polo; 

          fetch('dados/polos.json') 
            .then(response => {
              if (!response.ok) {
                throw new Error('Erro ao carregar polos.json');
              }
              return response.json();
            })
            .then(polosData => {
              let polosInfoHTML = ''; 

              
              municipioNameDiv.innerHTML = `<h3>Município: ${info.title}</h3>`;

              poloIds.forEach((poloId, index) => {
                const poloInfo = polosData.find(polo => polo['Cód'] === poloId);

                if (poloInfo) {
                  polosInfoHTML += `
                    <h3>Informações do Polo: ${poloInfo.Polo}</h3>
                    <strong>Início do Polo:</strong> ${poloInfo['Início do Polo']}<br>
                    <strong>Tipo:</strong> ${poloInfo['Tipo']}<br>
                    <strong>Endereço:</strong> ${poloInfo['Endereço']}, ${poloInfo['Número']}<br>
                    <strong>Bairro:</strong> ${poloInfo['Bairro']}<br>
                    <strong>Cep:</strong> ${poloInfo['Cep do Polo']}<br>
                    <strong>Telefone:</strong> ${poloInfo['Telefone do Polo']}<br>
                    <strong>E-mail:</strong> ${poloInfo['E-mail do Polo']}<br>
                    <hr style="border: 1px solid #ccc; margin: 15px 0;">
                  `;
                } else {
                  polosInfoHTML += `<p>Informações do polo com código ${poloId} não encontradas.</p>`;
                }
              });

              poloInfoDiv.innerHTML = polosInfoHTML || '<p>Não há informações de polos disponíveis.</p>';
            })
            .catch(err => {
              console.error('Erro ao carregar os dados do polo:', err);
              poloInfoDiv.innerHTML = `<p>Este município não possui polos registrados.</p>`;
            });
        });
      });

      map.addEventListener('mousemove', () => {
        if (!isMouseInside) {
          tooltip.style.display = 'none';
        }
      });
    })
    .catch(err => console.error('Erro ao carregar o arquivo JSON: ', err));
});


// mudar cor de acordo com numero de polo 
document.addEventListener('DOMContentLoaded', () => {
  fetch('dados/data.json') 
    .then(response => response.json())
    .then(data => {
      const paths = document.querySelectorAll('path');

      if (!paths.length) {
        console.error("Nenhum elemento 'path' encontrado.");
      }

      paths.forEach(path => {
        const id = path.getAttribute('data-id');
        const info = data[id];

        if (info && info.polos > 0) {
          
          path.classList.add('has-polos');
        } else {
          
          path.classList.add('no-polos');
        }
      });
    })
    .catch(err => console.error('Erro ao carregar o arquivo JSON: ', err));
});
