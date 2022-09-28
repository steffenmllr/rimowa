import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {
    DOMParser
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const getData = async () => {
  const text = await fetch(
    "https://www.rimowa.com/de/de/luggage/colour/blue/cabin/83253814.html"
  ).then((res) => res.text());
  const document = new DOMParser().parseFromString(text,"text/html",);
  const av = document?.getElementsByClassName('js-product-availability')
  if (!av || av.length === 0) {
    return "nicht verfügbar";
  }
  return av[0].innerText
};

async function handler(_req: Request) {
  const text = await fetch(
    "https://www.rimowa.com/de/de/luggage/colour/white/cabin/83253664.html"
  ).then((res) => res.text());
const stock = await getData();
  const data = {
    stock
  };
  const body = JSON.stringify(data, null, 2);
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

serve(handler);
// await getData();
