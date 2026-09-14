import Script from "next/script";

export function SiteIntegrations() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {clarityId && (
        <>
          <Script id="clarity-loader" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
          <Script id="clarity-privacy" strategy="afterInteractive">
            {`window.clarity && window.clarity("set", "portfolio", "lokesh-reddy");`}
          </Script>
        </>
      )}
      {analyticsId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("js",new Date());gtag("config","${analyticsId}",{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
