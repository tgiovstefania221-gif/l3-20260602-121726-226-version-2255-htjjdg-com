(function(){
  var menu=document.querySelector('[data-menu]');
  var nav=document.querySelector('[data-nav]');
  if(menu&&nav){menu.addEventListener('click',function(){nav.classList.toggle('open')})}
  document.querySelectorAll('img.cover-img,.hero-bg img,.hero-panel img,.detail-cover img,.detail-bg img').forEach(function(img){img.addEventListener('error',function(){img.classList.add('missing')})});
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('.hero-dot'));
  var current=0;
  function showSlide(i){if(!slides.length)return;current=(i+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('is-active',k===current)});dots.forEach(function(d,k){d.classList.toggle('is-active',k===current)})}
  dots.forEach(function(d){d.addEventListener('click',function(){showSlide(parseInt(d.getAttribute('data-dot')||'0',10))})});
  if(slides.length>1){setInterval(function(){showSlide(current+1)},5200)}
  function applyFilters(scope){var root=scope||document;var q=(root.querySelector('.site-search')||{}).value||'';var year=(root.querySelector('.year-filter')||{}).value||'';var type=(root.querySelector('.type-filter')||{}).value||'';q=q.trim().toLowerCase();root.querySelectorAll('.movie-card').forEach(function(card){var hay=[card.getAttribute('data-title'),card.getAttribute('data-genre'),card.getAttribute('data-region'),card.getAttribute('data-type')].join(' ').toLowerCase();var ok=(!q||hay.indexOf(q)>-1)&&(!year||card.getAttribute('data-year')===year)&&(!type||card.getAttribute('data-type')===type);card.classList.toggle('is-hidden',!ok)})}
  document.querySelectorAll('.site-search,.year-filter,.type-filter').forEach(function(el){el.addEventListener('input',function(){applyFilters(document)});el.addEventListener('change',function(){applyFilters(document)})});
  document.querySelectorAll('[data-player]').forEach(function(box){
    var video=box.querySelector('video');
    var trigger=box.querySelector('[data-play]');
    var stream=box.getAttribute('data-stream');
    var started=false;
    function start(){
      if(!video||!stream||started)return;
      started=true;
      video.controls=true;
      if(window.Hls&&window.Hls.isSupported()){
        var hls=new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
      }else{
        video.src=stream;
      }
      box.classList.add('playing');
      var p=video.play();
      if(p&&p.catch){p.catch(function(){})}
    }
    if(trigger){trigger.addEventListener('click',function(e){e.preventDefault();start()})}
    box.addEventListener('click',function(e){if(e.target===box||e.target.closest('.player-overlay'))start()});
  });
})();