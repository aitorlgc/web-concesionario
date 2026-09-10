/* ==========================================================================
   MODO M — código Konami. También se activa tecleando "M3".
   ========================================================================== */
import { toast } from './toast.js';

const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export function initKonami(onOn){
  let i = 0, word = '';
  const fire = () => {
    const html = document.documentElement;
    const on = html.getAttribute('data-mmode') !== 'on';
    html.setAttribute('data-mmode', on ? 'on' : 'off');
    toast(on ? '/// MODO M ACTIVADO — bienvenido a Motorsport' : 'Modo M desactivado', on ? 'ok' : '');
    if (on) onOn?.();
  };
  addEventListener('keydown', e => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) return;
    i = e.key === CODE[i] ? i + 1 : (e.key === CODE[0] ? 1 : 0);
    if (i === CODE.length){ i = 0; fire(); }
    if (e.key.length === 1){
      word = (word + e.key).toUpperCase().slice(-4);
      if (word.endsWith('M3') || word.endsWith('E30')){ word = ''; fire(); }
    }
  });
}
