/* ==========================================================================
   EL TALLER
   ========================================================================== */
import { $ } from '../lib/util.js';
import { SERVICIOS, PROCESO, EQUIPO } from '../data/site.js';

export function initTaller(){
  const srv = $('#srv-full');
  if (srv){
    srv.innerHTML = SERVICIOS.map((s, i) => `
      <article class="sf" data-reveal>
        <div class="sf__n"><span class="mono">/${s.num}</span></div>
        <div class="sf__main">
          <h3 class="sf__t">${s.titulo}</h3>
          <p class="sf__d">${s.desc}</p>
        </div>
        <ul class="sf__list">${s.puntos.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="sf__tag"><span class="badge badge--hot">${s.tag}</span></div>
      </article>`).join('');
    void i0();
  }

  const proc = $('#proceso-list');
  if (proc){
    proc.innerHTML = PROCESO.map(p => `
      <li class="pz" data-reveal>
        <span class="pz__n">${p.n}</span>
        <div class="pz__b">
          <h3 class="pz__t">${p.t}</h3>
          <p class="pz__d">${p.d}</p>
        </div>
      </li>`).join('');
  }

  const eq = $('#equipo');
  if (eq){
    eq.innerHTML = EQUIPO.map(p => `
      <article class="pers" data-reveal>
        <div class="pers__av" aria-hidden="true">
          <span>${p.ini}</span>
          <svg viewBox="0 0 120 120" class="pers__ring"><circle cx="60" cy="60" r="56"/></svg>
        </div>
        <h3 class="pers__n">${p.n}</h3>
        <p class="pers__r">${p.r}</p>
        <p class="pers__y mono">${p.y}</p>
        <p class="pers__d">${p.d}</p>
      </article>`).join('');
  }
}

function i0(){ return 0; }
