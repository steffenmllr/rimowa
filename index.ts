import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {
    DOMParser
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const getData = async (url: string) => {


  const text = await fetch(url).then((res) => res.text());
  const document = new DOMParser().parseFromString(text,"text/html",);
  const av = document?.getElementsByClassName('js-product-availability')
  if (!av || av.length === 0) {
    return "nicht verfügbar";
  }
  const result = av[0].innerText.trim();
  console.log(`Checking: ${url} - ${result}`);

  const apiKey = "7d3e57fd32af2e46ad2f467fa9e30865";
  const secretKey = "428b4aed2dbae9f09be9703a966c08d1";

  if (result !== "Nicht verfügbar") {
    const paylod = {
        Messages: [
          {
            From: {
              Email: "steffen@mllrsohn.com",
              Name: "Steffen Müller",
            },
            To: [
              {
                Email: "hello@steffen.io",
                Name: "Steffen",
              },
              {
                Email: 'lottalampenschirm@me.com',
                Name: "Lotta",
              }
            ],
            Subject: "Rimowa verfügbar",
            TextPart: `und zwar hier: ${url}`,
            HTMLPart: `und zwar hier: ${url}`,
          },
        ],
      };
      await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(apiKey + ":" + secretKey),
          Accept: "application/json",
        },
        body: JSON.stringify(paylod),
      }).then((r) => r.json());
  }

};

async function handler(_req: Request) {
  await getData("https://www.rimowa.com/de/de/luggage/colour/blue/cabin/83253814.html");
  await getData("https://www.rimowa.com/de/de/luggage/colour/blue/cabin/83253614.html");
  const data = {
    stock: 'ok'
  };
  const body = JSON.stringify(data, null, 2);
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

serve(handler);

