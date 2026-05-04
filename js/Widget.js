(function() {
  var WIDGET_URL = 'https://preview-sandbox--69f91e4a477333d3fbfe891c.base44.app/widget';
  var W = Math.min(360, window.innerWidth - 32);
  var H = Math.min(520, window.innerHeight - 110);

  var btn = document.createElement('button');
  btn.title = 'Assistente Mente Ativa';
  btn.innerHTML = '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'28\' height=\'28\'><path d=\'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z\'/><path d=\'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z\'/></svg>';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:#3a9e72;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.25);z-index:99999;transition:transform 0.2s;display:flex;align-items:center;justify-content:center;padding:0;';
  btn.onmouseenter = function(){ btn.style.transform='scale(1.08)'; };
  btn.onmouseleave = function(){ btn.style.transform='scale(1)'; };

  var iframe = document.createElement('iframe');
  iframe.src = WIDGET_URL;
  iframe.style.cssText = 'position:fixed;bottom:86px;right:20px;width:' + W + 'px;height:' + H + 'px;border:none;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:99998;display:none;';
  iframe.allow = 'microphone';

  var closeSvg = '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'22\' height=\'22\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'18\' y1=\'6\' x2=\'6\' y2=\'18\'/><line x1=\'6\' y1=\'6\' x2=\'18\' y2=\'18\'/></svg>';
  var open = false;
  btn.onclick = function() {
    open = !open;
    iframe.style.display = open ? 'block' : 'none';
    btn.innerHTML = open ? closeSvg : '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'28\' height=\'28\'><path d=\'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z\'/><path d=\'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z\'/></svg>';
  };

  document.body.appendChild(iframe);
  document.body.appendChild(btn);
})();
