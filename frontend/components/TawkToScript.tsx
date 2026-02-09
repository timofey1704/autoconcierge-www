'use client'

import Script from 'next/script'

export default function TawkToScript() {
  return (
    <Script
      strategy="afterInteractive"
      id="tawk-to"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/6989e074d41d8f1c3889ef8c/1jh199iqm';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  )
}
