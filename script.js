// Fallback sem JS: marca o html como "js" o quanto antes; o estado escondido da
// animação só vale sob html.js (isso é feito inline no <head> do HTML, antes
// deste arquivo carregar, para evitar flash de conteúdo invisível).

// Animação de entrada, sem biblioteca. Só transform/opacity, zero layout shift.
(function(){
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Vídeo de topo: se o usuário pediu menos movimento, pausa o vídeo em vez
  // de deixar rodando (o CSS já esconde o elemento nesse caso, isso é reforço).
  var video = document.querySelector('.video-fundo');
  if(video && reduz){ video.pause(); }

  // Carrossel de avaliações: as setas rolam a trilha por card, respeitando o
  // scroll-snap; funciona junto com o arraste/swipe nativo do navegador.
  // Fica antes dos "returns" abaixo pra funcionar mesmo com menos movimento.
  var trilho = document.getElementById('avaliacaoTrilho');
  var setaAnterior = document.querySelector('[data-carrossel-anterior]');
  var setaProxima = document.querySelector('[data-carrossel-proxima]');
  if(trilho && setaAnterior && setaProxima){
    var passoTrilho = function(){
      var card = trilho.querySelector('.avaliacao-print');
      if(!card){ return trilho.clientWidth; }
      var estilo = window.getComputedStyle(trilho);
      var espaco = parseFloat(estilo.gap || estilo.columnGap || '20') || 20;
      return card.getBoundingClientRect().width + espaco;
    };
    setaAnterior.addEventListener('click', function(){
      trilho.scrollBy({ left: -passoTrilho(), behavior: reduz ? 'auto' : 'smooth' });
    });
    setaProxima.addEventListener('click', function(){
      trilho.scrollBy({ left: passoTrilho(), behavior: reduz ? 'auto' : 'smooth' });
    });
  }

  // Hero anima no load (cascata rápida). Sem esperar scroll.
  // requestAnimationFrame garante que o estado inicial já foi pintado antes de transitar.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      document.body.classList.add('carregado');
    });
  });

  // Se o usuário pediu menos movimento, mostra tudo estático e não observa nada.
  if(reduz){
    var todos = document.querySelectorAll('.anima');
    for(var i=0;i<todos.length;i++){ todos[i].classList.add('visivel'); }
    return;
  }

  // Blocos abaixo do hero: entram na viewport via IntersectionObserver.
  var alvos = document.querySelectorAll('main section:not(.hero) .anima, .rodape .anima');
  if(!('IntersectionObserver' in window)){
    for(var j=0;j<alvos.length;j++){ alvos[j].classList.add('visivel'); }
    return;
  }
  var obs = new IntersectionObserver(function(entradas, observador){
    entradas.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visivel');
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  for(var k=0;k<alvos.length;k++){ obs.observe(alvos[k]); }
})();
