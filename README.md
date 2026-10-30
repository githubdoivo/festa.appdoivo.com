# festa.appdoivo.com

**Festa** between parties: the painted cottage from the party app's login screen and a
countdown to the next party. At party time this address is pointed at the real app
(Fly app `appdoivo`, from the private archive repo) and back here afterwards.

- The date works itself out every year: Ivo's birthday is 15 September; the party is
  that weekend (from the Friday) when the 15th falls on a weekend, else the next
  weekend. To pin a date, set `OVERRIDE` in `index.html`.
- "Try the Demo" opens https://festa-demo.appdoivo.com.
- English and Portuguese (`?lang=`, then the last choice, then the browser).

Everything is in `index.html`; the art is `img/cottage.webp`. `npm test` runs the
Playwright tests (desktop + phone). Hosted free on GitHub Pages.
