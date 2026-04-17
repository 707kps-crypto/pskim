import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import PopupModal from '@/components/PopupModal'
import { organizationSchema } from '@/lib/seo/schemas'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Google Analytics (GA4) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      {/* Event delegation: CTA clicks, phone clicks, scroll depth */}
      <Script id="event-delegation" strategy="afterInteractive">
        {`
          (function(){
            // CTA click tracking (links to #consult-form)
            document.addEventListener('click', function(e) {
              var el = e.target.closest ? e.target.closest('a[href*="#consult-form"]') : null;
              if (el && window.gtag) {
                window.gtag('event', 'cta_click', {
                  page_path: location.pathname,
                  cta_text: (el.textContent || '').trim().slice(0, 50)
                });
              }
              // Phone click tracking (tel: links)
              var tel = e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
              if (tel && window.gtag) {
                window.gtag('event', 'phone_click', {
                  page_path: location.pathname,
                  phone_number: tel.getAttribute('href').replace('tel:', '')
                });
              }
            });

            // Scroll depth tracking (25/50/75/90%)
            var scrollFired = {};
            var thresholds = [25, 50, 75, 90];
            function onScroll() {
              var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              if (docHeight <= 0) return;
              var pct = Math.round((scrollTop / docHeight) * 100);
              for (var i = 0; i < thresholds.length; i++) {
                var t = thresholds[i];
                if (pct >= t && !scrollFired[t]) {
                  scrollFired[t] = true;
                  if (window.gtag) {
                    window.gtag('event', 'scroll_depth', {
                      page_path: location.pathname,
                      depth_threshold: t
                    });
                  }
                }
              }
            }
            window.addEventListener('scroll', onScroll, { passive: true });
          })();
        `}
      </Script>

      <JsonLd data={organizationSchema()} />
      <Header />
      <main>{children}</main>
      <Footer />
      <PopupModal />
    </>
  )
}
